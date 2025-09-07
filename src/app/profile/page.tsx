import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import EnhancedProfileDashboard from "@/components/profile/EnhancedProfileDashboard";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <EnhancedProfileDashboard />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
