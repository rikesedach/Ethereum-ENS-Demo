pragma solidity ^0.5.0;

import "./ReverseRegistrar.sol";
/**
Simple demo contract for a planet
 */

contract Planet {
    string public name;
    
    constructor  (string memory _name) public {
        name = _name;
    }

    /**
    @param 
     */
    function register( ReverseRegistrar reverseRegistrar) public {
        reverseRegistrar.setName(string(abi.encodePacked(name, '.planet.eth')));
    }

}