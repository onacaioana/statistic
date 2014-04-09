-- phpMyAdmin SQL Dump
-- version 3.3.2deb1ubuntu1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 11, 2014 at 07:51 PM
-- Server version: 5.1.73
-- PHP Version: 5.3.2-1ubuntu4.22

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `Statistics`
--

-- --------------------------------------------------------

--
-- Table structure for table `Files`
--

CREATE TABLE IF NOT EXISTS `Files` (
  `InternID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ExternID` varchar(200) NOT NULL,
  `FileName` varchar(100) DEFAULT NULL,
  `IDProject` bigint(20) NOT NULL,
  PRIMARY KEY (`InternID`),
  KEY `IDProject` (`IDProject`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

--
-- Dumping data for table `Files`
--


-- --------------------------------------------------------

--
-- Table structure for table `Gadgets`
--

CREATE TABLE IF NOT EXISTS `Gadgets` (
  `ExternID` varchar(200) DEFAULT NULL,
  `InternID` bigint(20) NOT NULL AUTO_INCREMENT,
  `GadgetName` varchar(100) DEFAULT NULL,
  `UserID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`InternID`),
  KEY `UserID` (`UserID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=29 ;

--
-- Dumping data for table `Gadgets`
--

INSERT INTO `Gadgets` (`ExternID`, `InternID`, `GadgetName`, `UserID`) VALUES
('gaddetid_2', 28, 'galileoIntel', 19);

-- --------------------------------------------------------

--
-- Table structure for table `LogTable`
--

CREATE TABLE IF NOT EXISTS `LogTable` (
  `LogID` bigint(20) NOT NULL AUTO_INCREMENT,
  `In` tinyint(4) NOT NULL DEFAULT '0',
  `Out` tinyint(4) NOT NULL DEFAULT '0',
  `Data` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `UserID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`LogID`),
  KEY `UserID` (`UserID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=24 ;

--
-- Dumping data for table `LogTable`
--

INSERT INTO `LogTable` (`LogID`, `In`, `Out`, `Data`, `UserID`) VALUES
(23, 0, 1, '2001-02-02 02:02:02', 20),
(22, 0, 1, '2001-02-02 02:02:02', 19),
(21, 0, 1, '2001-02-02 02:02:02', 19),
(20, 0, 1, '2001-02-02 02:02:02', 20),
(19, 0, 1, '2001-02-02 02:02:02', 19),
(18, 1, 0, '2014-02-02 02:22:22', 19),
(17, 1, 0, '2014-02-02 02:22:22', 19),
(16, 1, 0, '2014-02-02 02:22:22', 20),
(15, 1, 0, '2014-02-02 02:22:22', 20);

-- --------------------------------------------------------

--
-- Table structure for table `Operations`
--

CREATE TABLE IF NOT EXISTS `Operations` (
  `IDOperation` bigint(20) NOT NULL AUTO_INCREMENT,
  `TypeOperation` varchar(1) DEFAULT NULL COMMENT 'A(add),M(modify),R(run),V(verify),D(delete),E(edit),C(configure),S(share),N(rename)',
  `Table` varchar(30) DEFAULT NULL COMMENT 'tebelul asupra caruia s-a efectuat operatia',
  `IDEntry` bigint(20) DEFAULT NULL COMMENT 'FIleID,ProjectID or GadgetID',
  `Data` timestamp NULL DEFAULT NULL,
  `UserID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`IDOperation`),
  KEY `UserID` (`UserID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=302 ;

--
-- Dumping data for table `Operations`
--

INSERT INTO `Operations` (`IDOperation`, `TypeOperation`, `Table`, `IDEntry`, `Data`, `UserID`) VALUES
(258, 'A', 'Projects', 167, '2012-02-02 02:02:02', 20),
(257, 'A', 'Projects', 166, '2012-02-02 02:02:02', 20),
(256, 'A', 'Projects', 165, '2012-02-02 02:02:02', 19),
(255, 'A', 'Projects', 164, '2012-02-02 02:02:02', 20),
(254, 'A', 'Projects', 163, '2012-02-02 02:02:02', 20),
(253, 'A', 'Projects', 162, '2012-02-02 02:02:02', 19),
(252, 'A', 'Projects', 161, '2012-02-02 02:02:02', 20),
(251, 'A', 'Projects', 160, '2012-02-02 02:02:02', 20),
(250, 'A', 'Projects', 159, '2012-02-02 02:02:02', 19),
(249, 'A', 'Projects', 158, '2012-02-02 02:02:02', 20),
(248, 'A', 'Projects', 157, '2012-02-02 02:02:02', 20),
(247, 'A', 'Projects', 156, '2012-02-02 02:02:02', 19),
(246, 'A', 'Projects', 155, '2012-02-02 02:02:02', 18),
(245, 'A', 'Projects', 154, '2012-02-02 02:02:02', 17),
(244, 'A', 'Projects', 153, '2012-02-02 02:02:02', 16),
(243, 'A', 'Projects', 152, '2012-02-02 02:02:02', 15),
(242, 'A', 'Projects', 151, '2012-02-02 02:02:02', 14),
(241, 'A', 'Projects', 150, '2012-02-02 02:02:02', 13),
(240, 'A', 'Projects', 149, '2012-02-02 02:02:02', 14),
(239, 'A', 'Projects', 148, '2012-02-02 02:02:02', 14),
(238, 'A', 'Projects', 147, '2012-02-02 02:02:02', 13),
(237, 'A', 'Projects', 146, '2012-02-02 02:02:02', 12),
(301, 'S', 'Projects', 175, '0000-00-00 00:00:00', 20),
(300, 'D', 'Gadgets', 27, '2014-02-02 14:22:22', 20),
(299, 'D', 'Gadgets', 27, '2014-02-02 14:22:22', 20),
(298, 'S', 'Projects', 174, '0000-00-00 00:00:00', 20),
(297, 'S', 'Projects', 173, '0000-00-00 00:00:00', 20),
(296, 'D', 'Projects', 170, '2012-02-02 02:56:42', 20),
(295, 'D', 'Projects', 172, '2012-02-02 02:56:42', 20),
(294, 'V', 'Projects', 172, '0000-00-00 00:00:00', 20),
(293, 'V', 'Projects', 172, '0000-00-00 00:00:00', 20),
(292, 'V', 'Projects', 172, '0000-00-00 00:00:00', 20),
(291, 'R', 'Projects', 172, '0000-00-00 00:00:00', 20),
(290, 'R', 'Projects', 172, '0000-00-00 00:00:00', 20),
(289, 'R', 'Projects', 172, '0000-00-00 00:00:00', 20),
(288, 'R', 'Projects', 172, '0000-00-00 00:00:00', 20),
(287, 'R', 'Projects', 0, '0000-00-00 00:00:00', 20),
(286, 'R', 'Projects', 0, '0000-00-00 00:00:00', 20),
(285, 'R', 'Projects', 0, '0000-00-00 00:00:00', 20),
(284, 'R', 'Projects', 0, '0000-00-00 00:00:00', 20),
(283, 'C', 'Gadgets', 27, '2012-02-02 02:56:42', 20),
(282, 'C', 'Gadgets', 27, '2012-02-02 02:56:42', 20),
(281, 'C', 'Gadgets', 28, '2012-02-02 02:56:42', 19),
(280, 'D', 'Files', 18, '2014-02-02 16:02:02', 20),
(279, 'D', 'Files', 17, '2014-02-02 16:02:02', 20),
(278, 'G', 'Gadgets', 28, '2021-02-02 02:56:42', 19),
(277, 'G', 'Gadgets', 27, '2014-02-02 16:02:02', 20),
(276, 'N', 'Files', 17, '2012-02-02 02:26:42', 20),
(275, 'A', 'Files', 18, '2015-02-02 02:56:42', 20),
(274, 'A', 'Files', 17, '2015-02-02 02:56:42', 20),
(273, 'A', 'Files', 16, '2015-02-02 02:56:42', 20),
(272, 'A', 'Files', 15, '2015-02-02 02:56:42', 20),
(271, 'M', 'Projects', 172, '2014-02-02 16:02:02', 20),
(270, 'M', 'Projects', 172, '2014-02-02 16:02:02', 20),
(269, 'M', 'Projects', 171, '2014-02-02 16:02:02', 19),
(268, 'M', 'Projects', 172, '2014-02-02 16:02:02', 20),
(267, 'M', 'Projects', 172, '2014-02-02 16:02:02', 20),
(266, 'M', 'Projects', 172, '2014-02-02 16:02:02', 20),
(265, 'M', 'Projects', 171, '2014-02-02 16:02:02', 19),
(264, 'M', 'Projects', 172, '2014-02-02 16:02:02', 20),
(263, 'A', 'Projects', 172, '2012-02-02 02:02:02', 20),
(262, 'A', 'Projects', 171, '2012-02-02 02:02:02', 19),
(261, 'A', 'Projects', 170, '2012-02-02 02:02:02', 20),
(260, 'A', 'Projects', 169, '2012-02-02 02:02:02', 20),
(259, 'A', 'Projects', 168, '2012-02-02 02:02:02', 19);

-- --------------------------------------------------------

--
-- Table structure for table `Projects`
--

CREATE TABLE IF NOT EXISTS `Projects` (
  `ExternID` varchar(200) DEFAULT NULL,
  `InternID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Language` varchar(50) DEFAULT NULL,
  `UserID` bigint(20) DEFAULT NULL,
  `ProjectName` varchar(100) NOT NULL,
  PRIMARY KEY (`InternID`),
  KEY `UserID` (`UserID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=176 ;

--
-- Dumping data for table `Projects`
--

INSERT INTO `Projects` (`ExternID`, `InternID`, `Language`, `UserID`, `ProjectName`) VALUES
('projectid_2', 175, 'Pascal', 20, 'project2_modif'),
('projectid_2', 174, 'Pascal', 20, 'project2_modif'),
('projectid_2', 171, 'Pascal', 19, 'project2_modif'),
('projectid_2', 173, 'Pascal', 20, 'project2_modif');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE IF NOT EXISTS `Users` (
  `ExternID` varchar(200) DEFAULT NULL,
  `InternID` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`InternID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`ExternID`, `InternID`) VALUES
('userid_1', 20),
('userid_2', 19);
