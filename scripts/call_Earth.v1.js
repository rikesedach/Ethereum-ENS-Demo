const ENS = require('ethereum-ens');
var Web3 = require('web3');

const ensAddr = "0xE7cd3599165d3333a1B012DD51e82C4ad6a9692e";

const providerURL = "http://localhost:8545"
var provider = new Web3.providers.HttpProvider(providerURL);
var web3 = new Web3(Web3.givenProvider || provider);

var ens = new ENS(provider, ensAddr);

(async() => {
    try {
        console.log("==> Access Earth");
        const earthNode = 'earth.planet.eth';
        const resolver = await ens.resolver(earthNode);
        const planetAddr = await resolver.addr();
        const abi = await resolver.abi();

        const planetContract = web3.eth.contract(abi);
        const planet = planetContract.at(planetAddr);
        console.log(planet.name(), 'access successfull');

        const reverseName = await ens.reverse(planetAddr.slice(2)).name();
        console.log('Reverse-Name for:', planetAddr.slice(2), 'is', reverseName);

    } catch (error) {
        console.log(error)
    }
})()
