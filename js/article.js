import showdown from "showdown";

export async function displayLongNote(note) {
  const container = document.getElementById("longNotesContainer");
  container.innerHTML = "";

  const noteElement = document.createElement("div");
  noteElement.className =
    "note mb-4 p-10 border border-solid border-gray-300 rounded bg-gray-100";

  const noteContent = document.createElement("div");
  noteContent.className =
    "note-content mb-10 overflow-hidden text-ellipsis break-all";

  // Adjusting classMap for larger text and better readability
  const classMap = {
    h1: "text-4xl md:text-5xl font-bold mb-10 leading-tight", // Large header
    h2: "text-3xl md:text-4xl font-bold mb-8 leading-tight", // Medium header
    h3: "text-2xl md:text-3xl font-bold mb-6 leading-tight", // Small header
    h4: "text-xl md:text-2xl font-bold mb-4 leading-tight", // Smaller header
    h5: "text-lg md:text-xl font-bold mb-3 leading-tight", // Even smaller header
    h6: "text-md md:text-lg font-bold mb-2 leading-tight", // Smallest header
    p: "text-base md:text-lg mb-6 leading-relaxed", // Paragraph
    ul: "list-disc list-inside mb-6 md:text-lg leading-relaxed", // Unordered list
    ol: "list-decimal list-inside mb-6 md:text-lg leading-relaxed", // Ordered list
    li: "mb-3 leading-relaxed", // List item
    blockquote:
      "border-l-4 border-gray-200 pl-4 italic mb-6 md:text-lg leading-relaxed", // Blockquote
    code: "font-mono bg-gray-300 p-2 rounded text-sm md:text-base", // Inline code
    pre: "block overflow-x-auto font-mono text-sm md:text-base bg-gray-800 text-white p-4 rounded", // Code block
    a: "text-blue-600 hover:underline", // Link
    strong: "font-bold", // Bold text
    em: "italic", // Italic text
    del: "line-through", // Strikethrough text
    hr: "border-t border-gray-300 my-6", // Horizontal rule
    table: "table-auto border-collapse border border-gray-300 mb-6 md:text-lg", // Table
    th: "border border-gray-300 p-2 font-bold bg-gray-100", // Table header
    td: "border border-gray-300 p-2", // Table data
    img: "max-w-full h-auto my-6", // Image
  };

  const bindings = Object.keys(classMap).map((key) => ({
    type: "output",
    regex: new RegExp(`<${key}(.*)>`, "g"),
    replace: `<${key} class="${classMap[key]}" $1>`,
  }));

  const converter = new showdown.Converter({
    extensions: [bindings],
  });
  noteContent.innerHTML = converter.makeHtml(note.content);

  noteElement.appendChild(noteContent);

  const noteMeta = document.createElement("div");
  noteMeta.className = "note-meta text-sm md:text-base text-gray-600";
  noteMeta.innerHTML = `Published: ${new Date(
    note.created_at * 1000
  ).toLocaleString()} | ID: ${note.id}`;

  noteElement.appendChild(noteMeta);

  container.appendChild(noteElement);
}
