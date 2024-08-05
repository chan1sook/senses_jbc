//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

contract SensesIoTJBC {
	// State Variables
	address public immutable owner;

	// dashboard
	mapping (address=>string[]) _dashboardJson;
	// data part [address, map id, data]
	// ctrl also here?
	mapping (address=>mapping(uint256 => int256)) _data;
	constructor(address _owner) {
		owner = _owner;
	}

	// Modifier: used to define a set of rules that must be met before or after a function is executed
	// Check the withdraw() function
	modifier isOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == owner, "Not the Owner");
		_;
	}
}
