# A brief introduction to EMS (Ethereum Name Services)

An Internet without Domain Name Service (DNS) is hardly imaginable. Addressing resources directly on the basis of their IP address would be a difficult and an error-prone undertaking. How nice it is that there is a Domain Name Service (DNS) that makes the mapping between machine-readable IP addresses and easily understandable memorable names for humans. With the help of DNS, we can easily locate resources on the Internet, even if their IP addresses have changed in background.

A similar function as DNS on the Internet, is ENS on the Ethereum blockchain. Resources of the Ethereum blockchain are primarily Smart Contracts. Contracts are addressed via a 20 byte address, represented as a 40-digit hex string.

The core elements of the Ethereum Name Service are specified in EIP-137. These are the core elements:

+ EMS-Registry
+ Resolvers
+ Registrars

The ENS Registry is a contract that is responsible for the administration of domain names. In addition to mapping domain names to a linked resolver contract, the registry is responsible for ensuring that the owner of a domain has the permission to set up new sub-domains for this domain or to change entries in the resolver.

Revolvers are responsible for responding to resource requests to a domain and return, for example, the contract address, the ABI of a contract or the publickey of a wallet. Each domain name has a link to its resolver.

The registrar is the owner of a domain. Only the registrar has the right to register new sub-donains or change resources. Registrars are contracts or owned accounts. Top- and second-level donains are usually managed by a registrar contract. For example, the second-level domain of Mainnet is administered by a registrar which implements an auction procedure for the allocation of new domains.

Analogous to DNS, the namespace is hierarchically subdivided. Individual domains are separated by dots. The DNS structure of top-level, second-level and sub-domains has been adopted. A valid domain name is, for example, 'earth.planets.eth'.

Domain names are mapped to sha3-hashs (keccak_256). The derivation of the hash is defined by the following namehash function:

```
def namehash(name):
  if name == '':
    return '\0' * 32
  else:
    label, _, remainder = name.partition('.')
    return sha3(namehash(remainder) + sha3(label))
```
The hash of 'earth.planets.eth' is calculated as follows:
```
sha3(sha3('eth') + sha3(sha3('planets') + sha3('0x0000000000000000000000000000000000000000000000000000000000000000' + sha3('earth'))))
```
## Reverse Name Resolution
In addition to mapping a domain name to its resources such as address, ABI or publickey, ENS also supports reverse mapping from an address to its domain name. The procedure for this is described in EIP-160. For reverse mapping, the resource address is registered under the reverse domain name 'address'.addr.reverse. The resovler for the reverse domain name holds the name of the original domain. The registrar of the domain 'addr.reverse' provids a function setName('domain') under which a caller registers his domain-name.

## Example
The following example shows how to install ENS including a registrar for reverse name resolution. Deploying all contracts requires a working truffle environment and access to an Ethereum node such as Ganache.

### Step 1: Contract Deployment
In the first step all required contracts are deployed. The script '2_deploy_ENS.js' deploys the ENS-Registry (ENS.sol), the registrar for the top-level domain (FIFSRegistrar.sol), the registrar (ReverseRegistrar.sol) for the reverse domain, the resolver (PublicResolver.sol) for answering resource requests. Finally, the domains 'planets.eth' and 'addr.reverse' are registered.

The script '3_deploy_Planets.js' deploys a demo contract and registers it under the name 'earth.planets.eth' and its addresses in the domain 'addr.reverse' with the name 'earth.planets.eth'. The contract ABI is also packed in zlib format and assigned to the domain as a resource.

The entire deployment is started with the command: `truffle migrate --reset`

### Step 2: Access earth.planets.eth
The command `npm install` installs all necessary libraries. The libraries ethereum-ens and web3 are used for easy access to ENS and resources of a domain. Before start, the address of the ENS registry must be added to the script (see *const ensAddr*).

The script is started with the command `node scripts\call_Earth.v1.js`. First the script determines the address and ABI of the domain name 'earth.planet.eth', then creates a client for contract access. In the second step, the domain name stored for the address is determined and printed.

The library "ethereum-ens" simplifies the access to the ENS registry. Alternatively, the script 'scripts\call_Earth.v2.js script' shows access to the ENS registry without using "ethereum-ens". The script is started with `truffle exec scripts\call_Earth.v2.js` 

### Further Ressources
+ ENS documentation: https://docs.ens.domains/en/latest/
+ ENS specification: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-137.md 
+ ENS contract implementations: https://github.com/ensdomains/ens
+ Truffle-Framework: https://truffleframework.com/