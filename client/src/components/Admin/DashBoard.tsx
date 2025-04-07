import { useState, useEffect } from 'react';
import {  AlertTriangle } from "lucide-react";
import Navbar from '../Navbar';
import useStore from '@/store';
import { dummy_provider } from '../contractTemplate';
import VerifiersList from './VerifiersList';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const {getWallet} = useStore();


  const [authError, setAuthError] = useState(false);
  const wallet = getWallet();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        if(wallet === undefined || wallet === "") {
          const provider = await dummy_provider();
          const role = await provider?.getRole();
          const new_role = Number(role);
          if(new_role !== 4) {
            setAuthError(true);
            setTimeout(() => {
              navigate("/");
            }, 3000); // Redirect after 3 seconds
            return;
          }
        }
      } catch (error) {
        console.error('Error checking authorization:', error);
        setAuthError(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    };
    
    checkAuthorization();
  }, [wallet, navigate]);





  if (authError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-6 w-6" />
            <AlertTitle>Authorization Failed</AlertTitle>
            <AlertDescription>
              You do not have admin permissions to access this dashboard. Redirecting to homepage...
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
     <div>
        <VerifiersList />
      </div>
    </>
  );
};

export default AdminDashboard;