// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SocialMediaPlatform {

    address public owner;
    uint256 public postIdCounter;

    // Mapping to store user profiles
    mapping(address => UserProfile) public profiles;

    // Mapping to store posts
    mapping(uint256 => Post) public posts;

    // Event to log post creation
    event PostCreated(uint256 postId, address creator, string content);

    // Event to log post interaction (likes, comments, etc.)
    event PostInteraction(uint256 postId, address user, string interactionType);

    // Structure to store user profiles
    struct UserProfile {
        string username;
        string bio;
    }

    // Structure to store a post
    struct Post {
        address creator;
        string content;
        uint256 creationTime;
        uint256 likes;
        string[] comments;
    }

    // Constructor to initialize the contract
    constructor() {
        owner = msg.sender;
    }

    // Function to create/update a user profile
    function updateUserProfile(string memory username, string memory bio) public {
        UserProfile storage profile = profiles[msg.sender];
        profile.username = username;
        profile.bio = bio;
    }

    // Function to create a new post
    function createPost(string memory content) public payable {
        require(bytes(content).length > 0, "Content cannot be empty");
        require(msg.value >= 0.01 ether, "Insufficient ether for posting");

        // Update post details
        posts[postIdCounter] = Post(msg.sender, content, block.timestamp, 0, new string[](0));
        emit PostCreated(postIdCounter, msg.sender, content);
        postIdCounter++;
    }

    // Function to like a post
    function likePost(uint256 postId) public payable {
        Post storage post = posts[postId];
        require(post.creator != address(0), "Post does not exist");
        require(msg.value >= 0.005 ether, "Insufficient ether for liking");

        // Update post likes
        post.likes++;
        emit PostInteraction(postId, msg.sender, "Like");
    }

    // Function to comment on a post
    function commentOnPost(uint256 postId, string memory comment) public payable {
        Post storage post = posts[postId];
        require(post.creator != address(0), "Post does not exist");
        require(msg.value >= 0.01 ether, "Insufficient ether for commenting");
         post.comments.push(comment);
        emit PostInteraction(postId, msg.sender, "Comment");
    }

    // Function to withdraw ether from the contract (only owner)
    function withdrawEther() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    // Function to get the next available post ID
    function getNextPostID() public view returns (uint256) {
        return postIdCounter;
    }
    
    function getPostComments(uint256 postId) public view returns (string[] memory){
    return posts[postId].comments;
    }

    function getPost(uint256 postId) public view returns (address, string memory, uint256, uint256, uint256, string[] memory){
    Post storage post = posts[postId];
    return (post.creator, post.content, post.creationTime, post.likes, post.comments.length, post.comments);
    }

}