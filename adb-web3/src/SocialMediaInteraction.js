// SocialMediaInteraction.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SocialMediaPlatformContract from './SocialMediaPlatform.json';

const SocialMediaInteraction = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          await window.ethereum.enable();
        } else if (window.web3) {
          setWeb3(new Web3(window.web3.currentProvider));
        } else {
          throw new Error('No web3 provider detected');
        }

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SocialMediaPlatformContract.networks[networkId];
        const instance = new web3.eth.Contract(
          SocialMediaPlatformContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        setContract(instance);
        setLoading(false);
      } catch (error) {
        console.error('Initialization error:', error);
        setError('Error initializing Web3 and contract');
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (contract) {
          const accounts = await web3.eth.getAccounts();
          const userAddress = accounts[0];
          const userProfileResult = await contract.methods.profiles(userAddress).call();
          setUserProfile(userProfileResult);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Error fetching user profile');
      }
    };

    fetchUserProfile();
  }, [contract, web3]);

  return (
    <div>
      <h2>Social Media Interaction</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : userProfile ? (
        <div>
          <p>Username: {userProfile.username}</p>
          <p>Bio: {userProfile.bio}</p>
        </div>
      ) : null}
      {/* Add your UI elements for additional contract interactions */}
    </div>
  );
};

export default SocialMediaInteraction;
