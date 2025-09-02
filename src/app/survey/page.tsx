import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import SurveyWizard from "@/components/survey/SurveyWizard";

export default function SurveyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <SurveyWizard />
      </main>
      <Footer />
    </div>
  );
}
