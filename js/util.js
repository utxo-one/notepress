export function stripMarkdown(markdown) {
  // Regular expression to match Markdown links, images, bold, italics, etc.
  const markdownRegex =
    /!\[[^\]]*\]\([^\)]*\)|\[([^\]]+)\]\([^\)]*\)|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_|`([^`]+)`|~~([^~]+)~~/g;
  // Replace Markdown formatting with just the text content
  let plainText = markdown.replace(markdownRegex, "$1$2$3$4$5$6$7");

  // Further strip any remaining Markdown symbols like >, #, *, -, etc.
  plainText = plainText.replace(/[#>*-]+/g, "").trim();

  return plainText;
}

async function parseAndReplaceNostrProfiles(content, ndk) {
  const profileRegex = /nostr:(npub1[0-9a-z]+)/g;
  let match;

  // Reset the lastIndex property of the regex to ensure it starts from the beginning of the string
  profileRegex.lastIndex = 0;

  while ((match = profileRegex.exec(content)) !== null) {
    const notedNpub = match[1];
    console.log("Found Nostr profile reference:", notedNpub);
    try {
      // Corrected the property name to 'npub' when calling getUser
      const user = await ndk.getUser({ npub: notedNpub }); // Use the correct property name
      await user.fetchProfile();

      const userName =
        user.profile.name || user.profile.displayName || "Unknown user";
      const profileLink = `<a href="https://primal.net/p/${notedNpub}" target="_blank">${userName}</a>`;

      content = content.replace(`nostr:${notedNpub}`, profileLink);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  return content;
}

function parseAndReplaceImageUrls(content) {
  const urlRegex = /https?:\/\/\S+\.(jpg|jpeg|png|gif|webp|svg)\b/g;
  content = content.replace(urlRegex, (match) => {
    return `<div style="text-align: center;"><img src="${match}" style="max-width: 100%; height: auto; margin-top: 1em;"></div>`;
  });
  return content;
}

async function processNoteContent(content, ndk) {
  // Parse Nostr profiles first
  content = await parseAndReplaceNostrProfiles(content, ndk);

  // Then parse and replace image URLs
  content = parseAndReplaceImageUrls(content);

  return content;
}
