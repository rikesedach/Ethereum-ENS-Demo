var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  console.log("=====================================");
	console.log("== truffle Migrations");
  console.log("=====================================");
  
  deployer.deploy(Migrations);
};
