// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AssetManagement {
    struct Asset {
        string uuid;
        address owner;
        string details;
    }

    mapping(string => Asset) public assets;
    mapping(string => address[]) public assetHistory;

    event AssetCreated(string uuid, address owner);
    event OwnershipTransferred(string uuid, address from, address to);

    function createAsset(string memory _uuid, string memory _details) public {
        require(assets[_uuid].owner == address(0), "Asset already exists.");
        assets[_uuid] = Asset(_uuid, msg.sender, _details);
        assetHistory[_uuid].push(msg.sender);
        emit AssetCreated(_uuid, msg.sender);
    }

    function transferOwnership(string memory _uuid, address _newOwner) public {
        require(assets[_uuid].owner == msg.sender, "Only owner can transfer.");
        address previousOwner = assets[_uuid].owner;
        assets[_uuid].owner = _newOwner;
        assetHistory[_uuid].push(_newOwner);
        emit OwnershipTransferred(_uuid, previousOwner, _newOwner);
    }

    function getAssetOwner(string memory _uuid) public view returns (address) {
        return assets[_uuid].owner;
    }

    function getAssetHistory(string memory _uuid) public view returns (address[] memory) {
        return assetHistory[_uuid];
    }
}