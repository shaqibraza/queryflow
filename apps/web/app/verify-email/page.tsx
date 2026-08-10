import { Suspense } from "react";
import VerifyEmailContent from "../../components/profile/VerifyEmailContent";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
