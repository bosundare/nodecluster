# nodecluster

This is an Infrastructure management project for production. The goal behind this project is to provide a platform to 
manage your infrastructure. The initial commit creates a proposed working structure to also include CRUD operations 
with MySQL. This app works best within your Corp Network as it needs to have access to internal resources such as 
switches connected to your cluster. Also ensure your database is up to date, as this app has the capability 
to run administrative commands against your switches to make configuration changes. The app is customizable to your 
infrastructure needs. You can add more columns as desired, more automations, and more added features based on 
your demands. 
### Version: 2.0.0

### Installation
Create your SQL Database. For this project, I used MySql running on my localhost. The model would create the tables for you.

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
$ touch config/secret.js //Create a secret.js file under config folder and export your variables for switchadmin and switchpass
```
```sh
# Or run with Nodemon
$ npm run dev
```
```sh
$ Visit http://localhost:3000
```
```
At first run, an admin user with default password of "password" is created for admin tasks. Ensure you change this password within the app.
```
## Technologies
* Node.js
* Express
* Express Messages, Session, Connect Flash & Validation
* Mysql and Sequelize ORM
* EJS Templating
* Passport.js Authentication
* BCrypt Hashing
* Express Validator
* Logger
* SSH2




