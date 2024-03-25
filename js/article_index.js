import { excludeNotes } from "../config";

export function displayLongNoteIndex(longNotes) {
  const container = document.getElementById("longNotesContainer");
  container.innerHTML = "";
  container.className = "grid grid-cols-1 gap-4 md:grid-cols-3";

  longNotes.forEach((note) => {
    if (excludeNotes.includes(note.id)) {
      return; // Skip this note
    }

    const noteElement = document.createElement("a");
    noteElement.href = `/article/${note.id}`;
    noteElement.className =
      "block overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white";

    const noteImageContainer = document.createElement("div");
    noteImageContainer.className = "w-full h-48 note-image";
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
    title.className = "mb-2 text-lg font-semibold";
    title.textContent =
      note.tags.find((tag) => tag[0] === "title")?.[1] || "Untitled";
    noteContent.appendChild(title);

    const summary = document.createElement("p");
    summary.className = "text-sm text-gray-700 dark:text-gray-200";
    summary.textContent =
      note.tags.find((tag) => tag[0] === "summary")?.[1] || "";
    noteContent.appendChild(summary);

    container.appendChild(noteElement);
  });
}
