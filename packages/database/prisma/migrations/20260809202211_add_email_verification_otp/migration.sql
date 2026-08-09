-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationOtp" TEXT,
ADD COLUMN     "verificationOtpExpiry" TIMESTAMP(3);
