// Connect to the Ethereum blockchain using Web3.js
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // Set your Ethereum node URL
    web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY'));
}

// Set the address of your deployed smart contract
const contractAddress = '0xYourSmartContractAddress';

// Set the ABI (Application Binary Interface) of your smart contract
const contractABI = [
    // Add your contract's ABI here
    // Example:
    // {
    //     "constant": true,
    //     "inputs": [],
    //     "name": "getPosts",
    //     "outputs": [{"name": "", "type": "string[]"}],
    //     "type": "function"
    // }
];

// Create an instance of the contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Get posts from the smart contract and display them on the website
function getPosts() {
    contract.methods.getPosts().call()
        .then(posts => {
            const postsContainer = document.getElementById('posts');
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.textContent = post;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error(error));
}

// Execute the getPosts function when the page loads
window.onload = function () {
    getPosts();
};
