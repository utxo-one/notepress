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

3. Setup the blog

```bash
node setup
```

This will ask for your npub then ask if you would like to exclude any notes by ID.

This will fetch your NIP65 preferred relay list and derive your hex key from your npub for you.

If you would like to add more relays, you can always manually edit the config and add them to the list.

4. Bundle the code

```bash
npx vite build
```

5. Deploy to your server

```bash
cp -r dist/* /var/www/notepress
```
