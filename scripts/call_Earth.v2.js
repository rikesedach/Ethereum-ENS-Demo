var namehash = require('eth-ens-namehash').hash;
var zlib = require('pako');
var convertHex = require('convert-hex');

var Planet = artifacts.require("Planet");
var Resolver = artifacts.require("PublicResolver");
var ENS = artifacts.require("ENS");

module.exports = async function(done) {
    try {
        console.log("==> Access Earth");
        const earthNode = namehash('earth.planet.eth');

        var ens = await ENS.deployed();
        var resolverAddr = await ens.resolver(earthNode);

        var resolver = await Resolver.at(resolverAddr);
        var planetAddr = await resolver.addr(earthNode);

        const zippedABI = await resolver.ABI(earthNode, 2);
        const byteABI = convertHex.hexToBytes(zippedABI[1]);
        // console.log("ABI:", zlib.inflate(byteABI, { to: 'string' }));

        var planet = await Planet.at(planetAddr);
        console.log(await planet.name(), 'access successfull');

        console.log("==> Reverse Earth-Access");
        var reverseLookup = namehash(planetAddr.slice(2) + '.addr.reverse');
        resolverAddr = await ens.resolver(reverseLookup);
        resolver = await Resolver.at(resolverAddr);
        console.log("Reverse Name", await resolver.name(reverseLookup));

    } catch (error) {
        console.log(error);
    }
    done();
}