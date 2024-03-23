## Notepress

A minimalist blog for your nostr articles.

### Features

- No frontend framework, just plain HTML, Tailwind and JS
- Open Source under MIT License

### Installation

1. Clone the repository

```bash
git clone https://github.com/utxo-one/notepress
cd notepress
```

2. Install the dependencies

```bash
npm install
```

3. Configure the blog

Edit the `config.js` file to your liking.

```javascript
export const relays = [
  "wss://relay.utxo.one",
  "wss://relay.bitcoinpark.com",
  "wss://relay.damus.io",
  "wss://nos.lol",
];
export const npub =
  "npub1utx00neqgqln72j22kej3ux7803c2k986henvvha4thuwfkper4s7r50e8";
export const hexkey =
  "e2ccf7cf20403f3f2a4a55b328f0de3be38558a7d5f33632fdaaefc726c1c8eb";

export const excludeNotes = [
  "b2381de6b86e6e90971316e5866d4e7d9659ba44985f7b9bff0c449e25f9d566",
];
```

4. Bundle the code

```bash
npx vite build
```

5. Deploy to your server

```bash
cp -r dist/* /var/www/notepress
```
