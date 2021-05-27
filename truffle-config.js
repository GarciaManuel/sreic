const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const seed_phrase =
  "figure soldier shrimp dad cabin walk nest trip guide kiss burst mad";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    develop: {
      // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    development: {
      host: "localhost",
      port: 7545,
      gas: 672197500,
      network_id: "5777",
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          seed_phrase,
          `https://ropsten.infura.io/v3/a1ca1ffb717d43888daad284ebf5ee35`
        ),
      network_id: 3, // Ropsten's id
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },
};
