import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SocialMediaPlatformContract from './SocialMediaPlatform.json';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [postId, setPostId] = useState(0);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const deployedNetwork = SocialMediaPlatformContract.networks[networkId];
  
      if (!deployedNetwork) {
        console.error('Contract not deployed on the current network');
        setError('Contract not deployed on the current network');
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
  
  
  
  useEffect(() => {
    init();
  }, []);

  const updateProfile = async () => {
    try {
      if (contract) {
        await contract.methods.updateUserProfile(username, bio).send({ from: (await web3.eth.getAccounts())[0] });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile');
    }
  };

  const createPost = async () => {
    try {
      if (contract) {
        await contract.methods.createPost(newPostContent).send({
          value: web3.utils.toWei('0.01', 'ether'),
          from: (await web3.eth.getAccounts())[0],
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Error creating post');
    }
  };

  const getPostInfo = async () => {
    try {
      if (contract) {
        const postInfo = await contract.methods.getPost(postId).call();
        setPost(postInfo);
      }
    } catch (error) {
      console.error('Error fetching post information:', error);
      setError('Error fetching post information');
    }
  };

  return (
    <div>
      <h1>Social Media App</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <div>
            <h2>Update Profile</h2>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            <button onClick={updateProfile}>Update Profile</button>
          </div>
          <div>
            <h2>Create Post</h2>
            <input type="text" placeholder="New Post Content" value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
            <button onClick={createPost}>Create Post</button>
          </div>
          <div>
            <h2>Get Post Information</h2>
            <input type="number" placeholder="Post ID" value={postId} onChange={(e) => setPostId(e.target.value)} />
            <button onClick={getPostInfo}>Get Post Info</button>
            {post && (
              <div>
                <p>Creator: {post[0]}</p>
                <p>Content: {post[1]}</p>
                <p>Creation Time: {new Date(post[2] * 1000).toLocaleString()}</p>
                <p>Likes: {post[3]}</p>
                <p>Number of Comments: {post[4]}</p>
                {post[5].length > 0 && (
                  <div>
                    <p>Comments:</p>
                    <ul>
                      {post[5].map((comment, index) => (
                        <li key={index}>{comment}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
