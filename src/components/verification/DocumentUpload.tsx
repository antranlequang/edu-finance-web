'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth-neon';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, FileCheck } from 'lucide-react';

export default function DocumentUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast({
          variant: 'destructive',
          title: 'Tập tin quá lớn',
          description: 'Vui lòng chọn tập tin nhỏ hơn 5MB.'
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!user || !selectedFile || !documentType) {
      toast({
        variant: 'destructive',
        title: 'Thiếu thông tin',
        description: 'Vui lòng chọn tập tin và loại tài liệu.'
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', documentType);

      const response = await fetch('/api/verification/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      toast({
        title: 'Tải tài liệu thành công',
        description: 'Tài liệu của bạn đang chờ xác thực.'
      });
      
      setSelectedFile(null);
      setDocumentType('');
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Tải lên thất bại',
        description: error.message || 'Không thể tải tài liệu. Vui lòng thử lại.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          Xác Thực Tài Liệu
        </CardTitle>
        <CardDescription>
          Tải lên tài liệu để xác thực thành tích học tập và nâng cao cấp tài khoản.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="document-type">Loại Tài Liệu</Label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại tài liệu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transcript">Bảng điểm học tập</SelectItem>
              <SelectItem value="certificate">Chứng chỉ/Bằng cấp</SelectItem>
              <SelectItem value="recommendation">Thư giới thiệu</SelectItem>
              <SelectItem value="score_report">Bảng điểm thi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="document-file">Tải Tài Liệu</Label>
          <Input
            id="document-file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground mt-1">
Định dạng chấp nhận: PDF, JPG, PNG. Kích thước tối đa: 5MB
          </p>
        </div>

        {selectedFile && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Tập tin đã chọn:</p>
            <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || !documentType || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
Đang tải lên...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
Tải Tài Liệu
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}