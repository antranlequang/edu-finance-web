import DocumentUpload from '@/components/verification/DocumentUpload';
import DocumentList from '@/components/verification/DocumentList';

export default function VerificationPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Xác minh hồ sơ</h1>
        <p className="text-muted-foreground mt-2">
          Tải lên các tài liệu học tập của bạn để xác minh thành tích của bạn và mở khóa các mức tài khoản cao hơn.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-1 max-w-4xl mx-auto">
        <DocumentUpload />
        <DocumentList />
      </div>
    </div>
  );
}