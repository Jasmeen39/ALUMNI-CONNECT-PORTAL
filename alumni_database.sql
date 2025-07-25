CREATE DATABASE  IF NOT EXISTS `alumni_connect_portal` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `alumni_connect_portal`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: alumni_connect_portal
-- ------------------------------------------------------
-- Server version	8.4.0

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
-- Table structure for table `eventregistrations`
--

DROP TABLE IF EXISTS `eventregistrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventregistrations` (
  `registrationId` int NOT NULL AUTO_INCREMENT,
  `eventId` int NOT NULL,
  `userId` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`registrationId`),
  KEY `eventId` (`eventId`),
  KEY `userId` (`userId`),
  CONSTRAINT `eventregistrations_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE CASCADE,
  CONSTRAINT `eventregistrations_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventregistrations`
--

LOCK TABLES `eventregistrations` WRITE;
/*!40000 ALTER TABLE `eventregistrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `eventregistrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `eventId` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text,
  `date` datetime NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `organizerId` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`eventId`),
  KEY `organizerId` (`organizerId`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizerId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (22,'Annual Alumni Meet','Reconnect with old friends and network with IIITV-ICD alumni.','2025-06-15 18:00:00','IIITV-ICD Campus',13,'2025-03-30 06:34:11','2025-03-30 06:34:11'),(23,'Tech Talk: AI in 2025','A discussion on the latest AI trends with experts.','2025-07-10 15:00:00','Online (Zoom)',14,'2025-03-30 06:34:11','2025-03-30 06:34:11'),(24,'Career Fair 2025','Students and alumni can connect with top recruiters.','2025-08-05 10:00:00','IIITV-ICD Auditorium',15,'2025-03-30 06:34:11','2025-03-30 06:34:11'),(25,'Startup Pitch Fest','Showcase startup ideas to investors and mentors.','2025-09-20 14:00:00','IIITV-ICD Conference Hall',16,'2025-03-30 06:34:11','2025-03-30 06:34:11'),(26,'Cybersecurity Workshop','Learn about modern cyber threats and security.','2025-10-12 16:00:00','Lab 101, IIITV-ICD',17,'2025-03-30 06:34:11','2025-03-30 06:34:11'),(27,'Hackathon 2025','A 24-hour coding competition for real-world problems.','2025-11-25 09:00:00','IIITV-ICD Innovation Lab',18,'2025-03-30 06:34:11','2025-03-30 06:34:11'),(28,'Women in Tech Conference','Discussions and networking to empower women in tech.','2025-12-03 11:00:00','Hyderabad Convention Center',19,'2025-03-30 06:34:11','2025-03-30 06:34:11'),(30,'Test Event','test description','2025-04-08 17:00:00','Diu',20,'2025-04-04 08:36:51','2025-04-04 08:36:51'),(31,'Test Event 2','test description','2025-04-01 17:00:00','IIITV-ICD',20,'2025-04-04 08:42:20','2025-04-04 08:42:20'),(32,'Test Event 3','test desc','2025-04-03 14:20:00','Diu',20,'2025-04-04 08:50:13','2025-04-04 08:50:13'),(33,'DBMS Project 2 Evaluation','test desc','2025-04-06 17:00:00','Computer Lab',20,'2025-04-04 08:56:37','2025-04-04 08:56:37');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `messageId` int NOT NULL AUTO_INCREMENT,
  `senderId` int NOT NULL,
  `receiverId` int NOT NULL,
  `content` text NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`messageId`),
  KEY `senderId` (`senderId`),
  KEY `receiverId` (`receiverId`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (20,9,20,'hi2','2025-04-03 21:40:04'),(21,20,9,'hi3','2025-04-03 21:41:14'),(22,9,20,'hi4','2025-04-03 21:42:03'),(23,20,9,'helllooooo5','2025-04-03 21:42:11'),(26,20,9,'helllooo6','2025-04-03 22:38:01'),(27,20,9,'heyy7','2025-04-03 22:46:11'),(28,20,9,'nice to connect with you','2025-04-03 22:49:09'),(29,9,20,'same here','2025-04-03 22:50:10'),(30,20,9,'glad to hear that','2025-04-03 22:52:45'),(31,9,20,'okay','2025-04-03 23:01:23');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notificationId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `message` text NOT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notificationId`),
  KEY `userId` (`userId`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `postId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `content` text NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`postId`),
  KEY `userId` (`userId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (2,5,'Anyone looking for job referrals? We are hiring for multiple roles at my company. DM me!','2025-03-30 16:47:47'),(4,9,'Throwback to our final year project days! Those late nights in the lab were worth it!','2025-03-30 16:47:47'),(6,13,'Reminder: Guest lecture on Quantum Computing tomorrow at 10 AM. See you all there!','2025-03-30 16:47:47'),(8,15,'Our department is organizing a hackathon next month! Stay tuned for the official announcement.','2025-03-30 16:47:47'),(9,16,'Working on a new research proposal for machine learning in education. Any collaborators interested?','2025-03-30 16:47:47'),(10,17,'Alumni talk series starting next week! Join us to hear from our successful graduates.','2025-03-30 16:47:47'),(19,9,'hello test post 3','2025-03-31 06:49:30');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `reportId` int NOT NULL AUTO_INCREMENT,
  `generatedBy` int NOT NULL,
  `reportType` enum('user_activity','alumni') NOT NULL,
  `content` json NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reportId`),
  KEY `generatedBy` (`generatedBy`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('alumni','faculty','student','admin') NOT NULL,
  `graduationYear` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isApproved` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (5,'John','Doe','john.doe@example.com','$2b$10$YbAhgjj8PLSNXQTlC9B8C.teNCT.BY9PWTJl7ggJkDYoJ1CNQpPPC','alumni',2015,'2025-03-06 20:38:51','2025-04-04 17:39:29',1),(9,'First','Last','test@test.com','$2b$10$wCGX.DHZbd.wOw0KnZhVcO7hSZUglo1FxwWKHhuV7ZWjVY0D/DWSG','alumni',2023,'2025-03-13 23:29:20','2025-04-04 17:43:41',1),(13,'Dr. Amit','Sharma','amit.sharma@iiitv.ac.in','hashed_password_1','faculty',NULL,'2025-03-30 06:29:32','2025-04-04 17:58:44',1),(14,'Prof. Neha','Verma','neha.verma@iiitv.ac.in','hashed_password_2','faculty',NULL,'2025-03-30 06:29:32','2025-03-30 06:29:32',0),(15,'Dr. Raj','Patel','raj.patel@iiitv.ac.in','hashed_password_3','faculty',NULL,'2025-03-30 06:29:32','2025-03-30 06:29:32',0),(16,'Prof. Anjali','Reddy','anjali.reddy@iiitv.ac.in','hashed_password_4','faculty',NULL,'2025-03-30 06:29:32','2025-03-30 06:29:32',0),(17,'Dr. Suresh','Nair','suresh.nair@iiitv.ac.in','hashed_password_5','faculty',NULL,'2025-03-30 06:29:32','2025-03-30 06:29:32',0),(18,'Prof. Vikram','Gupta','vikram.gupta@iiitv.ac.in','hashed_password_6','faculty',NULL,'2025-03-30 06:29:32','2025-03-30 06:29:32',0),(19,'Dr. Priya','Singh','priya.singh@iiitv.ac.in','hashed_password_7','faculty',NULL,'2025-03-30 06:29:32','2025-03-30 06:29:32',0),(20,'Faculty','Test1','faculty@test.com','$2b$10$tsR6bPs/R2LGXV6fTEX70.ENlFusbSpKbSASdk64qXqceKD26JDna','faculty',2000,'2025-04-02 18:25:22','2025-04-04 13:03:35',1),(21,'admin','admin','admin@alumniconnect.com','$2b$10$oGRfMp4e5jfbaXmTsH8kHOlI9tnQqrr9aehwYj47nCrtg3xYZWLcO','admin',NULL,'2025-04-04 09:28:46','2025-04-04 13:03:17',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'alumni_connect_portal'
--

--
-- Dumping routines for database 'alumni_connect_portal'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-05  0:00:04
