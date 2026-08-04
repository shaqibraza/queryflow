import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Background } from "@/components/layout/background";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <Background />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-[#0d0d12]/60 px-4 py-2 text-sm text-muted transition-all duration-200 hover:border-accent/40 hover:bg-white/[0.04] hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex flex-1 items-center justify-center">
          <ProfileForm />
        </div>
      </div>
    </main>
  );
}
