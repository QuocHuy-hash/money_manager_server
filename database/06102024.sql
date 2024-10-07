-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (x86_64)
--
-- Host: localhost    Database: moneymanager
-- ------------------------------------------------------
-- Server version	8.0.14

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `BankAccounts`
--

DROP TABLE IF EXISTS `BankAccounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BankAccounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `bank_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `account_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `account_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `balance` decimal(10,0) DEFAULT NULL,
  `last_sync` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bankaccounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BankAccounts`
--

LOCK TABLES `BankAccounts` WRITE;
/*!40000 ALTER TABLE `BankAccounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `BankAccounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Budgets`
--

DROP TABLE IF EXISTS `Budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Budgets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `amount` decimal(10,0) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `budgets_ibfk_177` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `budgets_ibfk_178` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Budgets`
--

LOCK TABLES `Budgets` WRITE;
/*!40000 ALTER TABLE `Budgets` DISABLE KEYS */;
/*!40000 ALTER TABLE `Budgets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES (1,'Ăn uống','expense','2024-09-29 14:52:30','2024-09-29 14:52:30'),(2,'Di chuyển','expense','2024-09-29 14:52:30','2024-09-29 14:52:30'),(3,'Giải trí','expense','2024-09-29 14:52:30','2024-09-29 14:52:30'),(4,'Mua sắm','expense','2024-09-29 14:52:30','2024-09-29 14:52:30'),(5,'Hóa đơn & Tiện ích','expense','2024-09-29 14:52:30','2024-09-29 14:52:30'),(6,'Sức khỏe','expense','2024-09-29 14:52:30','2024-09-29 14:52:30'),(7,'Giáo dục','expense','2024-09-29 14:52:30','2024-09-29 14:52:30'),(8,'Lương','income','2024-09-29 14:52:30','2024-09-29 14:52:30'),(9,'Đầu tư','income','2024-09-29 14:52:30','2024-09-29 14:52:30'),(10,'Quà tặng','expense','2024-09-29 14:52:30','2024-09-29 14:52:30'),(11,'Thưởng','income','2024-09-29 14:52:30','2024-09-29 14:52:30');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FinancialGoals`
--

DROP TABLE IF EXISTS `FinancialGoals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FinancialGoals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `target_amount` decimal(10,0) DEFAULT NULL,
  `current_amount` decimal(10,0) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `financialgoals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FinancialGoals`
--

LOCK TABLES `FinancialGoals` WRITE;
/*!40000 ALTER TABLE `FinancialGoals` DISABLE KEYS */;
/*!40000 ALTER TABLE `FinancialGoals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FixedExpenses`
--

DROP TABLE IF EXISTS `FixedExpenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FixedExpenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `amount` decimal(10,0) DEFAULT NULL,
  `frequency` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `fixedexpenses_ibfk_175` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fixedexpenses_ibfk_176` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FixedExpenses`
--

LOCK TABLES `FixedExpenses` WRITE;
/*!40000 ALTER TABLE `FixedExpenses` DISABLE KEYS */;
INSERT INTO `FixedExpenses` VALUES (1,1,'Mua Ban Phim',2000000,'monthly','2024-10-01 05:00:39','2024-10-01 05:00:39',1,'Mua ban phim co bam cho suongw','2024-09-30 09:34:38','2024-09-30 09:34:38'),(2,1,'Mua Ban Phim1111',2000000,'monthly','2024-10-01 05:00:39','2024-10-01 05:00:39',3,'Mua ban phim co bam cho suongw','2024-09-30 09:39:41','2024-09-30 09:39:41'),(3,1,'Mua Ban Phim1111',2000000,'monthly','2024-10-01 05:00:39','2024-10-01 05:00:39',3,'Mua ban phim co bam cho suongw','2024-09-30 09:39:49','2024-09-30 09:39:49');
/*!40000 ALTER TABLE `FixedExpenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InvestmentPlans`
--

DROP TABLE IF EXISTS `InvestmentPlans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InvestmentPlans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `target_amount` decimal(10,0) DEFAULT NULL,
  `current_amount` decimal(10,0) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `investmentplans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InvestmentPlans`
--

LOCK TABLES `InvestmentPlans` WRITE;
/*!40000 ALTER TABLE `InvestmentPlans` DISABLE KEYS */;
/*!40000 ALTER TABLE `InvestmentPlans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Keytokens`
--

DROP TABLE IF EXISTS `Keytokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Keytokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `publicKey` json NOT NULL,
  `privateKey` json NOT NULL,
  `refreshTokensUsed` json DEFAULT NULL,
  `refreshToken` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `keytokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `keytokens_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Keytokens`
--

LOCK TABLES `Keytokens` WRITE;
/*!40000 ALTER TABLE `Keytokens` DISABLE KEYS */;
INSERT INTO `Keytokens` VALUES (1,1,'\"a1aa7e1185d8bfe154e25113888b04c2af5107a1fb4426695564900714724142f99b4b2e7a03fbb82b83bd6375ef857b22b8341d695e9544e9bdeb915f0d4e64\"','\"25bb6c3b8c03210d7cf44ade895810c81092c464f62a8057cda87259a9694979515dbac89d4c060f02a0bd4c7b8ec9b4ae4b2bf15a77439e4be36d20d7093a7e\"',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoiaHV5MTIzNDUiLCJpYXQiOjE3Mjc3ODkyNjksImV4cCI6MTcyODM5NDA2OX0.3XQs3rMmUteMOHjwMhQU6RajnNUwM0B-RijEdPJc1QQ','2024-09-29 14:39:06','2024-10-01 13:27:49');
/*!40000 ALTER TABLE `Keytokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reports`
--

DROP TABLE IF EXISTS `Reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `report_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `investment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `goal` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reports`
--

LOCK TABLES `Reports` WRITE;
/*!40000 ALTER TABLE `Reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `Reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20240910140144-create-bank-account.js'),('20240910140149-create-user.js'),('20240910140539-create-category.js'),('20240910140854-create-budget.js'),('20240910140901-create-investment-plan.js'),('20240910140907-create-financial-goal.js'),('20240910141239-create-report.js'),('20240910141340-create-fixed-expense.js'),('20240910141422-create-transaction.js'),('20240915135652-create-key-token.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Transactions`
--

DROP TABLE IF EXISTS `Transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `amount` decimal(10,0) DEFAULT NULL,
  `tid` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cusum_balance` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bookingDate` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `transaction_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `transaction_date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `bankAccount_id` int(11) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  KEY `bankAccount_id` (`bankAccount_id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `transactions_ibfk_347` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `transactions_ibfk_348` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `transactions_ibfk_349` FOREIGN KEY (`bankAccount_id`) REFERENCES `bankaccounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `transactions_ibfk_350` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Transactions`
--

LOCK TABLES `Transactions` WRITE;
/*!40000 ALTER TABLE `Transactions` DISABLE KEYS */;
INSERT INTO `Transactions` VALUES (1,NULL,1,1110000,NULL,'Mua bàn phím mới',NULL,NULL,'Chi tiêu',3,'Mua ban phim co','2024-09-27 14:01:22','2024-09-27 14:10:02','2024-09-27 14:10:02',NULL,NULL),(2,NULL,1,1110000,NULL,'Mua bàn phím mới22',NULL,NULL,'Chi tiêu',3,'Mua ban phim co22','2024-09-27 14:01:22','2024-09-27 14:11:29','2024-09-27 14:11:29',NULL,NULL),(3,NULL,1,16000000,NULL,'Lương tháng 8',NULL,NULL,'Thu nhập',8,'Nhận lương tháng 8 cty ADA','2024-09-07 14:48:00','2024-09-27 15:00:54','2024-09-27 15:00:54',NULL,NULL),(4,NULL,1,345000,NULL,'Thưởng tháng 8',NULL,NULL,'Thu nhập',8,'Tiền thưởng KPI tháng 8','2024-09-27 15:04:01','2024-09-27 15:04:49','2024-09-27 15:04:49',NULL,NULL),(5,NULL,1,200000,NULL,'Đóng tiền sân bóng',NULL,NULL,'Chi tiêu',6,'Đóng tiền sân bóng tháng 09','2024-09-29 13:33:05','2024-09-29 13:34:36','2024-09-29 13:34:36',NULL,NULL),(6,NULL,1,300000,NULL,'Đóng lãi VPBank',NULL,NULL,'Chi tiêu',5,'Đóng tiền lãi thẻ tín dụng VPBank nợ 9tr','2024-01-29 13:36:00','2024-09-29 13:37:01','2024-09-29 13:37:01',NULL,NULL),(7,NULL,1,400000,NULL,'Đóng lãi VietCredit',NULL,NULL,'Chi tiêu',5,'Đóng lãi thẻ tín dụng VietCredit nợ 9tr','2024-01-29 13:36:00','2024-09-29 13:38:05','2024-09-29 13:38:05',NULL,NULL);
/*!40000 ALTER TABLE `Transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_name` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `full_name` varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  `firstName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone_number` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `api_key` text COLLATE utf8_unicode_ci,
  `token_device` text COLLATE utf8_unicode_ci,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8_unicode_ci DEFAULT 'inactive',
  `verify` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_name` (`user_name`),
  UNIQUE KEY `users_phone_number` (`phone_number`),
  UNIQUE KEY `users_full_name_unique` (`full_name`),
  KEY `userId` (`userId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `transactions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'huy343536@gmail.com','huy12345',NULL,'Quoc','Huy','0987654321',NULL,NULL,'$2b$10$5qOCxZO26HLPT020ni3wMevGRUHWZFZi9vl/u0uLQjatn1DKI24Se','inactive',1,'2024-09-29 14:39:06','2024-09-29 14:39:26',NULL);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-06 10:36:00
