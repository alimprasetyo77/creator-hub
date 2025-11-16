-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'CREATOR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "password" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" VARCHAR(100),
    "token" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
