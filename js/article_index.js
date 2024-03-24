import { excludeNotes } from "../config";

export function displayLongNoteIndex(longNotes) {
  const container = document.getElementById("longNotesContainer");
  container.innerHTML = "";
  container.className = "grid grid-cols-1 md:grid-cols-3 gap-4";

  longNotes.forEach((note) => {
    if (excludeNotes.includes(note.id)) {
      return; // Skip this note
    }

    const noteElement = document.createElement("a");
    noteElement.href = `/article/${note.id}`;
    noteElement.className =
      "block bg-white rounded-lg overflow-hidden shadow-lg";

    const noteImageContainer = document.createElement("div");
    noteImageContainer.className = "note-image h-48 w-full";
    noteElement.appendChild(noteImageContainer);

    if (note.tags.some((tag) => tag[0] === "image")) {
      const image = document.createElement("img");
      image.src = note.tags.find((tag) => tag[0] === "image")[1];
      image.alt = "Note Image";
      image.className = "object-cover w-full h-full";
      noteImageContainer.appendChild(image);
    }

    const noteContent = document.createElement("div");
    noteContent.className = "p-4";
    noteElement.appendChild(noteContent);

    const title = document.createElement("h3");
    title.className = "text-lg font-semibold mb-2";
    title.textContent =
      note.tags.find((tag) => tag[0] === "title")?.[1] || "Untitled";
    noteContent.appendChild(title);

    const summary = document.createElement("p");
    summary.className = "text-gray-700 text-sm";
    summary.textContent =
      note.tags.find((tag) => tag[0] === "summary")?.[1] || "";
    noteContent.appendChild(summary);

    container.appendChild(noteElement);
  });
}
