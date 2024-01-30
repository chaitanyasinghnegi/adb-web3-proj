import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SocialMediaPlatformContract from './SocialMediaPlatform.json';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize Web3 with MetaMask provider
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
    
          try {
            // Request account access using eth_requestAccounts
            await window.ethereum.request({ method: 'eth_requestAccounts' });
          } catch (error) {
            console.error('User denied account access');
            setError('User denied account access');
            setLoading(false);
            return;
          }
        } else if (window.web3) {
          // Legacy web3 instance
          setWeb3(new Web3(window.web3.currentProvider));
        } else {
          console.error('No web3 provider detected');
          setError('No web3 provider detected');
          setLoading(false);
          return;
        }
    
        console.log('Loading contract...');
    
        if (!web3) {
          console.error('Web3 not initialized');
          setError('Web3 not initialized');
          setLoading(false);
          return;
        }
    
        // Configure the Ethereum network (Mainnet)
        const networkId = await web3.eth.net.getId();
        if (networkId !== 1) {
          console.error('Please switch MetaMask to the Mainnet');
          setError('Please switch MetaMask to the Mainnet');
          setLoading(false);
          return;
        }
    
        const deployedNetwork = SocialMediaPlatformContract.networks[networkId];
    
        if (!deployedNetwork) {
          console.error('Contract not deployed on the Mainnet');
          setError('Contract not deployed on the Mainnet');
          setLoading(false);
          return;
        }
    
        const instance = new web3.eth.Contract(
          SocialMediaPlatformContract.abi,
          deployedNetwork.address,
        );
    
        setContract(instance);
        setLoading(false);
        console.log('Contract loaded successfully');
      } catch (error) {
        console.error('Initialization error:', error);
        setError(`Initialization error: ${error.message}`);
        setLoading(false);
      }
    };
    
    init();
  }, [web3]);

  return (
    <div>
      <h1>Social Media App</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>Your Component JSX</h2>
          {web3 && contract && (
            <>
              <p>Web3 Version: {web3.version}</p>
              <p>Contract Address: {contract.options.address}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
