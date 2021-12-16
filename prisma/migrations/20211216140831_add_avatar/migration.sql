/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRoleEnum" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "avatar" VARCHAR,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRoleEnum" NOT NULL DEFAULT E'USER';

-- DropEnum
DROP TYPE "user_role_enum";
