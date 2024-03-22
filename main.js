import NDK from "@nostr-dev-kit/ndk";
import { hexkey, npub, relays } from "./config";

async function fetchData() {
  try {
    const ndk = new NDK({ explicitRelayUrls: relays });
    await ndk.connect();

    const user = await fetchUserProfile(ndk);
    updateUserProfile(user.profile);

    const notes = await fetchNotes(ndk);
    displayNotes(notes, ndk);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchUserProfile(ndk) {
  const user = ndk.getUser({ npub });
  await user.fetchProfile();
  return user;
}

function updateUserProfile(profile) {
  document.getElementById("name").textContent =
    profile.name || profile.displayName;
  document.getElementById("about").textContent = profile.about;
  document.getElementById("lud16").textContent = profile.lud16;
  document.getElementById("lud16").href = `lightning:${profile.lud16}`;
  document.getElementById("image").src = profile.image;
  document.getElementById("website").href = profile.website;
  document.getElementById("website").textContent = profile.website;
}

async function fetchNotes(ndk) {
  const kind1filter = { kinds: [1], authors: [hexkey] };
  return ndk.fetchEvents(kind1filter);
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
async function displayNotes(notes, ndk) {
  const container = document.getElementById("notesContainer");
  container.innerHTML = "";

  for (const note of notes) {
    const noteElement = document.createElement("div");
    noteElement.className = "note";

    const content = await processNoteContent(note.content, ndk);

    noteElement.innerHTML = `
            <div class="note-content">${content}</div>
            <div class="note-meta">
                <span>Published: ${new Date(
                  note.created_at * 1000
                ).toLocaleString()}</span>
                <span>ID: ${note.id}</span>
            </div>
        `;

    container.appendChild(noteElement);
  }
}

fetchData();
