import  { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const VerifiersList = () => {
  const [verifiers, setVerifiers] = useState([
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', status: 'pending' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', status: 'pending' },
  ]);

  const handleAccept = (id: number) => {
    setVerifiers(verifiers.map(verifier => 
      verifier.id === id ? { ...verifier, status: 'approved' } : verifier
    ));
  };

  const handleReject = (id: number) => {
    setVerifiers(verifiers.map(verifier => 
      verifier.id === id ? { ...verifier, status: 'rejected' } : verifier
    ));
  };

  return (
    <Card className="w-full max-w-4xl mt-16">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Pending Verifier Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-4 border-b">Name</th>
                <th className="text-left p-4 border-b">Email</th>
                <th className="text-center p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifiers.filter(verifier => verifier.status === 'pending').map((verifier) => (
                <tr key={verifier.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {verifier.firstName} {verifier.lastName}
                  </td>
                  <td className="p-4">{verifier.email}</td>
                  <td className="p-4">
                    <div className="flex justify-center space-x-2">
                      <Button 
                        onClick={() => handleAccept(verifier.id)} 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                      >
                        <Check size={16} className="mr-1" /> Accept
                      </Button>
                      <Button 
                        onClick={() => handleReject(verifier.id)} 
                        variant="destructive"
                        size="sm"
                      >
                        <X size={16} className="mr-1" /> Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {verifiers.filter(verifier => verifier.status === 'pending').length === 0 && (
            <div className="text-center p-8 text-gray-500">
              No pending verifier approvals
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifiersList;