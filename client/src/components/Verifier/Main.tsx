import { useState } from 'react';
import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from '../Navbar';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { FileText, CheckCircle, XCircle, Search, ExternalLink } from "lucide-react";

const VerifierDashboard = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'passport.pdf',
      uploadDate: '2024-02-14',
      size: '2.4 MB',
      userName: 'John Doe',
      walletAddress: '0x1234...5678',
      status: 'pending'
    },
    {
      id: 2,
      name: 'license.pdf',
      uploadDate: '2024-02-14',
      size: '1.8 MB',
      userName: 'Jane Smith',
      walletAddress: '0x8765...4321',
      status: 'pending'
    },
    // Add more sample documents as needed
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleAccept = (docId) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === docId ? { ...doc, status: 'verified' } : doc
      )
    );
  };

  const handleReject = (docId, reason) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === docId ? { ...doc, status: 'rejected', rejectReason: reason } : doc
      )
    );
    setRejectReason('');
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Navbar />
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Document Verification</h1>
          <p className="text-gray-500">Review and verify uploaded documents</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search documents, users, or wallets..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className={`
            hover:bg-gray-50 transition-colors
            ${doc.status === 'verified' ? 'border-l-4 border-l-green-500' : 
              doc.status === 'rejected' ? 'border-l-4 border-l-red-500' : ''}
          `}>
            <CardContent className="flex items-center p-6">
              <FileText className="h-8 w-8 text-gray-500 mr-4" />
              
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{doc.name}</h3>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  {/* <p>Uploaded by: {doc.userName}</p> */}
                  <p>Uploaded on: {doc.uploadDate}</p>
                  {doc.status === 'rejected' && (
                    <p className="text-red-500">Reason: {doc.rejectReason}</p>
                  )}
                </div>
              </div>

              {doc.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleAccept(doc.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setSelectedDoc(doc)}
                        >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Document</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="reason">Rejection Reason</Label>
                          <Input
                            id="reason"
                            placeholder="Enter reason for rejection"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(selectedDoc.id, rejectReason)}
                            >
                              Confirm Rejection
                            </Button>
                          </DialogClose>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {doc.status === 'verified' && (
                <span className="text-green-600 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Verified
                </span>
              )}

              {doc.status === 'rejected' && (
                <span className="text-red-600 flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  Rejected
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
              </>
  );
};

export default VerifierDashboard;