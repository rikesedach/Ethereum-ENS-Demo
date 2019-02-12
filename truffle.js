module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "10762", // Match any network id
            gas: 16000000
        },
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    },
};