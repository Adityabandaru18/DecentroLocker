import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider | any;
  }
}

const Login: React.FC = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [currentSelected, setCurrentSelected] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    checkConnected();
  }, []);

  const checkConnected = async () => {
    if (window.ethereum) {
      try {
        const accs = await window.ethereum.request({ method: 'eth_accounts' });
        if (accs && accs.length > 0) {
          setAccounts(accs);
          setCurrentSelected(accs[0]);
        }
      } catch (error) {
        setError("Connection Error!");
        setTimeout(() => setError(""), 2000);
      }
    } else {
      setError("Please install MetaMask!");
      setTimeout(() => setError(""), 2000);
    }
  };

  const connectWallet = async (): Promise<void> => {
    if (window.ethereum) {
      try {
        setIsLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts: string[] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(accounts);
        setCurrentSelected(accounts[0]);
      } catch (error: any) {
        if (error.code === 4001) {
          setError("User refused to connect!");
          setTimeout(() => setError(""), 2000);
        }
        console.error("Error connecting to MetaMask:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask and try again.");
    }
  };

  const handleAccountSelect = (value: string) => {
    setCurrentSelected(value);
  };

  const connectButtonHandler = async () => {
    setIsLoading(true);
    if (accounts.includes(currentSelected)) {
      // Handle existing account connection
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        // Navigate or handle successful connection here
      } catch (error) {
        console.error("Error connecting with selected account:", error);
      }
    } else {
      await connectWallet();
    }
    setIsLoading(false);
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
            Select an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account">Select Account</Label>
              <Select value={currentSelected} onValueChange={handleAccountSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account, index) => (
                    <SelectItem key={index} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                  {accounts.length === 0 && (
                    <SelectItem value="new">New Account</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <Button
              onClick={connectButtonHandler}
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 318.6 318.6">
                  <path style={{ fill: "#ffffff" }} d="M274.1 35.5l-99.5 73.9L193 65.8z" />
                </svg>
              )}
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;