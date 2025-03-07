import { ethers } from 'ethers';
import { contractABI } from "../../abi.json";

const contractAddress: string = import.meta.env.VITE_CONTRACT_ADDRESS || "";

let contractProvider: ethers.Contract;
let contractSigner: ethers.Contract;

const initializeContract = async (userWallet: string) => {
    if (!window.ethereum) {
        console.error("Ethereum provider not found");
        return;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        
        const signer = await provider.getSigner(userWallet);

        contractProvider = new ethers.Contract(contractAddress, contractABI, provider);
        contractSigner = new ethers.Contract(contractAddress, contractABI, signer);
    } catch (error) {
        console.error("Error initializing contract:", error);
    }
};


export { contractProvider, contractSigner,initializeContract };
