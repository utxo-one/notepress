import NDK from "@nostr-dev-kit/ndk";
import { hexkey, npub, relays } from "./config";

async function fetchData() {
  const ndk = new NDK({
    explicitRelayUrls: relays,
  });

  await ndk.connect();

  const user = ndk.getUser({
    npub: npub,
  });

  await user.fetchProfile();
  const profile = user.profile;

  document.getElementById("name").textContent =
    profile.name || profile.displayName;
  document.getElementById("about").textContent = profile.about;
  document.getElementById("lud16").textContent = profile.lud16;
  document.getElementById("lud16").href = `lightning:${profile.lud16}`;
  document.getElementById("image").src = profile.image;
  document.getElementById("website").href = profile.website;
  document.getElementById("website").textContent = profile.website;

  const kind1filter = { kinds: [1], authors: [hexkey] };
  let kind1s = await ndk.fetchEvents(kind1filter);

  // Assuming `events` is a Set or array of event objects
  const container = document.getElementById("notesContainer");
  container.innerHTML = ""; // Clear existing content

  kind1s.forEach((note) => {
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
