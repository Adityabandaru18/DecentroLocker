import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {contractSigner} from "./contractTemplate";
import { useNavigate } from 'react-router-dom';
import useStore from "@/store";

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

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    role: ''
  });
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const navigate = useNavigate();
  const {getWallet} = useStore();
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const wallet = getWallet();
    if(formData.role === "user"){
      await contractSigner.RegisterUser(0);
      const filter = contractSigner.filters.UserRegistered(wallet);
      contractSigner.on(filter, () => {
        navigate('/user');
      });
    }
    else if(formData.role === "verifier"){
      await contractSigner.RegisterUser(1);
      setShowWaitingModal(true);
    }

 
  };


  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
           
              </div>

              

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="verifier">Verifier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <WaitingModal isOpen={showWaitingModal} />
    </>
  );
};

export default Signup;