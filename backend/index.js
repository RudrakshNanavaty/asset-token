const express = require('express');
const app = express();
const port = 5000;
const Web3 = require('web3');
const contract = require('@truffle/contract');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

// PostgreSQL Pool Setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'asset_management',
  password: 'your_password',
  port: 5432,
});

// Blockchain Setup
const AssetManagementJSON = require('../blockchain/build/contracts/AssetManagement.json');
const web3 = new Web3('http://localhost:8545');
let AssetManagement = contract(AssetManagementJSON);
AssetManagement.setProvider(web3.currentProvider);

app.use(bodyParser.json());

// User Registration
app.post('/api/register', async (req, res) => {
  const { password } = req.body;
  const userId = uuid.v4();
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (user_id, password) VALUES ($1, $2)', [userId, hashedPassword]);
  res.json({ userId });
});

// User Login
app.post('/api/login', async (req, res) => {
  const { userId, password } = req.body;
  const result = await pool.query('SELECT password FROM users WHERE user_id = $1', [userId]);
  if (result.rows.length === 0) return res.status(400).send('User not found.');
  const valid = await bcrypt.compare(password, result.rows[0].password);
  if (!valid) return res.status(400).send('Incorrect password.');
  res.send('Login successful.');
});

// Create Asset
app.post('/api/assets', async (req, res) => {
  const { userId, assetDetails } = req.body;
  const assetUuid = uuid.v4();
  const accounts = await web3.eth.getAccounts();
  const contractInstance = await AssetManagement.deployed();
  await contractInstance.createAsset(assetUuid, assetDetails, { from: accounts[0] });
  await pool.query('INSERT INTO assets (asset_uuid, owner_id, details) VALUES ($1, $2, $3)', [assetUuid, userId, assetDetails]);
  res.json({ assetUuid });
});

// Transfer Asset Ownership
app.post('/api/assets/transfer', async (req, res) => {
  const { assetUuid, fromUserId, toUserId } = req.body;
  const accounts = await web3.eth.getAccounts();
  const contractInstance = await AssetManagement.deployed();
  await contractInstance.transferOwnership(assetUuid, accounts[1], { from: accounts[0] });
  await pool.query('UPDATE assets SET owner_id = $1 WHERE asset_uuid = $2', [toUserId, assetUuid]);
  await pool.query('INSERT INTO asset_history (asset_uuid, from_user_id, to_user_id) VALUES ($1, $2, $3)', [assetUuid, fromUserId, toUserId]);
  res.send('Ownership transferred.');
});

// Get Asset Details
app.get('/api/assets/:assetUuid', async (req, res) => {
  const { assetUuid } = req.params;
  const result = await pool.query('SELECT * FROM assets WHERE asset_uuid = $1', [assetUuid]);
  res.json(result.rows[0]);
});

// Get Asset History
app.get('/api/assets/:assetUuid/history', async (req, res) => {
  const { assetUuid } = req.params;
  const result = await pool.query('SELECT * FROM asset_history WHERE asset_uuid = $1', [assetUuid]);
  res.json(result.rows);
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
