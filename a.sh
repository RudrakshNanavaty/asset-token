#!/bin/bash

# Root directory
mkdir -p asset-management

# Blockchain directories
mkdir -p asset-management/blockchain/build
mkdir -p asset-management/blockchain/contracts
mkdir -p asset-management/blockchain/migrations
mkdir -p asset-management/blockchain/test

# Create files in blockchain
touch asset-management/blockchain/contracts/AssetManagement.sol
touch asset-management/blockchain/migrations/1_deploy_contracts.js
touch asset-management/blockchain/truffle-config.js

# Backend directories
mkdir -p asset-management/backend

# Create files in backend
touch asset-management/backend/index.js
touch asset-management/backend/package.json

# Frontend directories
mkdir -p asset-management/frontend/public
mkdir -p asset-management/frontend/src

# Create files in frontend
touch asset-management/frontend/src/App.js
touch asset-management/frontend/src/index.js
touch asset-management/frontend/package.json

# Database directory and file
mkdir -p asset-management/database
touch asset-management/database/schema.sql

echo "Folder structure created successfully!"
