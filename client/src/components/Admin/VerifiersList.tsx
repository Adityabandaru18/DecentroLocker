import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Search } from 'lucide-react';
import { initializeContract, contractSigner } from "../contractTemplate";
import { Input } from '@/components/ui/input';

interface Verifier {
  id: number;
  walletAddress: string;
  status: 'pending' | 'approved' | 'rejected';
}

const VerifiersList = () => {
  const [verifiers, setVerifiers] = useState<Verifier[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<Record<number, boolean>>({});

  const fetchVerifiers = async () => {
    setIsLoading(true);
    try {
      await initializeContract("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      const walletAddresses = await contractSigner.GetVerifierRegistrationsByAdmin();
      console.log("Fetched wallet addresses:", walletAddresses);

      const processedVerifiers: Verifier[] = Array.isArray(walletAddresses) 
        ? walletAddresses.map((item, index) => ({
            id: index + 1,
            walletAddress: item,
            status: 'pending' as const
          }))
        : [];

      setVerifiers(processedVerifiers);
    } catch (error) {
      console.error("Error fetching verifiers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiers();
  }, []);

  const handleAccept = async (id: number) => {
    const verifier = verifiers.find(v => v.id === id);
    if (!verifier) return;
    
    setIsProcessing(prev => ({ ...prev, [id]: true }));
    
    try {
      await initializeContract("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      await contractSigner.VerifierRegistration(verifier.walletAddress, true);
      
      setVerifiers(verifiers.map(verifier =>
        verifier.id === id ? { ...verifier, status: 'approved' } : verifier
      ));
    } catch (error) {
      console.error("Error approving verifier:", error);
    } finally {
      setIsProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id: number) => {
    const verifier = verifiers.find(v => v.id === id);
    if (!verifier) return;
    
    setIsProcessing(prev => ({ ...prev, [id]: true }));
    
    try {
      await initializeContract("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      await contractSigner.VerifierRegistration(verifier.walletAddress, false);
      
      setVerifiers(verifiers.map(verifier =>
        verifier.id === id ? { ...verifier, status: 'rejected' } : verifier
      ));
    } catch (error) {
      console.error("Error rejecting verifier:", error);
    } finally {
      setIsProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  // Filter verifiers based on search term
  const filteredVerifiers = verifiers.filter(verifier => 
    verifier.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-4xl mx-auto mt-10">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl text-center font-bold mb-6">Pending Verifier Approvals</CardTitle>
        <div className="relative mb-4">
          <div className="rounded-md border border-input ring-offset-background">
            <div className="flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search wallet address..."
                className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center p-8">Loading verifiers...</div>
        ) : (
          <div>
            <div className="bg-gray-50 p-4 mb-2 rounded-md flex justify-between mt-2">
              <div className="font-medium text-left">Wallet Address</div>
              <div className="font-medium text-right">Actions</div>
            </div>
            
            {filteredVerifiers.length > 0 ? (
              filteredVerifiers.map((verifier) => (
                <div key={verifier.id} className="py-4 border-b border-gray-100 flex justify-between items-center">
                  <div className="font-mono text-sm truncate max-w-md px-4">{verifier.walletAddress}</div>
                  <div className="flex space-x-2">
                    {verifier.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleAccept(verifier.id)}
                          className="bg-green-500 hover:bg-green-600 text-white rounded-md"
                          size="sm"
                          disabled={isProcessing[verifier.id]}
                        >
                          <Check size={16} className="mr-1" /> Accept
                        </Button>
                        <Button
                          onClick={() => handleReject(verifier.id)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-md"
                          size="sm"
                          disabled={isProcessing[verifier.id]}
                        >
                          <X size={16} className="mr-1" /> Reject
                        </Button>
                      </>
                    )}
                    {verifier.status === 'approved' && (
                      <span className="text-green-500 flex items-center">
                        <Check size={16} className="mr-1" /> Approved
                      </span>
                    )}
                    {verifier.status === 'rejected' && (
                      <span className="text-red-500 flex items-center">
                        <X size={16} className="mr-1" /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-gray-500">
                {searchTerm ? "No matching verifiers found" : "No pending verifier approvals"}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifiersList;