-- AlterTable
ALTER TABLE "News" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "isFeatured" DROP DEFAULT;
