/*
  Warnings:

  - You are about to drop the column `userId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the `reply` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `publisherId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `reply` DROP FOREIGN KEY `Reply_commentId_fkey`;

-- DropForeignKey
ALTER TABLE `reply` DROP FOREIGN KEY `Reply_userId_fkey`;

-- AlterTable
ALTER TABLE `comment` DROP COLUMN `userId`,
    ADD COLUMN `parent_id` INTEGER NULL,
    ADD COLUMN `publisherId` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `reply`;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_publisherId_fkey` FOREIGN KEY (`publisherId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `Comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
