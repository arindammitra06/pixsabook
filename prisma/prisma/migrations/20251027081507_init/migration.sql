-- AlterTable
ALTER TABLE `Album` ADD COLUMN `isPublished` ENUM('Yes', 'No') NOT NULL DEFAULT 'No';
