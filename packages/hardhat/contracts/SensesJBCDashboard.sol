//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// SensesJBCDashboard
// 6/8/2567
contract SensesJBCDashboard {
	address public immutable owner;
	uint256 public immutable version = 1;

	mapping(address => mapping(uint256 => bytes)) public dashboardData;
	mapping(address => uint256) public dashboardLength;

	constructor(address _owner) {
		owner = _owner;
	}

	function updateDashboardData(uint256 _id, bytes memory _byteData) public {
		require(_id <= dashboardLength[msg.sender], "Out of bound");
		dashboardData[msg.sender][_id] = _byteData;
		if(_id == dashboardLength[msg.sender]) { // expand slot
		  dashboardLength[msg.sender] += 1;
		}
	}
}
