-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: localhost    Database: turing
-- ------------------------------------------------------
-- Server version	5.7.29-0ubuntu0.18.04.1
create database if not exists `turing`;
use `turing`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `username` varchar(20) CHARACTER SET utf8 NOT NULL,
  `displayName` varchar(20) CHARACTER SET utf8 NOT NULL,
  `password` char(32) NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `displayName` (`displayName`),
  UNIQUE KEY `IDX_255475c4fda29aba18cda3534a` (`displayName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES ('beba','Zdenka Samardzic','nope'),('jasmina','Jasmina Dobric','nope'),('jelena','Jelena Hadzi-Puric','nope'),('micko','Brankica Djuric','nope'),('nadicadj','Nada Djordjevic','nope'),('test','Test','098f6bcd4621d373cade4e832627b4f6');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;
ALTER DATABASE `turing` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 trigger adminBD before delete on admins
    for each row
	begin
		update reports set adminComment = NULL, adminUsername = NULL where adminUsername = old.username;
	end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `turing` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ;

--
-- Table structure for table `classrooms`
--

DROP TABLE IF EXISTS `classrooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classrooms` (
  `name` varchar(20) NOT NULL,
  `location` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classrooms`
--

LOCK TABLES `classrooms` WRITE;
/*!40000 ALTER TABLE `classrooms` DISABLE KEYS */;
INSERT INTO `classrooms` VALUES ('704','Trg'),('718','Trg'),('bim','Trg'),('jag1','Jagić'),('jag2','Jagić');
/*!40000 ALTER TABLE `classrooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `computers`
--

DROP TABLE IF EXISTS `computers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `computers` (
  `id` int(11) NOT NULL,
  `classroomName` varchar(255) NOT NULL,
  `broken` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`classroomName`),
  KEY `FK_f34fd0b795007e4ecd8e4942c02` (`classroomName`),
  CONSTRAINT `FK_f34fd0b795007e4ecd8e4942c02` FOREIGN KEY (`classroomName`) REFERENCES `classrooms` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `computers`
--

LOCK TABLES `computers` WRITE;
/*!40000 ALTER TABLE `computers` DISABLE KEYS */;
INSERT INTO `computers` VALUES (0,'704',0),(0,'718',0),(0,'bim',0),(0,'jag1',0),(0,'jag2',0),(1,'704',1),(1,'718',0),(1,'bim',0),(1,'jag1',0),(1,'jag2',0),(2,'704',0),(2,'718',0),(2,'bim',0),(2,'jag1',0),(2,'jag2',0),(3,'704',0),(3,'718',0),(3,'bim',0),(3,'jag1',0),(3,'jag2',0),(4,'704',0),(4,'718',0),(4,'bim',0),(4,'jag1',0),(4,'jag2',0),(5,'704',0),(5,'718',0),(5,'bim',0),(5,'jag1',0),(5,'jag2',0),(6,'704',0),(6,'718',0),(6,'bim',0),(6,'jag1',0),(6,'jag2',0),(7,'704',0),(7,'718',0),(7,'bim',0),(7,'jag1',0),(7,'jag2',0),(8,'704',0),(8,'718',0),(8,'bim',0),(8,'jag1',0),(8,'jag2',0),(9,'704',0),(9,'718',0),(9,'bim',0),(9,'jag1',0),(9,'jag2',0),(10,'704',0),(10,'718',0),(10,'bim',0),(10,'jag1',0),(10,'jag2',0),(11,'704',0),(11,'718',0),(11,'bim',0),(11,'jag1',0),(11,'jag2',0),(12,'704',0),(12,'718',0),(12,'bim',0),(12,'jag1',0),(12,'jag2',0),(13,'704',0),(13,'718',0),(13,'bim',0),(13,'jag1',0),(13,'jag2',0),(14,'704',0),(14,'718',0),(14,'bim',0),(14,'jag1',0),(14,'jag2',0),(15,'704',0),(15,'718',0),(15,'bim',0),(15,'jag1',0),(15,'jag2',0),(16,'718',0),(16,'bim',0),(16,'jag1',0),(16,'jag2',0),(17,'718',0),(17,'bim',0),(17,'jag1',0),(17,'jag2',0),(18,'718',0),(18,'bim',0),(18,'jag1',0),(18,'jag2',0),(19,'718',0),(19,'bim',0),(19,'jag1',0),(19,'jag2',0),(20,'718',0),(20,'bim',0),(20,'jag1',0),(20,'jag2',0);
/*!40000 ALTER TABLE `computers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,1583873961057,'MigrateToV21583873961057'),(2,1588673785253,'Cascade1588673785253'),(3,1592161030947,'renameJagic1592161030947'),(4,1592256445996,'supportEmoji1592256445996');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reports` (
  `reportId` int(11) NOT NULL AUTO_INCREMENT,
  `classroomName` varchar(20) CHARACTER SET latin1 DEFAULT NULL,
  `isGeneral` tinyint(1) NOT NULL,
  `computerId` int(11) DEFAULT NULL,
  `description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `fixed` tinyint(1) NOT NULL DEFAULT '0',
  `adminComment` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `adminUsername` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `timestamp` int(11) NOT NULL,
  `urgent` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`reportId`),
  KEY `adminUsername` (`adminUsername`),
  KEY `classroomName` (`classroomName`),
  KEY `FK_a0fd1d5ec174481c9da60962f18` (`computerId`,`classroomName`),
  CONSTRAINT `FK_0d8cae6b553f4b758c8d68bcc10` FOREIGN KEY (`adminUsername`) REFERENCES `admins` (`username`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_a0fd1d5ec174481c9da60962f18` FOREIGN KEY (`computerId`, `classroomName`) REFERENCES `computers` (`id`, `classroomName`),
  CONSTRAINT `FK_ad38a0e8694c1bbfcf12f36c34a` FOREIGN KEY (`classroomName`) REFERENCES `classrooms` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (11,'jag1',0,5,'Mašina ITOBUKAWIN10 više ne radi, odnosno Windows neće da se bootuje. Molim da je obrišite i kopirate ponovo :) ',1,'Reseno, iskopirana nova masina.\n','beba',1559642189,0),(12,'704',0,14,'Nedostaje racunar.',1,'Na servisu je, pod garancijom je.','beba',1559741253,0),(13,'jag1',0,1,'Nedostaje racunar.',1,NULL,'beba',1559741300,0),(14,'jag1',1,NULL,'Dodati Virtual Inteligence masinu',1,'Reseno.','beba',1559741345,0),(15,'jag2',1,NULL,'Dodati Virtual Inteligence masinu.',1,'Reseno.','beba',1559741368,0),(16,'704',0,11,'Slackware za ispit ne može da se pokrene.',1,'Na ovom racunaru je instaliran sistem kao u RLAB-u. Dakle, Slackware nije posebna particija, vec VM na nalogu ispit.','beba',1559827091,0),(17,'718',0,17,'Ne moze da pokrene VmWare, zbog nedovoljne memorije.\nNedostaje mrežni kabl.',1,'Mrezni kabl dodat.','jelena',1559830930,0),(18,'718',0,4,'Virtuelna mašina Baze podataka se zaledi, a osnovni sistem i dalje radi normalno.',1,'Prekopirala sam novu VM i izbrisala malo fajlova.\nVidecemo.....','jasmina',1559831015,0),(20,'jag2',0,1,'The volume \"vmasine\" has only 443,0 MB disk space remaining',1,NULL,'beba',1559885880,0),(21,'jag2',0,4,'The volume \"vmasine\" has only 443,0 MB disk space remaining',1,'Reseno.','beba',1559885896,0),(22,'jag2',0,6,'The volume \"vmasine\" has only 443,0 MB disk space remaining',1,'Reseno.','beba',1559885908,0),(23,'jag2',0,11,'The volume \"vmasine\" has only 443,0 MB disk space remaining',1,'Reseno.','beba',1559885918,0),(24,'jag2',0,15,'The volume \"vmasine\" has only 443,0 MB disk space remaining',1,'Reseno.','beba',1559885928,0),(29,'bim',0,11,'Fali lan kabl.\nMirko Spasic ',1,'Reseno.','beba',1559903275,0),(30,'jag2',0,2,'Ponovo prekopirati vm Verifikacija Softvera v2',1,'Reseno.','beba',1559907851,0),(31,'jag2',0,9,'Ponovo prekopirati VM VerifikacijaSoftvera_v2.',1,'Reseno.','beba',1559907906,0),(32,'704',0,10,'Ponovo prekopirati Vm BazePodataka2015, Baze2017 u internom obeležavanju.',1,NULL,'beba',1559907968,0),(34,'718',0,16,'Nedostaje vmasina matf-artificial-intelligence. ',1,'Dodata.','beba',1559909520,0),(35,'718',0,17,'VirtualBox ne može da pokrene vmasinu matf-articial-intelligence usled problema:\n\nAmd-v is disabled in the BIOS. ',1,'Reseno.\n\nU BIOS-u enable-ovati opciju za virtuelizaciju.','beba',1559909610,0),(36,'718',1,NULL,'Klime u 718 su jako lose i veoma slabo hlade. Uslovi za polaganje ispita su losi, zagusljivo je i veoma toplo. Pri tome nije nam dozvoljeno da vrata drzimo otvorena (vise puta smo opomenuti iz server sale). Klime da se poprave ili zamene.',1,'Prosledjeno upravi.','beba',1559913454,0),(37,'bim',0,16,'Mislim da ne radi internet na slotu 2.15 ali radi na 2.16 (to su spotovi kod označenog računara). ',1,NULL,'beba',1559922709,0),(39,'718',0,20,'Nedostaje fajl /vmasine/kde-debian.ova',1,NULL,'jelena',1560002731,0),(40,'jag1',1,NULL,'Ucionica nema pristup internetu, ni juce ni danas.',1,NULL,'beba',1560062934,0),(41,'bim',0,12,'Slackware nema Intellij. Ostavicemo podignut Slackware tokom današnjeg dana radi lakše popravke. ',1,'Iskopiran image particije sa susednog racunara.','beba',1560326807,0),(42,'704',0,11,'Virtuelna mašina Slackware (za ispit) se ne podiže. Svaki put se samo zamrzne kada se ulogujem na nalog ispit.',1,NULL,'jasmina',1560348205,0),(43,'jag1',0,5,'Nema Slackware',1,'Ovaj racunar je napravljen kao probni. Nema slekver particiju, vec nalog ispit (pasvord kao za slekver particiju, LKP); ovom nalogu su dostupne virtuelne masine koje nisu dostupne nalogu nastava. Pri svakom podizanju vrsi se kompletno ciscenje racunara. ','beba',1560354692,0),(44,'704',0,11,'Nema Slackware kao host, ima Ubuntu host i Slackware ispit VM.',1,'To je poznati issue. Ceo RLAB i taj jedan racunar u 704 su konfigurisani slicno kao All-in-one racunari u RLABu','beba',1560414382,0),(48,'jag1',1,NULL,'Iskopirati RazvojSoftvera2 masinu.',1,'Reseno.','beba',1560445580,0),(49,'jag2',1,NULL,'Iskopirati RazvojSoftvera2 masinu.',1,NULL,'beba',1560445604,0),(50,'718',0,4,'Virtuelna mašina iz baza se zaledi i ugasi na ispitu. Ne pokrece se ponovo bez restartovanja racunara. Isto je bilo 06.06 na Pbp ispitu. Zdenka je pomagla da minimalno pauziramo.',1,NULL,'beba',1560454868,0),(51,'bim',0,16,'Nedostaje mrezni kabl.',1,NULL,'beba',1560504213,0),(52,'718',0,3,'test izvestaj',1,NULL,NULL,1561027402,0),(53,'718',1,NULL,'Klime opet užasno rade (odnosno odlično greju) , pocrkali su mi studenti danas... ',1,'Prijavljeno upravi i majstoru.','beba',1562089784,0),(54,'jag1',0,2,'Nedostaje virtual box\n\nNemanja ',1,NULL,'beba',1562243749,0),(55,'704',0,11,'VMware prijavljuje poruku na ispitnom nalogu:\nBefore you can run VMware, several modules must be compiled and loaded into the running kernel. ',1,'Bice reseno do nedelje.','jasmina',1567323008,0),(56,'bim',0,8,'Miš je katastrofa, kao da ga je mačka pojela, ispljunula, onda ga pregazio auto i nekako je završio da se koristi na našoj instituciji. ',1,'Miš zamenjen drugim, mačka kažnjena.','beba',1567325937,0),(57,'704',0,14,'Fizički nema kućišta.',1,'Bice reseno do nedelje.','jasmina',1567440642,0),(58,'704',1,NULL,'Curi voda iz cevi za grejanje između poslednja dva racunara ispred klime.',1,'Prosledjeno upravi.','beba',1567440708,0),(59,'bim',0,8,'Monitor gubi struju zbog lošeg naponskog kabla.',1,NULL,'beba',1567441760,0),(66,'718',0,2,'Računar se upali, ali neće da prikaže Desktop (kao da negde \"zabode\" prilikom boot-ovanja)',1,'Stavljen image, prekopiran folder vmasine.','micko',1574443033,0),(67,'718',0,1,'Potrebno je ponovo prekopirati vm Baze podataka2015',1,'Vlasnik masine je bio user ispit. Promenjen na user nastava. Masina se sada normalno podize.','micko',1574521137,0),(68,'718',0,10,'Potrebno je ponovo prekopirati vm Baze podataka2015',1,'Pociscene nepotrebne virtualne masine. VM Baze podataka se normalono podize.','micko',1574536809,0),(69,'718',0,20,'Potrebno je ponovo prekopirati vm Baze podataka2015',1,'Pociscene nepotrebne virtualne masine. VM Baze podataka se normalono podize.','micko',1574536820,0),(70,'718',0,5,'Prepunjen hdd na ispit nalogu. Pa se ne podize Slack vm',1,'U medjuvremenu, ubuntu prestao da se dize. Bacen image i prekopiran folder /vmasine','jasmina',1574537030,0),(71,'bim',0,5,'24. novembra u vreme računarskih mreža tastatura nije radila dobro. Levi šift radi samo kad se stisne pod određenim uglom, inače je zablokiran. \nJoš jedna stvar koja nije bila ok je screen freeze na sekund na svakih 10ak sekundi (ili bolje reći delay, kao da računar odreaguje tek kasnije na ono što mu je zadato), ali to nisam sigurna da li je do VM-a ili do samog računara.',1,'Tastaura zamenjena.\n','beba',1575024455,0),(79,'718',0,12,'Problem sa utp kablom ili sa priključkom u podu, ali računar nema internet dok se ne preuzme kabl iz susednog računara. \n',0,NULL,NULL,1578674168,0),(80,'jag1',0,1,'Racunar ne postoji.',0,NULL,NULL,1578922124,0),(81,'jag2',0,0,'Prekopirati vm verifikacija_softvera_v3_oktobar_2019',1,NULL,'beba',1578922189,0),(82,'jag2',0,6,'Prekopirati vm verifikacija_softvera_v3_oktobar_2019',1,NULL,'beba',1578922219,0),(83,'bim',0,18,'Prekopirati ponovo Vm Bazepodataka2015\nTrenutna ne radi kako treba.',1,NULL,'jasmina',1578922276,0),(84,'bim',0,18,'Reseno',1,NULL,'jasmina',1579180697,0),(85,'bim',0,19,'Problem sa  prikljuckom u parapetu, resenje je da se DUZIM kablom racunar spoji\nna susedni port ',0,NULL,NULL,1579180845,0),(86,'704',0,13,'Sklonjen racunar',0,'Polomljen ekran, racunar je na servisu.','beba',1579623972,0),(87,'704',0,4,'Ispitni slackware ne funkcionise.',1,'Prekopiran ponovo.','jasmina',1579627704,0),(88,'jag1',0,5,'Slackware za ispit je na virtuelnoj masini. VMWare ne moze da se pokrene.',0,NULL,NULL,1580751698,0),(89,'jag1',0,20,'Problem sa saveExam. Internet radi, ali skript prijavljuje gresku pri skupljanju rada.',0,NULL,NULL,1580855802,0),(93,'jag1',0,11,'Prilikom podizanja sistema zahteva se sifra za korisnika \"nastava\". ',0,NULL,NULL,1582807335,0),(94,'jag1',0,4,'Prilikom podizanja sistema zahteva se sifra za korisnika \"nastava\".',0,NULL,NULL,1582807362,0),(95,'bim',0,4,'VMasina za Ubisoft kurs ne radi, molim da je iskopirate ponovo. Naziv je Windows 10 x64 ili tako nesto.',1,'Masina ponovo prekopirana.','jasmina',1583263329,0),(98,'704',0,13,'Ne radi internet na ovom racunaru. ',0,NULL,NULL,1592599958,0);
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-19 23:48:09
