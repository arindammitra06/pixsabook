/*
  Warnings:

  - You are about to alter the column `active` on the `SubscriptionPlan` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(4))`.
  - Made the column `albumsCredit` on table `SubscriptionPlan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `validityDays` on table `SubscriptionPlan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `creditsLeft` on table `UserSubscription` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `SubscriptionPlan` MODIFY `albumsCredit` VARCHAR(191) NOT NULL,
    MODIFY `validityDays` VARCHAR(191) NOT NULL,
    MODIFY `active` ENUM('Yes', 'No') NOT NULL DEFAULT 'Yes';

-- AlterTable
ALTER TABLE `UserSubscription` MODIFY `creditsLeft` VARCHAR(191) NOT NULL;
