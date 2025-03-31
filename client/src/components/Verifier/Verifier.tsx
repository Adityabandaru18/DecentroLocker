import { useState, useEffect } from 'react';
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
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Search, 
  ExternalLink, 
  AlertTriangle 
} from "lucide-react";
import { contractSigner, initializeContract, dummy_provider } from '../contractTemplate';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useStore from '@/store';
import { useNavigate } from "react-router-dom";

interface Document {
  id: number;
  name: string;
  uploadDate: string;
  walletAddress: string;
  status: string | 'pending' | 'rejected' | 'verified';   
  cid: string; 
  rejectReason?: string;
}

const Verifier = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [Accept, setAccept] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [authError, setAuthError] = useState(false);
  const {getWallet} = useStore();
  const wallet = getWallet();
  const navigate = useNavigate();

  const handleAccept = async (docId: number, cid: string) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === docId ? { ...doc, status: 'verified' } : doc
      )
    );
    try {
      console.log(cid);
      await contractSigner.DocumentVerificationByVerifier(true, cid, "");
    } catch (error) {
      console.error('Error accepting document:', error);
    }
    setAccept(!Accept);
    setSuccessAlert(true);
    setTimeout(() => {
      setSuccessAlert(false);
    }, 3000);
  };

  const handleReject = async (docId: number, reason: string, cid: string) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === docId ? { ...doc, status: 'rejected', rejectReason: reason } : doc
      )
    );
    setRejectReason('');
    try {
      await contractSigner.DocumentVerificationByVerifier(false, cid, reason);
    } catch (error) {
      console.error('Error rejecting document:', error);
    }
    setAccept(!Accept);
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDocument(null);
    setIsModalOpen(false);
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Check if user has the verifier role (role = 2)
        if(wallet === undefined || wallet === "") {
          const provider = await dummy_provider();
          const role = await provider?.getRole();
          const new_role = Number(role);
          if(new_role !== 3) {
            setAuthError(true);
            setTimeout(() => {
              navigate("/");
            }, 3000); // Redirect after 3 seconds
            return;
          }
        }

        await initializeContract(wallet);
        const docs = await contractSigner.GetDocumentsByVerfier();
        console.log(docs);

        if (!docs || docs.length === 0) {
          setDocuments([]);
          return;
        }

        setDocuments(() => [
          ...docs.map((doc: Document[], index: number) => ({
            id: index + 1, 
            name: doc[0],
            uploadDate: new Date(Number(doc[5]) * 1000).toLocaleString(),
            walletAddress: doc[3],
            status: "pending",
            rejectReason: "",
            cid: doc[1],
          }))
        ]);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setDocuments([]);
      }
    };
    
    fetchDocuments();
  }, [Accept, wallet, navigate]);

  if (authError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-6 w-6" />
            <AlertTitle>Authorization Failed</AlertTitle>
            <AlertDescription>
              You do not have verifier permissions to access this page. Redirecting to homepage...
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

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
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
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
                      <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => handleViewDocument(doc)}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Uploaded on: {doc.uploadDate}</p>
                    </div>
                  </div>

                  {doc.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => {
                          handleAccept(doc.id, doc.cid);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2"/>
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
                                  onClick={() => {
                                    if (selectedDoc) {
                                      handleReject(selectedDoc.id, rejectReason, selectedDoc.cid);
                                    }
                                  }}
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
            ))
          ) : (
            <Card className="text-center p-12 mt-20">
              <CardContent className="flex flex-col items-center justify-center">
                <FileText className="h-32 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No documents found</h3>
                <p className="text-gray-500 mt-2">
                  {searchTerm ? "No documents match your search criteria" : "There are no documents waiting for verification"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal to view file */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <iframe
              src={`https://gateway.pinata.cloud/ipfs/${selectedDocument.cid}`}
              className="w-full h-[500px]"
              title={selectedDocument.name}
            />
          )}
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Success Alert */}
      {successAlert && (
        <div className="fixed top-2 left-0 right-0 mx-auto w-full max-w-md animate-fade-in">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <CheckCircle className="h-4 w-4 inline-block mb-1" />
            <span className="inline-block sm:inline ml-2">Document sent to <span className='font-bold'>admin.</span></span>
          </div>
        </div>
      )}
    </>
  );
};

export default Verifier;