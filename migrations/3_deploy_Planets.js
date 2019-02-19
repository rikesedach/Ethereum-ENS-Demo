var namehash = require('eth-ens-namehash').hash;
var sha3 = require('js-sha3').keccak_256;
var zlib = require('pako');


module.exports = async function(deployer, network, accounts) {

    var Planet = artifacts.require("Planet");
    var Resolver = artifacts.require("PublicResolver");
    var ENS = artifacts.require("ENS");

    var resolver = await Resolver.deployed();
    var ens = await ENS.deployed();

    console.log("== Deploy Earth");
    const earthhNode = namehash('earth.planet.eth');
    const earth = await deployer.deploy(Planet, 'earth', { from: accounts[0] });
    await ens.setSubnodeOwner(namehash('planet.eth'), "0x" + sha3('earth'), accounts[0], { from: accounts[0] })
    await ens.setResolver(earthhNode, resolver.address, { from: accounts[0] });
    await resolver.setAddr(earthhNode, earth.address, { from: accounts[0] });

    const zippedABI = zlib.deflate(JSON.stringify(Planet.abi));
    await resolver.setABI(earthhNode, 2, zippedABI);

    console.log('== Reverse-Registration')
    await earth.register(await ens.owner(namehash('addr.reverse')));
    console.log('== Earth deployed:', earth.address);
}
