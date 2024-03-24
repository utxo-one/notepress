import NDK from "@nostr-dev-kit/ndk";
import { excludeNotes, hexkey, npub, relays } from "./config";
import showdown from "showdown";
import hashbow from "hashbow";
import "/style/output.css";

const darkModeToggle = document.getElementById("darkModeToggle");
      const html = document.documentElement;

      darkModeToggle.addEventListener("click", () => {
        html.classList.toggle("dark");
        darkModeToggle
          .querySelector("span")
          .classList.toggle("translate-x-full");
      });

async function fetchData() {
  try {
    const ndk = new NDK({ explicitRelayUrls: relays });
    await ndk.connect();

    const user = await fetchUserProfile(ndk);
    await updateUserProfile(user.profile);

    const longNotes = await fetchLongNotes(ndk);
    // const notes = await fetchNotes(ndk);

    const path = window.location.pathname;
    const match = path.match(/\/article\/(.+)/);
    if (match) {
      const noteId = match[1];
      const note = await ndk.fetchEvent(noteId);
      if (note) {
        displayLongNote(note, ndk);
      } else {
        console.error("Note not found");
      }
    } else {
      displayLongNoteIndex(longNotes, ndk);
      //   displayNotes(notes, ndk); // Assuming this should display regular notes
      document.getElementById("loadingSpinner").style.display = "none";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("loadingSpinner").style.display = "none";
  }
}

async function fetchUserProfile(ndk) {
  const user = ndk.getUser({ npub });
  await user.fetchProfile();
  console.log("User profile:", user.profile);
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

function stripMarkdown(markdown) {
  // Regular expression to match Markdown links, images, bold, italics, etc.
  const markdownRegex =
    /!\[[^\]]*\]\([^\)]*\)|\[([^\]]+)\]\([^\)]*\)|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_|`([^`]+)`|~~([^~]+)~~/g;
  // Replace Markdown formatting with just the text content
  let plainText = markdown.replace(markdownRegex, "$1$2$3$4$5$6$7");

  // Further strip any remaining Markdown symbols like >, #, *, -, etc.
  plainText = plainText.replace(/[#>*-]+/g, "").trim();

  return plainText;
}

function displayLongNoteIndex(longNotes) {
  const container = document.getElementById("longNotesContainer");
  container.innerHTML = "";
  container.className = "grid grid-cols-1 md:grid-cols-3 gap-4";

  longNotes.forEach((note) => {
    const noteId = note.id;

    if (excludeNotes.includes(noteId)) {
      return; // Skip this note
    }

    const noteElement = document.createElement("a");
    noteElement.href = `/article/${noteId}`;
    noteElement.className =
      "block bg-white dark:bg-slate-800 text-black dark:text-white rounded-lg overflow-hidden shadow-lg";

    const imageTag = note.tags.find((tag) => tag[0] === "image");
    const summaryTag = note.tags.find((tag) => tag[0] === "summary");
    const titleTag = note.tags.find((tag) => tag[0] === "title");
    const contentTag = note.tags.find((tag) => tag[0] === "content");

    const title = titleTag ? titleTag[1] : "Untitled";
    let summary = summaryTag && summaryTag[1] ? summaryTag[1] : "";

    if (!summary && contentTag && contentTag[1]) {
      const plainText = stripMarkdown(contentTag[1]);
      summary = plainText.split(/\s+/).slice(0, 10).join(" ") + "...";
    }

    const imageUrl =
      imageTag && imageTag[1] && imageTag[1].trim() !== "" ? imageTag[1] : null;
    const backgroundColor = imageUrl
      ? ""
      : `background-color: ${hashbow(title)};`;

    noteElement.innerHTML = `
            <div class="note-image h-48 w-full" style="${backgroundColor}">
                ${
                  imageUrl
                    ? `<img src="${imageUrl}" alt="Note Image" class="object-cover w-full h-full">`
                    : ""
                }
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${title}</h3>
                <p class="text-slate-700 dark:text-slate-400 text-sm">${summary}</p>
            </div>
        `;

    noteElement.onclick = (e) => {
      e.preventDefault();
      window.location.href = noteElement.href;
    };

    container.appendChild(noteElement);
  });
}

async function displayLongNote(note, ndk) {
  const container = document.getElementById("longNotesContainer");

  container.innerHTML = "";

  const classMap = {
    h1: "text-2xl font-bold my-4", // Tailwind classes for large headers
    h2: "text-xl font-semibold my-3", // Tailwind classes for medium headers
    ul: "list-disc list-inside my-2", // Tailwind classes for unordered lists
    li: "ml-4", // Tailwind classes for list items
    p: "my-2 leading-relaxed mb-4", // Tailwind classes for paragraphs
  };

  // Generate bindings for Showdown's extension
  const bindings = Object.keys(classMap).map((key) => ({
    type: "output",
    regex: new RegExp(`<${key}(.*)>`, "g"),
    replace: `<${key} class="${classMap[key]}" $1>`,
  }));

  const converter = new showdown.Converter({ extensions: [...bindings] }); // Initialize Showdown converter

  const noteElement = document.createElement("div");
  noteElement.classList.add(
    "note",
    "mb-4", // Margin bottom 4 units
    "p-10", // Padding 10 units
    "border", // Border
    "border-solid", // Solid border style
    "border-gray-300", // Border color gray-300
    "rounded", // Rounded corners
    "bg-gray-100" // Background color gray-100
  );

  // Convert Markdown to HTML using Showdown
  const htmlContent = converter.makeHtml(note.content);

  // Create note content element
  const noteContent = document.createElement("div");
  noteContent.classList.add(
    "note-content",
    "mb-10", // Margin bottom 10 units
    "overflow-hidden", // Hide overflow text
    "text-ellipsis", // Add ellipsis if text overflows
    "break-all" // Break all words to prevent overflow
  );
  noteContent.innerHTML = htmlContent; // Use innerHTML to render HTML content

  // Create note meta element
  const noteMeta = document.createElement("div");
  noteMeta.classList.add(
    "note-meta",
    "text-sm", // Small font size
    "text-gray-600" // Text color gray-600
  );
  noteMeta.innerHTML = `
            <span>Published: ${new Date(
              note.created_at * 1000
            ).toLocaleString()}</span>
            <span>ID: ${note.id}</span>
        `;

  // Append note content and meta to note element
  noteElement.appendChild(noteContent);
  noteElement.appendChild(noteMeta);

  container.appendChild(noteElement);
  document.getElementById("loadingSpinner").style.display = "none";
}

async function fetchNotes(ndk) {
  const kind1filter = { kinds: [1], authors: [hexkey] };
  return ndk.fetchEvents(kind1filter);
}

async function fetchLongNotes(ndk) {
  const kind1filter = { kinds: [30023], authors: [hexkey] };
  const events = await ndk.fetchEvents(kind1filter);
  return events;
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

    noteElement.classList.add(
      "note",
      "mb-4", // Margin bottom 4 units
      "p-10", // Padding 10 units
      "border", // Border
      "border-solid", // Solid border style
      "border-gray-300", // Border color gray-300
      "rounded", // Rounded corners
      "bg-gray-100" // Background color gray-100
    );

    // Create note content element
    const noteContent = document.createElement("div");
    noteContent.classList.add(
      "note-content",
      "mb-10", // Margin bottom 10 units
      "overflow-hidden", // Hide overflow text
      "text-ellipsis", // Add ellipsis if text overflows
      "break-all" // Break all words to prevent overflow
    );
    noteContent.textContent = note.content;

    // Create note meta element
    const noteMeta = document.createElement("div");
    noteMeta.classList.add(
      "note-meta",
      "text-sm", // Small font size
      "text-gray-600" // Text color gray-600
    );
    noteMeta.innerHTML = `
      <span>Published: ${new Date(
        note.created_at * 1000
      ).toLocaleString()}</span>
      <span>ID: ${note.id}</span>
    `;

    // Append note content and meta to note element
    noteElement.appendChild(noteContent);
    noteElement.appendChild(noteMeta);

    container.appendChild(noteElement);
  }
}

window.onload = fetchData;
