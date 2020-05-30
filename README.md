# nodecluster

This is an Infrastructure management project for production. The goal behind this project is to provide a platform to 
manage your infrastructure. The initial commit creates a proposed working structure to also include CRUD operations 
with MySQL. 
### Version: 2.0.0

### Installation
Create your SQL Database. For this project, I used MySql running on my localhost.
Create 2 tables. 
First Table name is clusters
```sh
DROP TABLE IF EXISTS `clusters`;
CREATE TABLE IF NOT EXISTS `clusters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clustername` varchar(20) CHARACTER SET utf8 NOT NULL,
  `privlan` int(11) NOT NULL,
  `secvlan` int(11) NOT NULL,
  `tor1ip` varchar(15) CHARACTER SET utf8 NOT NULL,
  `tor2ip` varchar(15) CHARACTER SET utf8 NOT NULL,
  `interface` varchar(8) CHARACTER SET utf8 NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clustername` (`clustername`)
) ENGINE=MyISAM AUTO_INCREMENT=20200922 DEFAULT CHARSET=latin1;
```

Second table Users
```sh
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
```
```sh
$ git clone https://github.com/bosundare/nodecluster.git
```
```sh
$ cd nodecluster
```
```sh
$ npm install
```
```sh
$ mv config/database.js.ren config/database.js // Ensure you rename the file to a js file and edit your database connection parameters
```

```sh
# Or run with Nodemon
$ npm run dev
```

# Visit http://localhost:3000



