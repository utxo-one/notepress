const readline = require("readline");
const fs = require("fs");
const { bech32 } = require("bech32");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt user for input
function prompt(question) {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to convert Bech32 NPUB key to hexadecimal
function bech32ToHex(bech32String) {
  const decoded = bech32.decode(bech32String);
  const data = bech32.fromWords(decoded.words);
  return Buffer.from(data).toString("hex");
}

// Function to write config.js based on user input
async function writeConfig() {
  const relays = [];
  while (true) {
    const relay = await prompt(
      "Enter a WebSocket relay (leave empty to finish): "
    );
    if (!relay) break;
    relays.push(`"${relay}"`);
  }

  const npub = await prompt("Enter your NPUB key: ");
  const hexkey = bech32ToHex(npub); // Convert NPUB to hexadecimal

  const excludeNotes = [];
  while (true) {
    const exclude = await prompt(
      "Enter any note IDs you want to exclude, separated by comma (leave empty to finish):"
    );
    if (!exclude) break;
    excludeNotes.push(`"${exclude}"`);
  }

  const configContent = `
export const relays = [
  ${relays.join(",\n  ")}
];

export const npub = "${npub}";
export const hexkey = "${hexkey}";

export const excludeNotes = [
  ${excludeNotes.join(",\n  ")}
];
`;

  fs.writeFileSync("config1.js", configContent);
  console.log("Config file created successfully.");
  rl.close();
}

// Run the function
writeConfig();
