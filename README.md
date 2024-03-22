# Notepress

A way to show your nost notes if you hate front end frameworks.

## Getting Started

To get started with this project, clone the repository to your local machine.

```bash
git clone https://github.com/utxo-one/notepress
cd notepress
```

## Building the Project

Before building the project, make sure you have [Node.js](https://nodejs.org/) and [Vite](https://vitejs.dev/) installed on your machine. You can then run the following command in the project directory to build the application:

```bash
npx vite build
```

This command compiles the application and outputs the files to the `dist` directory.

## Configuration

Before deploying your application, you need to set up the necessary configuration in `config.js`. You will need to specify the relay URLs and the public key (`npub`) of the user profile you want to display.

Create or edit the `config.js` file in the root of your project and set the values accordingly:

```javascript
// config.js
export const relays = ["wss://relay.utxo.one", "wss://relay.bitcoinpark.com"];
export const npub =
  "npub1utx00neqgqln72j22kej3ux7803c2k986henvvha4thuwfkper4s7r50e8";
export const hexkey =
  "e2ccf7cf20403f3f2a4a55b328f0de3be38558a7d5f33632fdaaefc726c1c8eb";
```

## Deployment

Once you have built the project and configured the necessary variables, move the contents of the `dist` directory to your web server's root directory or the appropriate path where your website is hosted.

For example, if you are using a basic Nginx or Apache server, you can copy the files to the `/var/www/html` directory or a subdirectory within it, depending on your server configuration.

## Usage

After deploying the files to your web server, navigate to your website's URL in a web browser. The application should now be running and displaying the user profile and notes fetched from the specified Nostr relay.

## Contributing

Contributions to this project are welcome. Please feel free to fork the repository, make changes, and submit a pull request.

## License

This project is licensed under the MIT License. Do whatever you want!
