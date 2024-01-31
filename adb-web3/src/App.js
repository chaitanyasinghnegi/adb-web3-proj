import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SocialMediaPlatformContract from "./SocialMediaPlatform.json";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing Web3...');
    
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
    
          try {
            // Request account access using eth_requestAccounts
            await window.ethereum.request({ method: 'eth_requestAccounts' });
          } catch (error) {
            console.error('User denied account access');
            setError('User denied account access');
            setLoading(false);
            return;
          }
    
          setWeb3(web3Instance);
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
    
        const networkId = await web3.eth.net.getId();
        console.log('Network ID:', networkId);
    
        const deployedNetwork = SocialMediaPlatformContract.networks[networkId];
        console.log('Deployed Network:', deployedNetwork);
    
        if (!deployedNetwork) {
          console.error('Contract not deployed on the current network');
          setError('Contract not deployed on the current network');
          setLoading(false);
          return;
        }
    
        console.log('Contract Address:', deployedNetwork.address);
    
        const instance = new web3.eth.Contract(
          SocialMediaPlatformContract.abi,
          deployedNetwork.address
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
  }, [web3]); // Empty dependency array to run only once on mount

  const handleUpdateProfile = async () => {
    try {
      if (contract) {
        await contract.methods
          .updateUserProfile(username, bio)
          .send({ from: (await web3.eth.getAccounts())[0] });
        console.log("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCreatePost = async () => {
    try {
      if (contract) {
        await contract.methods
          .createPost(postContent)
          .send({
            from: (await web3.eth.getAccounts())[0],
            value: web3.utils.toWei("0.01", "ether"),
          });
        console.log("Post created successfully");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <h1>Social Media Platform</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>Smart Contract Information</h2>
          {web3 && contract && (
            <>
              <p>Web3 Version: {web3.version}</p>
              <p>Contract Address: {contract.options.address}</p>

              {/* Update Profile */}
              <div>
                <h3>Update Profile</h3>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <button onClick={handleUpdateProfile}>Update Profile</button>
              </div>

              {/* Create Post */}
              <div>
                <h3>Create Post</h3>
                <input
                  type="text"
                  placeholder="Post Content"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                <button onClick={handleCreatePost}>Create Post</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
