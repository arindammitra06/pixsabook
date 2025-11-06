-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userType` ENUM('Viewer', 'Editor', 'Admin') NOT NULL,
    `resetPasswordFlag` INTEGER NOT NULL DEFAULT 0,
    `resetPasswordCode` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `thumbnailUrl` VARCHAR(191) NULL,
    `active` ENUM('Yes', 'No') NOT NULL DEFAULT 'Yes',
    `email` VARCHAR(191) NULL,
    `mobile` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_mobile_key`(`mobile`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Album` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `albumName` VARCHAR(191) NULL,
    `albumDesc` VARCHAR(191) NULL,
    `active` ENUM('Yes', 'No') NOT NULL DEFAULT 'Yes',
    `coverImage` VARCHAR(191) NULL,
    `imageUrls` JSON NULL,
    `likesByEmail` JSON NULL,
    `rating` INTEGER NOT NULL DEFAULT 0,
    `createdById` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Viewers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Viewers_AB_unique`(`A`, `B`),
    INDEX `_Viewers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Album` ADD CONSTRAINT `Album_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Album` ADD CONSTRAINT `Album_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Viewers` ADD CONSTRAINT `_Viewers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Album`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Viewers` ADD CONSTRAINT `_Viewers_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
