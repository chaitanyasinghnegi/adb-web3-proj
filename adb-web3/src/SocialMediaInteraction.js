// SocialMediaInteraction.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SocialMediaPlatformContract from './contracts/SocialMediaPlatform.json';

const SocialMediaInteraction = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [postId, setPostId] = useState(0);
  const [postContent, setPostContent] = useState('');
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const init = async () => {
      // Connect to Web3 provider
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // Request account access if needed
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

  const createPost = async () => {
    try {
      await contract.methods.createPost(postContent).send({ value: web3.utils.toWei('0.01', 'ether') });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const likePost = async () => {
    try {
      await contract.methods.likePost(postId).send({ value: web3.utils.toWei('0.005', 'ether') });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const commentOnPost = async () => {
    try {
      await contract.methods.commentOnPost(postId, commentContent).send({ value: web3.utils.toWei('0.01', 'ether') });
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  return (
    <div>
      <h2>Social Media Interaction</h2>
      <div>
        <h3>Create Post</h3>
        <input
          type="text"
          placeholder="Enter post content"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <button onClick={createPost}>Create Post</button>
      </div>
      <div>
        <h3>Interact with Post</h3>
        <input
          type="number"
          placeholder="Enter post ID"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
        />
        <button onClick={likePost}>Like Post</button>
        <br />
        <input
          type="text"
          placeholder="Enter comment content"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <button onClick={commentOnPost}>Comment on Post</button>
      </div>
    </div>
  );
};

export default SocialMediaInteraction;
