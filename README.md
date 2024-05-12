# Notepress 📰

A minimalist blog for your nostr articles.

## Features

- No frontend framework, just plain HTML, Tailwind and JS
- Open Source under MIT License

## Prerequisits

[nodeJS](https://nodejs.org/en/download)
[Git](https://git-scm.com/downloads)

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

4. Rebuild the CSS Styling

```bash
npx tailwindcss -i style/input.css -o style/output.css
```

5. Bundle the code

```bash
npx vite build
```

This will create a `dist` folder is in your project directory with index and assets. You can see what your blog will look like by opening the index.html in a browser.

6. Deploy to your server

Copy the entire contents of the dist folder to your website.

```bash
cp -r dist/* /var/www/notepress
```
