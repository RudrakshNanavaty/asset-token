import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import Web3 from 'web3';
import AssetManagementJSON from '../../blockchain/build/contracts/AssetManagement.json';

function App() {
  const [assetDetails, setAssetDetails] = useState('');
  const [assetUuid, setAssetUuid] = useState('');
  const [message, setMessage] = useState('');

  const createAsset = async () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = AssetManagementJSON.networks[networkId];
    const contract = new web3.eth.Contract(
      AssetManagementJSON.abi,
      deployedNetwork && deployedNetwork.address,
    );
    const accounts = await web3.eth.getAccounts();
    const uuid = generateUUID();
    await contract.methods.createAsset(uuid, assetDetails).send({ from: accounts[0] });
    setAssetUuid(uuid);
    setMessage('Asset created successfully!');
  };

  const generateUUID = () => {
    // Simple UUID generator
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, function () {
      return ((Math.random() * 16) | 0).toString(16);
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Asset Management
      </Typography>
      <Card>
        <CardContent>
          <TextField
            label="Asset Details"
            variant="outlined"
            fullWidth
            value={assetDetails}
            onChange={(e) => setAssetDetails(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={createAsset}>
            Create Asset
          </Button>
          {message && (
            <Typography variant="body1" color="secondary" gutterBottom>
              {message}
            </Typography>
          )}
          {assetUuid && (
            <Typography variant="body2" gutterBottom>
              Asset UUID: {assetUuid}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
