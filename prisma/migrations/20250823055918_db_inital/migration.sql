-- CreateEnum
CREATE TYPE "public"."role" AS ENUM ('systemAdmin', 'user', 'storeOwner');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL,
    "userRole" "public"."role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_userEmail_key" ON "public"."user"("userEmail");
