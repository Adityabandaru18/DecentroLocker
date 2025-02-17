import  { useState } from 'react';
import { Card, CardContent} from "../ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Navbar from '../Navbar';

const User = () => {
  const [documents, setDocuments] = useState({
    uploaded: [
      { id: 1, name: 'passport.pdf', date: '2024-02-14', size: '2.4 MB' },
      { id: 2, name: 'license.pdf', date: '2024-02-14', size: '1.8 MB' }
    ],
    verified: [
      { id: 3, name: 'certificate.pdf', date: '2024-02-13', size: '1.2 MB' }
    ],
    rejected: [
      { id: 4, name: 'statement.pdf', date: '2024-02-12', size: '3.1 MB', reason: 'Document unclear' }
    ]
  });

  const handleFileUpload = (e: React.FormEvent<HTMLElement>) => {
    // Handle file upload logic here
    console.log('File uploaded:', e.target.files);
  };

  const DocumentList = ({ documents, type }) => (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="hover:bg-gray-50">
          <CardContent className="flex items-center p-4">
            <FileText className="h-8 w-8 text-gray-500 mr-4" />
            <div className="flex-grow">
              <h4 className="font-medium">{doc.name}</h4>
              <div className="text-sm text-gray-500">
                Uploaded on {doc.date} • {doc.size}
                {type === 'rejected' && (
                  <div>

                  {/* <p className="text-red-500">Reason: {doc.reason}</p> */}
                  <p className="font-mono text-red-500">Rejected by: Wallet Address</p>
                  </div>
                )}
                {type === 'verified' && (
                  <div>

                  <p className="font-mono text-green-500">Approved by: Wallet Address</p>
                  </div>
                )}
              </div>
            </div>
            {type === 'uploaded' && (
              <Button variant="outline" size="sm">View</Button>
            )}
            {type === 'verified' && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {type === 'rejected' && (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
    <Navbar />
    <div className="container mx-auto p-6 max-w-8xl">
    
      {/* Upload Section */}
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
              multiple
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
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="uploaded" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Uploaded ({documents.uploaded.length})
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
        <TabsContent value="verified">
          <DocumentList documents={documents.verified} type="verified" />
        </TabsContent>
        <TabsContent value="rejected">
          <DocumentList documents={documents.rejected} type="rejected" />
        </TabsContent>
      </Tabs>
    </div>
   </>
   
  );
};

export default User;