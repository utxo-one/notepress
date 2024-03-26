const readline = require("readline");
const fs = require("fs");
const WebSocket = require("ws");
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

// Function to retrieve relay list based on NPUB key
async function retrieveRelayList(npub) {
  return new Promise((resolve, reject) => {
    const relayUrl = "wss://purplepag.es";
    const ws = new WebSocket(relayUrl);

    ws.on("open", () => {
      const subscriptionId = "relay_list_subscription";
      const filters = {
        authors: [npub],
        kinds: [10002],
      };
      ws.send(JSON.stringify(["REQ", subscriptionId, filters]));
    });

    ws.on("message", (message) => {
      const data = JSON.parse(message);
      if (data[0] === "EVENT" && data[1] === "relay_list_subscription") {
        const relayList = data[2];
        ws.close();
        resolve(relayList);
      }
    });

    ws.on("error", (err) => {
      reject(err);
    });
  });
}

// Function to write config.js based on user input and relay list
async function writeConfig() {
  const relays = [];
  const npub = await prompt("Enter your NPUB key: ");
  const hexkey = bech32ToHex(npub); // Convert NPUB to hexadecimal

  try {
    const relayList = await retrieveRelayList(hexkey);
    relayList.tags.forEach((tag) => {
      if (tag[0] === "r") {
        relays.push(`"wss://${tag[1].replace("wss://", "")}"`);
      }
    });

    const excludeNotes = [];
    while (true) {
      const exclude = await prompt(
        "Enter any note IDs you want to exclude (leave empty to finish): "
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

    fs.writeFileSync("config.js", configContent);
    console.log("Config file created successfully.");
  } catch (error) {
    console.error("Error retrieving relay list:", error);
  } finally {
    rl.close();
  }
}

// Run the function
writeConfig();
