# Backend for Empanada Review

This project is developed on Node.js

### `npm install`

Install all dependencies used

### `node index.js`

This starts the server on the port 4000, you can change this on the config.js file

[Front End](https://github.com/Gabrielmong/main-project-front)

## Database

Using Oracle Databse, you need to install the [Oracle Intant Client](https://www.oracle.com/database/technologies/instant-client/downloads.html) and locate in C:\\oracle\\instantclient_21_6

Run these commands on SQL Plus:
###
    ALTER SESSION SET "_ORACLE_SCRIPT"=TRUE;
    
    SELECT PDB_NAME FROM DBA_PDBS; 
    
    ALTER SESSION SET CONTAINER=[PDB Name]
    
    CREATE USER VSCODE IDENTIFIED BY ORACLE;
    
    GRANT DBA TO VSCODE;

    SHOW PARAMETER SERVICE_NAME; 

And finally open the plugabble database:

###
    ALTER PLUGGABLE DATABASE [PBD Name] OPEN; 

Run the sql file on the project 

 Get you pluggable database name and type it on dbconfig.js
 
  @TODO
 
Adding Support to MAC's oracle process (??)

~~Connecting the [front end](https://github.com/Gabrielmong/main-project-front) with the API~~

~~Refactor the CRUD so it can be used for user transactions and enventually posts (reviews)~~

~~Make a new api that can actually handle image upload, probably with express.js, making the backend natively has given some issues~~
