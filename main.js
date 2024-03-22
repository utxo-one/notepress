import NDK from "@nostr-dev-kit/ndk";
import { hexkey, npub, relays } from "./config";
import "./style.css";

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
    noteElement.className = "note";
    noteElement.innerHTML = `
      <div class="note-content">${note.content}</div>
      <div class="note-meta">
        <span>Published: ${new Date(
          note.created_at * 1000
        ).toLocaleString()}</span>
        <span>ID: ${note.id}</span>
      </div>
    `;
    container.appendChild(noteElement);
  });
}

fetchData();
