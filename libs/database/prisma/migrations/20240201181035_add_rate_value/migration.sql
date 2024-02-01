/*
  Warnings:

  - Added the required column `value` to the `Rate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rate" ADD COLUMN     "value" DECIMAL(2,1) NOT NULL;
