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
