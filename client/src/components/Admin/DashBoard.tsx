import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent } from "../ui/tabs";
import { User, Mail, Phone, AlertTriangle } from "lucide-react";
import Navbar from '../Navbar';
import useStore from '@/store';
import { initializeContract, contractSigner, dummy_provider } from '../contractTemplate';
import VerifiersList from './VerifiersList';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const {getUser, getWallet, addUser} = useStore();
  const [profile, setProfile] = useState({
    firstName: getUser().firstName || '',
    lastName: getUser().lastName || '',
    email: getUser().email || '',
    phone: getUser().phoneNumber || '',
    role: getUser().role || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [authError, setAuthError] = useState(false);
  const wallet = getWallet();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Check if user has the admin role (role = 4)
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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await initializeContract(wallet);
      if(profile.role === "user") {
        await contractSigner.EditUser(profile.firstName, profile.lastName, profile.email, profile.phone);
      }
      else if(profile.role === "verifier") {
        await contractSigner.EditVerifier(profile.firstName, profile.lastName, profile.email, profile.phone);
      }
      const new_user = {
        firstName: profile.firstName, 
        lastName: profile.lastName, 
        email: profile.email, 
        phoneNumber: profile.phone, 
        role: profile.role
      };
      addUser(new_user);
      
      setIsEditing(false);
      console.log('Profile updated:', profile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your profile and account settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  {/* Profile Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profile.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                        <User className="h-4 w-4 absolute right-3 top-3 text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          />
                        <User className="h-4 w-4 absolute right-3 top-3 text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profile.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          />
                        <Mail className="h-4 w-4 absolute right-3 top-3 text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          />
                        <Phone className="h-4 w-4 absolute right-3 top-3 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    {isEditing ? (
                      <>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button type="button" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <VerifiersList />
      </div>
    </>
  );
};

export default AdminDashboard;