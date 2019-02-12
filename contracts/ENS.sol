pragma solidity ^0.5.0;

contract ENS {
    struct Record {
        address owner;
        address resolver;
        uint64 ttl;
    }

    mapping(bytes32=>Record) records;

    event NewOwner(bytes32 indexed node, bytes32 indexed label, address owner);
    event Transfer(bytes32 indexed node, address owner);
    event NewResolver(bytes32 indexed node, address resolver);

    modifier only_owner(bytes32 node) {
        if(records[node].owner != msg.sender) revert();
        _;
    }

    constructor  (address _owner) public {
        records[bytes32(0)].owner = _owner;
    }

    function owner(bytes32 _node) view public returns (address) {
        return records[_node].owner;
    }

    function resolver(bytes32 _node) view public returns (address) {
        return records[_node].resolver;
    }

    function ttl(bytes32 _node) view public returns (uint64) {
        return records[_node].ttl;
    }

    function setOwner(bytes32 _node, address _owner) only_owner(_node) public  {
        emit Transfer(_node, _owner);
        records[_node].owner = _owner;
    }

    function setSubnodeOwner(bytes32 node, bytes32 label, address _owner) only_owner(node) public  {
        bytes32 subnode = keccak256(abi.encodePacked(node, label));
        emit NewOwner(node, label, _owner);
        records[subnode].owner = _owner;
    }

    function setResolver(bytes32 node, address _resolver) only_owner(node) public {
        emit NewResolver(node, _resolver);
        records[node].resolver = _resolver;
    }

    function setTTL(bytes32 node, uint64 _ttl) only_owner(node) public {
        records[node].ttl = _ttl;
    }
}