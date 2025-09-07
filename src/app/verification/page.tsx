import DocumentUpload from '@/components/verification/DocumentUpload';
import DocumentList from '@/components/verification/DocumentList';

export default function VerificationPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Document Verification</h1>
        <p className="text-muted-foreground mt-2">
          Upload your academic documents to verify your achievements and unlock higher account levels.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-1 max-w-4xl mx-auto">
        <DocumentUpload />
        <DocumentList />
      </div>
    </div>
  );
}