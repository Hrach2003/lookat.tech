-- AlterTable
ALTER TABLE "comment" ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "post" ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "reply" ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "twoFactorAuthSecret" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);
