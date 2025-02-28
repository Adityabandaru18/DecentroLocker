import  { useState, useEffect} from 'react';
import { Card, CardContent } from "../ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, CheckCircle, XCircle, ExternalLink, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Navbar from '../Navbar';
import axios from 'axios';
import { contractSigner, initializeContract } from "../contractTemplate";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import Modal Component
import useStore from '@/store';
interface Document {
  id: number;
  name: string;
  date: string;
  reason?: string;
  verifiedBy?: string;
  cid?: string;
}

const User = () => {
  const [documents, setDocuments] = useState<{
    uploaded: Document[];
    pending: Document[];
    verified: Document[];
    rejected: Document[];
  }>({
    uploaded: [],
    pending: [],
    verified: [],
    rejected: []
  });
  const {getWallet} = useStore();
  const wallet = getWallet();
  console.log(wallet);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null); // Track selected document
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [upload,setUpload] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      alert("No file selected!");
      return;
    }
  
    const file = e.target.files[0]; 
    const formData = new FormData();
    formData.append("file", file);
  
    const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
    const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY;
  
    try {
      const res = await axios.post(import.meta.env.VITE_PINATA_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });
  
      const cid = res.data.IpfsHash; // CID of the uploaded file
      console.log("File uploaded to IPFS, CID:", cid);
  
      const tx = await contractSigner.uploadDocumentsByUser(cid, file.name);
      await tx.wait();
      setUpload(!upload);
      
    } catch (error) {
      console.error("Error uploading file to Pinata:", error);
      alert("File upload failed!");
    }
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDocument(null);
    setIsModalOpen(false);
  };

  const DocumentList = ({ documents, type }: { documents: Document[], type: string }) => (
    <div className="space-y-4">
      {documents.map((doc: Document) => (
        <Card key={doc.id} className="hover:bg-gray-50">
          <CardContent className="flex items-center p-4">
            <FileText className="h-8 w-8 text-gray-500 mr-4" />
            <div className="flex-grow">
            <div className="flex items-center gap-1">
              <h4 className="font-medium">{doc.name}</h4>
              {(type == "rejected" || type == "verified") &&
              <Button variant="ghost" size="sm" className="h-6" onClick={() => handleViewDocument(doc)}>
                    <ExternalLink className="h-4 w-4" />
                </Button>
              }
              </div>
              <div className="text-sm text-gray-500">
              {(type === "uploaded" || type === "pending") && <span> Uploaded on {doc.date} </span>}
              {type === 'rejected' && (
                  <div>
                    <p className="font-mono text-red-500">Rejected by: {doc.verifiedBy}</p>
                    <p className="font-mono text-red-500">Reason: {doc.reason}</p>
                  </div>
                )}
                {type === 'verified' && (
                  <div>
                    <p className="font-mono text-green-500">Approved by: {doc.verifiedBy}</p>
                  </div>
                )}
              </div>
            </div>
            {(type === "uploaded" || type === "pending") && (
              <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                View
              </Button>
            )}
            {type === 'verified' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {type === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        await initializeContract(wallet);
        const docs = await contractSigner.getDocumentsByUser();
        console.log(docs);
  
        const uploadedDocs: Document[] = [];
        const pendingDocs: Document[] = [];
        const verifiedDocs: Document[] = [];
        const rejectedDocs: Document[] = [];
  
        docs.forEach((doc: unknown[], index: number) => {
          const documentObj: Document = {
            id: index + 1,
            name: doc[0] as string,
            date: new Date(Number(doc[5]) * 1000).toLocaleString(),
            reason: doc[4] as string,
            verifiedBy: doc[3] as string,
            cid: doc[1] as string,
          };
  
        uploadedDocs.push(documentObj);
        if(doc[2] === 0n || doc[2] === 1n){

          pendingDocs.push(documentObj);
        }
          
        else if (doc[2] === 2n) {
            verifiedDocs.push(documentObj);
          } else if (doc[2] === 3n) {
            rejectedDocs.push(documentObj);
          }
        });
  
        setDocuments({
          uploaded: uploadedDocs,
          pending: pendingDocs,
          verified: verifiedDocs,
          rejected: rejectedDocs,
        });
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
  
    fetchDocuments();
  }, [upload, wallet]); // Re-fetch only when a new document is uploaded
  
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 max-w-8xl">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop your files here, or click to browse
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose Files
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="uploaded" className="w-full mt-5">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="uploaded" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Uploaded ({documents.uploaded.length})
        </TabsTrigger>
        <TabsTrigger value="pending" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Pending ({documents.pending.length})
        </TabsTrigger>
        <TabsTrigger value="verified" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Verified ({documents.verified.length})
        </TabsTrigger>
        <TabsTrigger value="rejected" className="flex items-center gap-2">
          <XCircle className="h-4 w-4" />
          Rejected ({documents.rejected.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="uploaded">
        <DocumentList documents={documents.uploaded} type="uploaded" />
      </TabsContent>
      <TabsContent value="pending">
        <DocumentList documents={documents.pending} type="pending" />
      </TabsContent>
      <TabsContent value="verified">
        <DocumentList documents={documents.verified} type="verified" />
      </TabsContent>
      <TabsContent value="rejected">
        <DocumentList documents={documents.rejected} type="rejected" />
      </TabsContent>
    </Tabs>
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
      

    </>
  );
};

export default User;
