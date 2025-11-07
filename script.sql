INSERT INTO `pixsabook`.`User` (`id`, `userType`, `name`, `location`, `active`, `email`, `createdBy`, `updatedBy`) VALUES ('1', 'Admin', 'Arindam Mitra', 'Kolkata', 'Yes', 'arindammitra06@gmail.com', '1', '1');
INSERT INTO `pixsabook`.`User` (`id`, `userType`, `name`, `location`, `active`, `email`, `createdBy`, `updatedBy`) VALUES ('2', 'Admin', 'Tamajit Das', 'Kolkata', 'Yes', 'tamajitdas1997@gmail.com', '1', '1');

-- Subscriptions

INSERT INTO `pixsabook`.`SubscriptionPlan` (`id`, `name`, `price`, `albumsCredit`, `validityDays`, `colorCode`, `description`, `active`) VALUES ('1', 'Trial', '0', '5', '30', '#27d3f5', '5 albums for a month|Lifetime availability for clients|Unlimited Bandwidth|Easy usage on Web or Mobile App', 'Yes');
INSERT INTO `pixsabook`.`SubscriptionPlan` (`id`, `name`, `price`, `albumsCredit`, `validityDays`, `colorCode`, `description`, `active`) VALUES ('2', 'Bronze', '599', '10', '365', '#cd7f32', '10 albums/Yr|Lifetime availability for clients|Unlimited Bandwidth|Easy usage on Web or Mobile App', 'Yes');
INSERT INTO `pixsabook`.`SubscriptionPlan` (`id`, `name`, `price`, `albumsCredit`, `validityDays`, `colorCode`, `description`, `active`) VALUES ('3', 'Silver', '1299', '25', '365', '#c0c0c0', '25 albums/Yr|Lifetime availability for clients|Unlimited Bandwidth|Easy usage on Web or Mobile App', 'Yes');
INSERT INTO `pixsabook`.`SubscriptionPlan` (`id`, `name`, `price`, `albumsCredit`, `validityDays`, `colorCode`, `description`, `active`) VALUES ('4', 'Gold', '2499', '50', '365', '#d4af37', '50 albums/Yr|Lifetime availability for clients|Unlimited Bandwidth|Easy usage on Web or Mobile App', 'Yes');
