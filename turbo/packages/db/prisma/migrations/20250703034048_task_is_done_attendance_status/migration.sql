/*
  Warnings:

  - The `status` column on the `AttendanceLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PUNCH_IN', 'PUNCH_OUT');

-- AlterTable
ALTER TABLE "AttendanceLog" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PUNCH_OUT';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "isDone" BOOLEAN NOT NULL DEFAULT false;
