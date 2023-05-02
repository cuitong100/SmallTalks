/*
  Warnings:

  - You are about to drop the column `average_rate` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `county` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `rate` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[auth0Id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `rate` DROP FOREIGN KEY `Rate_recordId_fkey`;

-- DropForeignKey
ALTER TABLE `rate` DROP FOREIGN KEY `Rate_userId_fkey`;

-- DropForeignKey
ALTER TABLE `record` DROP FOREIGN KEY `Record_authorId_fkey`;

-- AlterTable
ALTER TABLE `record` DROP COLUMN `average_rate`,
    ADD COLUMN `likes` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `stars` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `county`,
    ADD COLUMN `auth0Id` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `country` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `rate`;

-- CreateTable
CREATE TABLE `ActionLike` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recordId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActionStar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recordId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_auth0Id_key` ON `User`(`auth0Id`);
