//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// SensesJBCData
// 6/8/2567
contract SensesJBCData {
	address public immutable owner;
	uint256 public immutable version = 1;

	struct SensesIoTData {
		uint256 ts; // ts
		int256 data; // with 18 decimal
	}

	mapping (address => mapping(uint256 => mapping(uint256 => SensesIoTData))) public data;
	mapping (address => mapping(uint256 => uint256)) public dataLength;

	constructor(address _owner) {
		owner = _owner;
	}

	function pushData(uint256 _id, int256 _data) public {
		uint256 index = dataLength[msg.sender][_id];
		data[msg.sender][_id][index].ts = block.timestamp;
		data[msg.sender][_id][index].data = _data;
		dataLength[msg.sender][_id] += 1;
	}

    function pushDataBatch(uint256[] memory _ids, int256[] memory _datas) public returns (uint256) {
        uint256 size = _ids.length;
        for(uint i = 0; i < size; i++) {
            pushData(_ids[i], _datas[i]);
        }

        return size;
	}

	function getDataLastest(address _from, uint256 _id) public view returns (uint256, int256) {
		require(dataLength[_from][_id] > 0, "No Data");

		uint256 index = dataLength[_from][_id] - 1;
		SensesIoTData memory target = data[_from][_id][index];
		return (target.ts, target.data);
	}

    function getDataPaging(address _from, uint256 _id, uint256 _offset, uint256 _size) public view returns (SensesIoTData[] memory) {
		uint256 length = dataLength[_from][_id];

		uint256 firstIndex = length;
		if(_offset < length) {
			firstIndex = _offset;
		}
        
        uint256 lastIndex = firstIndex;
		if(length > 0) {
			lastIndex += _size;
			if(lastIndex > length) {
				lastIndex = length;
			}
		}

        uint256 actualSize = lastIndex - firstIndex;
		SensesIoTData[] memory result = new SensesIoTData[](actualSize);

		for(uint256 i = 0; i < actualSize; i++) {
			result[i] = data[_from][_id][firstIndex + i];
		}
		return result;
	}
}
