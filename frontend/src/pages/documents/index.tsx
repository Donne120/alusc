import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { DocumentManager } from "../../components/documents/DocumentManager";
import { DocumentUploader } from "../../components/documents/DocumentUploader";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Documents() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Chat
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mt-4">Documents</h1>
          <Button onClick={() => setIsUploading(!isUploading)}>
            {isUploading ? "Close Upload" : "Upload Document"}
          </Button>
        </div>

        {isUploading && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Upload New Document</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentUploader onClose={() => setIsUploading(false)} />
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="myDocuments" className="mt-4">
          <TabsList>
            <TabsTrigger value="myDocuments">My Documents</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>
          <TabsContent value="myDocuments">
            <DocumentManager type="myDocuments" />
          </TabsContent>
          <TabsContent value="community">
            <DocumentManager type="community" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
