/*
  Warnings:

  - You are about to alter the column `albumsCredit` on the `SubscriptionPlan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `validityDays` on the `SubscriptionPlan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `SubscriptionPlan` ADD COLUMN `colorCode` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    MODIFY `albumsCredit` INTEGER NOT NULL,
    MODIFY `validityDays` INTEGER NOT NULL;
