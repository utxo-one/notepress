import NDK from "@nostr-dev-kit/ndk";
import { excludeNotes, hexkey, npub, relays } from "../config";
import showdown from "showdown";
import hashbow from "hashbow";
import "/style/output.css";
import { stripMarkdown } from "./util";
import { fetchLongNotes, fetchUserProfile } from "./fetch";
import { displayLongNote } from "./article";
import { displayLongNoteIndex } from "./article_index";

async function bootstrap() {
  try {
    const ndk = new NDK({ explicitRelayUrls: relays });
    await ndk.connect();

    const user = await fetchUserProfile(npub, ndk);
    await updateUserProfile(user.profile);

    const longNotes = await fetchLongNotes(hexkey, ndk);

    // Page routing. If the URL contains /article/{noteId}, display the long note. Otherwise, display the note index.
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
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
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

window.onload = bootstrap;
