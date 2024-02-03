-- DropForeignKey
ALTER TABLE "Rolled" DROP CONSTRAINT "Rolled_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Rolled" DROP CONSTRAINT "Rolled_userId_fkey";

-- AddForeignKey
ALTER TABLE "Rolled" ADD CONSTRAINT "Rolled_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rolled" ADD CONSTRAINT "Rolled_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
