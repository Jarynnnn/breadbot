CREATE TABLE `users` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `clientid` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `lvl` VARCHAR(255) NOT NULL,
    `xp` VARCHAR(255) NOT NULL,
     PRIMARY KEY (`id`) USING BTREE
);