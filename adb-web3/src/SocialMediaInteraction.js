// SocialMediaInteraction.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SocialMediaPlatformContract from './SocialMediaPlatform.json';

const SocialMediaInteraction = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const init = async () => {
      // Connect to Web3 provider (MetaMask or local provider)
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          await window.ethereum.enable();
        } catch (error) {
          console.error('User denied account access');
        }
      } else if (window.web3) {
        setWeb3(new Web3(window.web3.currentProvider));
      } else {
        console.error('No web3 provider detected');
      }

      // Load smart contract
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SocialMediaPlatformContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SocialMediaPlatformContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      setContract(instance);
    };

    init();
  }, [web3]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (contract) {
        try {
          const accounts = await web3.eth.getAccounts();
          const userAddress = accounts[0];
          const userProfileResult = await contract.methods.profiles(userAddress).call();
          setUserProfile(userProfileResult);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [contract, web3]);

  return (
    <div>
      <h2>Social Media Interaction</h2>
      {userProfile && (
        <div>
          <p>Username: {userProfile.username}</p>
          <p>Bio: {userProfile.bio}</p>
        </div>
      )}
      {/* Add your UI elements for additional contract interactions */}
    </div>
  );
};

export default SocialMediaInteraction;
