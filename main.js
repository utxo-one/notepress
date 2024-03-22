import NDK from "@nostr-dev-kit/ndk";
import { hexkey, npub, relays } from "./config";

async function fetchData() {
  try {
    const ndk = new NDK({ explicitRelayUrls: relays });
    await ndk.connect();

    const user = await fetchUserProfile(ndk);
    updateUserProfile(user.profile);

    const notes = await fetchNotes(ndk);
    displayNotes(notes);
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

function displayNotes(notes) {
  const container = document.getElementById("notesContainer");
  container.innerHTML = ""; // Clear existing content

  notes.forEach((note) => {
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
  });
}

fetchData();
