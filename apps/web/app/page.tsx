import { Navbar } from "@/components/layout/navbar";
import { Background } from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SupportedDatabases } from "@/components/landing/supported-databases";
import { CTA } from "@/components/landing/cta";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#09090B]">
      <Background />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <SupportedDatabases />
      <CTA />
      <Footer />
    </main>
  );
}
