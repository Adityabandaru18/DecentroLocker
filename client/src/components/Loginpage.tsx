import { useState } from "react";
import { ethers } from "ethers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Link } from "react-router-dom";
declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider;
  }
}

const Login: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");

  const connectWallet = async (): Promise<void> => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts: string[] = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]); 
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-12 h-12" viewBox="0 0 318.6 318.6">
              <path style={{ fill: "#E2761B" }} d="M274.1 35.5l-99.5 73.9L193 65.8z" />
              <path style={{ fill: "#E4761B" }} d="M44.4 35.5l98.7 74.6-17.5-44.3zm193.9 171.3l-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z" />
            </svg>
          </div>
          <CardTitle className="text-2xl text-center">Connect with MetaMask</CardTitle>
          <CardDescription className="text-center">
            Enter your wallet address to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input id="wallet" value={walletAddress} readOnly placeholder="0x..." className="w-full" />
            </div>
            <Button onClick={connectWallet} className="w-full bg-orange-500 hover:bg-orange-600">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 318.6 318.6">
                <path style={{ fill: "#ffffff" }} d="M274.1 35.5l-99.5 73.9L193 65.8z" />
              </svg>
             <Link to="/user"> Connect Wallet
             </Link> 
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
