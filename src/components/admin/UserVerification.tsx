'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth-neon';
import { updateVerificationStatus } from '@/lib/database-operations';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Check, X, ExternalLink } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { VerificationDocument } from '@/lib/database-operations';
import { format } from 'date-fns';

export default function UserVerification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingDoc, setProcessingDoc] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadPendingDocuments();
    }
  }, [user]);

  const loadPendingDocuments = async () => {
    try {
      const q = query(
        collection(db, 'verification-documents'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const querySnap = await getDocs(q);
      
      const docs: VerificationDocument[] = querySnap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type,
          name: data.name,
          fileUrl: data.fileUrl,
          status: data.status,
          verifiedBy: data.verifiedBy,
          verifiedAt: data.verifiedAt?.toDate(),
          createdAt: data.createdAt?.toDate()
        };
      });
      
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading pending documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (documentId: string, status: 'verified' | 'rejected') => {
    if (!user) return;
    
    setProcessingDoc(documentId);
    try {
      await updateVerificationStatus(documentId, status, user.email);
      toast({
        title: `Document ${status}`,
        description: `The document has been ${status} successfully.`
      });
      
      // Remove from list since it's no longer pending
      setDocuments(docs => docs.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update verification status.'
      });
    } finally {
      setProcessingDoc(null);
    }
  };

  const getDocumentTypeName = (type: string) => {
    const names = {
      transcript: 'Academic Transcript',
      certificate: 'Certificate/Diploma',
      recommendation: 'Recommendation Letter',
      score_report: 'Test Score Report'
    };
    return names[type as keyof typeof names] || type;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-32">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Verification Queue
        </CardTitle>
        <CardDescription>
          Review and verify user-submitted documents. {documents.length} documents pending.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents pending verification.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.userId}</TableCell>
                  <TableCell>{getDocumentTypeName(doc.type)}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.createdAt ? format(doc.createdAt, 'MMM dd, yyyy HH:mm') : 'Unknown'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.fileUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerification(doc.id, 'verified')}
                        disabled={processingDoc === doc.id}
                        className="text-green-600 border-green-600 hover:bg-green-100"
                      >
                        {processingDoc === doc.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerification(doc.id, 'rejected')}
                        disabled={processingDoc === doc.id}
                        className="text-red-600 border-red-600 hover:bg-red-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}