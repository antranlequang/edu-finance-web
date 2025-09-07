'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth-neon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, FileText, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import type { VerificationDocument } from '@/lib/database-operations';

export default function DocumentList() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      if (user) {
        try {
          const response = await fetch('/api/user/documents');
          if (response.ok) {
            const { documents: docs } = await response.json();
            setDocuments(docs);
          }
        } catch (error) {
          console.error('Error loading documents:', error);
        }
      }
      setIsLoading(false);
    };

    loadDocuments();
  }, [user]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'verified': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
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
          Your Documents
        </CardTitle>
        <CardDescription>
          Track the status of your uploaded verification documents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet.</p>
            <p className="text-sm">Upload your first document above to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    {getDocumentTypeName(doc.type)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(doc.status)}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.createdAt ? format(doc.createdAt, 'MMM dd, yyyy') : 'Unknown'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(doc.fileUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
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