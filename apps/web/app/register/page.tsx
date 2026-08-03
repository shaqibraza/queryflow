import type { Metadata } from "next";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { MarketingPanel } from "../../components/auth/MarketingPanel";
import { Navbar } from "../../components/layout/navbar";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Create your QueryFlow account"
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 lg:grid lg:grid-cols-[50fr_45fr]">
        <MarketingPanel />
        <AuthLayout>
          <RegisterForm />
        </AuthLayout>
      </main>
      <Footer />
    </div>
  );
}
