import { ethers } from 'ethers';
import {contractABI} from "../../abi.json"

const contractAddress: string = import.meta.env.VITE_CONTRACT_ADDRESS || "";

let contractProvider: ethers.Contract;
let contractDummyProvider: ethers.Contract;
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

        contractProvider = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), provider);
        contractSigner = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), signer);
    } catch (error) {
        console.error("Error initializing contract:", error);
    }
};

const dummy_provider = async () => {
    if (!window.ethereum) {
        console.error("Ethereum provider not found");
        return;
    }
  try{
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    contractDummyProvider = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), provider);
    return contractDummyProvider;
        
  }
  catch (error) {
    console.error("Error initializing contract:", error);
}
}


export { contractProvider, contractSigner,initializeContract, dummy_provider };
