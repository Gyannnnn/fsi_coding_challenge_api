/*
  Warnings:

  - Made the column `userAddress` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "userAddress" SET NOT NULL;
