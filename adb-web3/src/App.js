// App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SocialMediaPlatformContract from './SocialMediaPlatform.json'; // Adjust the path accordingly

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [postId, setPostId] = useState(0);
  const [post, setPost] = useState(null);

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

  const updateProfile = async () => {
    try {
      await contract.methods.updateUserProfile(username, bio).send({ from: (await web3.eth.getAccounts())[0] });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const createPost = async () => {
    try {
      await contract.methods.createPost(newPostContent).send({ value: web3.utils.toWei('0.01', 'ether'), from: (await web3.eth.getAccounts())[0] });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const getPostInfo = async () => {
    try {
      const postInfo = await contract.methods.getPost(postId).call();
      setPost(postInfo);
    } catch (error) {
      console.error('Error fetching post information:', error);
    }
  };

  return (
    <div>
      <h1>Social Media App</h1>
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
  );
};

export default App;
