import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { contractSigner, initializeContract} from "./contractTemplate";
import useStore from "@/store";
declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider;
  }
}

const WaitingModal: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>
      
      <div className="bg-white rounded-lg p-8 shadow-lg z-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">⏳</div>
        
        <h2 className="text-2xl font-bold mb-2">Verification Pending</h2>
        
        <p className="mb-6 text-gray-700">
          Please wait until an administrator approves your verification request.
        </p>
        
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
        
        <p className="text-sm text-gray-500">
          This process usually takes 1-2 business days. Thank you for your patience.
        </p>
      </div>
    </div>
  );
};

const Login: React.FC = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [currentSelected, setCurrentSelected] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showWaitingModal, setShowWaitingModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const {addWallet} = useStore();

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
        console.log("Error checking connection:", error);
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
        const accounts: string[] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(accounts);
        setCurrentSelected(accounts[0]);
        navigate('/login');
      } catch (error: unknown) {
          setError("User refused to connect!");
          setTimeout(() => setError(""), 2000);
        
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
    let new_role=null;
    if (accounts.includes(currentSelected)) {
      try {
        await initializeContract(currentSelected);
        addWallet(currentSelected);

        const Role = await contractSigner.getRole();
        new_role = Number(Role);

      } catch (error) {
        console.error("Error connecting with selected account:", error);
      }
    } else {
      console.log("connecting...")
      await connectWallet();
    }
    setIsLoading(false);
    if(new_role == null) {
      return ;
    }
    if(new_role == 0){
       navigate("/signup");  //Stranger
    }
    else if(new_role == 1){
      navigate("/user");
    }
    else if(new_role == 2){
      navigate("/verifier");  //VerifierAccepted
    }
    else if(new_role == 3){
      navigate("/admin");
    }
    else if(new_role == 5){
      setShowWaitingModal(true);      //VerifierPending
    }
  };

  
    useEffect(() => {
      let timer: number;
      
      if (showWaitingModal) {
        timer = window.setTimeout(() => {
          setShowWaitingModal(false);
          navigate('/');
        }, 5000);
      }
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [showWaitingModal, navigate]);

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
      <WaitingModal isOpen={showWaitingModal} />
    </div>
  );
};

export default Login;