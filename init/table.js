const sql = require("mssql");

const config = {
  user: "sa", // SQL Server username
  password: "123456", // SQL Server password
  server: "localhost", // SQL Server instance IP address or hostname
  database: "dbproject", // Database name
  options: {
    encrypt: false, // Disable encryption
    enableArithAbort: true, // Enable arithabort
  },
};

async function executeQuery() {
  try {
    await sql.connect(config);
    console.log("connected");
    // Create Department table
    await sql.query(`
      CREATE TABLE Department(
        Dep_ID int IDENTITY(1,1) PRIMARY KEY,
        Name varchar(30),
        Block char(1)
      )
    `);

    // Create Patient table
    await sql.query(`
      CREATE TABLE Patient(
        P_ID int IDENTITY(1,1) PRIMARY KEY,
        Name varchar(30),
        CNIC varchar(17),
        Age int,
        Disease varchar(20),
        Dep_ID int,
        Check_In date,
        Check_Out date,
        FOREIGN KEY(Dep_ID) REFERENCES Department(Dep_ID) on update cascade on delete set null
      )
    `);

    // Create Staff table
    await sql.query(`
      CREATE TABLE Staff(
        ID int IDENTITY(1,1) PRIMARY KEY,
        Name varchar(30),
        CNIC varchar(17),
        Age int,
        Dep_ID int,
        FOREIGN KEY(Dep_ID) REFERENCES Department(Dep_ID) on update cascade on delete set null
      )
    `);

    await sql.query(`
      CREATE TABLE Doctor(
        Doc_ID int IDENTITY(1,1) PRIMARY KEY,
        Name varchar(30),
        Specification varchar(30) NOT NULL,
        Qualification varchar(20),
        Dep_ID int,
        FOREIGN KEY(Dep_ID) REFERENCES Department(Dep_ID) on update cascade on delete set null
      )
    `);

    // Create Nurses table
    await sql.query(`
      CREATE TABLE Nurses(
        ID int IDENTITY(1,1) PRIMARY KEY,
        Name varchar(30),
        Qualification varchar(20),
        Dep_ID int,
        FOREIGN KEY(Dep_ID) REFERENCES Department(Dep_ID) on update cascade on delete set null
      )
    `);

    // Create TechnicalStaff table
    await sql.query(`
      CREATE TABLE TechnicalStaff(
        ID int IDENTITY(1,1) PRIMARY KEY,
        Name varchar(30),
        Dep_ID int,
        FOREIGN KEY(Dep_ID) REFERENCES Department(Dep_ID) on update cascade on delete set null
      )
    `);

    // Create Equipment table
    await sql.query(`
      CREATE TABLE Equipment(
        Equip_ID int IDENTITY(1,1) PRIMARY KEY,
        Name varchar(30),
        ImportedFrom varchar(30),
        Price int,
        Status varchar(30),
        InDate date,
        
      )
    `);

    // Create Pharmacy table
    await sql.query(`
     CREATE TABLE Pharmacy(
       Med_ID int IDENTITY(1,1) PRIMARY KEY,
       Name varchar(30),
       Quantity int,
       ExpireDate date,
       Price int
     )
   `);

    // Create Prescription table
    await sql.query(`
    CREATE TABLE Prescription(
      Pre_ID int IDENTITY(1,1) PRIMARY KEY,
      Patient_ID int,
      Detail varchar(50),
      Date date,
      FOREIGN KEY(Patient_ID) REFERENCES Patient(P_ID) on update cascade on delete set null
    )
   `);

    // Create Billing table
    await sql.query(`
     CREATE TABLE Billing(
       Bill_ID int IDENTITY(1,1) PRIMARY KEY,
       Patient_ID int,
       Date date,
       Time time,
       Total int,
       FOREIGN KEY(Patient_ID) REFERENCES Patient(P_ID) on update cascade on delete set null
     )
   `);

    // Create Report table
    await sql.query(`
     CREATE TABLE Report(
       Rep_ID int IDENTITY(1,1) PRIMARY KEY,
       Patient_ID int,
       Name varchar(30),
       Result varchar(50),
      
       FOREIGN KEY(Patient_ID) REFERENCES Patient(P_ID) on update cascade on delete set null
     )
   `);

    // Create AdmittedAt table
    await sql.query(`
     CREATE TABLE AdmittedAt(
       RoomName varchar(30),
       Patient_ID int,
       Status varchar(20),
       CheckIn date,
       CheckOut date,
       FOREIGN KEY(Patient_ID) REFERENCES Patient(P_ID) on update cascade on delete set null
     )
   `);

    console.log("Tables created successfully");
  } catch (err) {
    console.error("SQL Error:", err.message);
  } finally {
    sql.close();
  }
}

executeQuery();
