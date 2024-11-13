-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Nov 13. 12:24
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `kolcsonbre`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `items`
--

CREATE TABLE `items` (
  `ID` int(11) NOT NULL,
  `title` varchar(40) NOT NULL,
  `type` enum('könyv','film') NOT NULL,
  `available` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `items`
--

INSERT INTO `items` (`ID`, `title`, `type`, `available`) VALUES
(1, 'Jani kalandjai ', 'könyv', 0),
(2, 'Balázs kalandjai', 'film', 1),
(3, 'Csoki kalandjai', 'könyv', 1),
(4, 'Áron kalandjai', 'film', 1),
(5, 'Kernel kalandjai', 'könyv', 0),
(6, 'Tari kalandjai', 'film', 1),
(7, 'Bezdan kalandjai', 'film', 0),
(13, 'Dominik kalandjai', 'könyv', 1),
(14, 'Máté kalandjai', 'film', 1),
(15, 'Zsolti kalandjai', 'könyv', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rentals`
--

CREATE TABLE `rentals` (
  `ID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  `rental_date` date NOT NULL,
  `return_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `rentals`
--

INSERT INTO `rentals` (`ID`, `userID`, `itemID`, `rental_date`, `return_date`) VALUES
(8, 1, 3, '2024-11-11', '2024-11-11'),
(9, 1, 6, '2024-11-11', '2024-11-11'),
(10, 1, 3, '2024-11-11', '2024-11-11'),
(11, 1, 5, '2024-11-11', '2024-11-11'),
(16, 1, 1, '2024-11-11', '2024-11-11'),
(17, 1, 4, '2024-11-11', '2024-11-11'),
(18, 1, 3, '2024-11-11', '2024-11-11'),
(19, 1, 4, '2024-11-11', '2024-11-11'),
(20, 1, 2, '2024-11-11', '2024-11-11'),
(21, 1, 1, '2024-11-11', '2024-11-11'),
(22, 1, 2, '2024-11-11', '2024-11-11'),
(23, 1, 4, '2024-11-11', '2024-11-11'),
(24, 1, 5, '2024-11-11', '2024-11-11'),
(25, 1, 3, '2024-11-11', '2024-11-11'),
(26, 1, 1, '2024-11-11', '2024-11-11'),
(27, 1, 1, '2024-11-11', '2024-11-11'),
(28, 1, 1, '2024-11-11', '2024-11-11'),
(29, 1, 1, '2024-11-11', '2024-11-11'),
(30, 1, 7, '2024-11-12', '2024-11-12'),
(31, 1, 6, '2024-11-12', '2024-11-12'),
(32, 1, 3, '2024-11-12', '2024-11-12'),
(33, 1, 6, '2024-11-12', '2024-11-12'),
(34, 5, 2, '2024-11-12', '2024-11-12'),
(36, 1, 1, '2024-11-12', '2024-11-12'),
(37, 1, 5, '2024-11-12', '2024-11-12'),
(38, 1, 5, '2024-11-12', '2024-11-12'),
(40, 1, 1, '2024-11-13', '2024-11-13'),
(41, 1, 1, '2024-11-13', '2024-11-13'),
(42, 1, 6, '2024-11-13', '2024-11-13'),
(43, 5, 1, '2024-11-13', '2024-11-13'),
(44, 5, 6, '2024-11-13', '2024-11-13'),
(45, 1, 5, '2024-11-13', NULL),
(46, 1, 7, '2024-11-13', NULL),
(47, 6, 1, '2024-11-13', NULL),
(48, 6, 13, '2024-11-13', '2024-11-13');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  `email` varchar(40) NOT NULL,
  `passwd` varchar(40) NOT NULL,
  `membership_date` date NOT NULL,
  `role` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `name`, `email`, `passwd`, `membership_date`, `role`) VALUES
(1, 'Ári', 'ari@turr.hu', '29b904ffa51141df00d6afedd88f2f18936511e2', '2024-11-05', 'admin'),
(5, 'jani', 'jani@turr.hu', '1798a15d09fd38eaaa10af3e06cd39c98c484501', '2024-11-11', 'user'),
(6, 'Bazsz', 'bazsi@turr.hu', 'a9fc680b7ea715d40d541f3327a5b983612f248a', '2024-11-13', 'user');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_2` (`ID`);

--
-- A tábla indexei `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `userID` (`userID`,`itemID`),
  ADD KEY `itemID` (`itemID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `items`
--
ALTER TABLE `items`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `rentals`
--
ALTER TABLE `rentals`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rentals_ibfk_2` FOREIGN KEY (`itemID`) REFERENCES `items` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
