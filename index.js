const sql = require("mssql");
const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

//Admin info

const adminname = ["xraffay", "Mamoon", "Chand", "Zohaib"];
const adminpassword = "admin123";

//Some variables
let dep_id = 0;
let islogged = false;
let pat_id = 0;
let staff_id = 0;
let docter_id = 0;
//creating SQL connection
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
  } catch (err) {
    console.error("SQL Error:", err.message);
  }
}
executeQuery();

app.listen(8080, () => console.log("Server is listening on port 8080"));

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("views/login.ejs");
});

app.post("/login", (req, res) => {
  let { username, password } = req.body;
  for (let i = 0; i < 4; i++) {
    console.log(adminname[i]);
    if (username === adminname[i] && password === adminpassword) {
      console.log("HELLO");
      islogged = true;
      res.redirect("/home");
    }
  }
  res.status(401).send("Incorrect username or password.");
});

app.get("/home", (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  res.redirect("/department");
});

app.get("/department", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select * from department`);
  const departments = result.recordset;
  res.render("views/department.ejs", { departments });
});

app.get("/department/add", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  res.render("views/addDepartment.ejs");
});

app.post("/department", async (req, res) => {
  let { name, block } = req.body;
  try {
    const request = new sql.Request();
    // dep_id += 1;
    // SQL query to insert data into the Department table
    const query =
      "INSERT INTO Department ( Name, Block) VALUES (@name, @block)";

    // Parameters for the SQL query
    //request.input("depID", sql.Int, dep_id); // Example Dep_ID value
    request.input("name", sql.VarChar, name); // Example Name value
    request.input("block", sql.Char, block); // Example Block value

    // Execute the query
    const result = await request.query(query);
    console.log("Data inserted successfully:", result);
    res.redirect("/department");
  } catch (err) {
    console.error("Error inserting data:", err);
  }
});

app.delete("/department/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    const request = new sql.Request();
    const query = `DELETE FROM Department WHERE dep_id = @depID`;
    request.input("depID", sql.Int, id);
    const result = await request.query(query);
    console.log("Department deleted successfully:", result);
    res.redirect("/department");
  } catch (err) {
    console.error("Error deleting department:", err);
  }
});

//Patients
app.get("/patient", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select * from patient`);
  const patients = result.recordset;
  res.render("views/patient.ejs", { patients });
});

app.get("/patient/add", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select dep_id from department`);
  const dep_ids = result.recordset;
  console.log(dep_ids);
  res.render("views/addPatient.ejs", { dep_ids });
});

app.post("/patient", async (req, res) => {
  let { name, cnic, age, disease, dep_id, check_in, check_out } = req.body;

  try {
    pat_id += 1;
    const request = new sql.Request();

    // SQL query to insert data into the table
    const query = `
        INSERT INTO patient ( Name, CNIC, Age, Disease, Dep_ID, Check_In, Check_Out)
        VALUES ( @name, @cnic, @age, @disease, @depID, @checkIn, @checkOut)
      `;

    // Parameters for the SQL query

    request.input("name", sql.VarChar(30), name);
    request.input("cnic", sql.VarChar(17), cnic);
    request.input("age", sql.Int, age);
    request.input("disease", sql.VarChar(20), disease);
    request.input("depID", sql.Int, dep_id);
    request.input("checkIn", sql.Date, check_in);
    request.input("checkOut", sql.Date, check_out);

    // Execute the query
    const result = await request.query(query);
    console.log("Data inserted successfully:", result);
    res.redirect("/patient");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.send("Error isnerting data");
  }
});

app.delete("/patient/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    const request = new sql.Request();
    const query = `DELETE FROM patient WHERE p_id = @patID`;
    request.input("patID", sql.Int, id);
    const result = await request.query(query);
    console.log("Patient deleted successfully:", result);
    res.redirect("/patient");
  } catch (err) {
    console.error("Error deleting department:", err);
    res.redirect("Error Deleting");
  }
});

// Staff//////////////////////
////////
///////
////////////
app.get("/staff", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select * from staff`);
  const staff = result.recordset;
  res.render("views/staff.ejs", { staff });
});

app.get("/staff/add", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select dep_id from department`);
  const dep_ids = result.recordset;
  console.log(dep_ids);
  res.render("views/addStaff.ejs", { dep_ids });
});

app.post("/staff", async (req, res) => {
  let { name, cnic, age, dep_id } = req.body;

  try {
    staff_id += 1;
    const request = new sql.Request();

    // SQL query to insert data into the table
    const query = `
        INSERT INTO staff ( Name, CNIC, Age,  Dep_ID)
        VALUES ( @name, @cnic, @age,@depID)
      `;

    // Parameters for the SQL query
    //request.input("ID", sql.Int, staff_id);
    request.input("name", sql.VarChar(30), name);
    request.input("cnic", sql.VarChar(17), cnic);
    request.input("age", sql.Int, age);
    request.input("depID", sql.Int, dep_id);

    // Execute the query
    const result = await request.query(query);
    console.log("Data inserted successfully:", result.recordset);
    res.redirect("/staff");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.send("Error isnerting data");
  }
});

app.delete("/staff/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    const request = new sql.Request();
    const query = `DELETE FROM staff WHERE id = @patID`;
    request.input("patID", sql.Int, id);
    const result = await request.query(query);
    console.log("Staff member deleted successfully:", result);
    res.redirect("/staff");
  } catch (err) {
    console.error("Error deleting department:", err);
    res.send("Error Deleting");
  }
});

//Docter//////////////////////
////////
///////
////////////
app.get("/doctor", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select * from doctor`);
  const doctors = result.recordset;
  res.render("views/doctor.ejs", { doctors });
});

app.get("/doctor/add", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select dep_id from department`);
  const dep_ids = result.recordset;
  console.log(dep_ids);
  res.render("views/addDoctor.ejs", { dep_ids });
});

app.post("/doctor", async (req, res) => {
  let { name, specification, qualification, dep_id } = req.body;

  try {
    docter_id += 1;
    const request = new sql.Request();

    // SQL query to insert data into the table
    const query = `
        INSERT INTO doctor ( Name, specification, qualification,  Dep_ID)
        VALUES ( @name, @cnic, @age,@depID)
      `;

    // Parameters for the SQL query
    request.input("name", sql.VarChar(30), name);
    request.input("cnic", sql.VarChar(30), specification);
    request.input("age", sql.VarChar(20), qualification);
    request.input("depID", sql.Int, dep_id);

    // Execute the query
    const result = await request.query(query);
    console.log("Data inserted successfully:", result.recordset);
    res.redirect("/doctor");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.send("Error isnerting data");
  }
});

app.delete("/doctor/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    const request = new sql.Request();
    const query = `DELETE FROM doctor WHERE doc_id = @patID`;
    request.input("patID", sql.Int, id);
    const result = await request.query(query);
    console.log("Doctor deleted successfully:", result);
    res.redirect("/doctor");
  } catch (err) {
    console.error("Error deleting department:", err);
    res.send("Error Deleting");
  }
});
//Docter//////////////////////
////////
///////
////////////
app.get("/nurse", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select * from nurses`);
  const nurses = result.recordset;
  res.render("views/nurse.ejs", { nurses });
});

app.get("/nurse/add", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select dep_id from department`);
  const dep_ids = result.recordset;
  console.log(dep_ids);
  res.render("views/addNurse.ejs", { dep_ids });
});

app.post("/nurse", async (req, res) => {
  let { name, specification, qualification, dep_id } = req.body;

  try {
    const request = new sql.Request();

    // SQL query to insert data into the table
    const query = `
        INSERT INTO nurses ( Name,  qualification,  Dep_ID)
        VALUES ( @name,  @age,@depID)
      `;

    // Parameters for the SQL query
    //request.input("ID", sql.Int, Math.floor(Math.random() * 1000));
    request.input("name", sql.VarChar(30), name);
    request.input("age", sql.VarChar(20), qualification);
    request.input("depID", sql.Int, dep_id);

    // Execute the query
    const result = await request.query(query);
    console.log("Data inserted successfully:", result.recordset);
    res.redirect("/nurse");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.send("Error isnerting data");
  }
});

app.delete("/nurse/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    const request = new sql.Request();
    const query = `DELETE FROM nurses WHERE id = @patID`;
    request.input("patID", sql.Int, id);
    const result = await request.query(query);
    console.log("Doctor deleted successfully:", result);
    res.redirect("/nurse");
  } catch (err) {
    console.error("Error deleting department:", err);
    res.send("Error Deleting");
  }
});

//Prescription//////////////////////
////////
///////
////////////
app.get("/prescription", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select * from prescription`);
  const prescriptions = result.recordset;
  res.render("views/prescription.ejs", { prescriptions });
});

app.get("/prescription/add", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select p_id from patient `);
  const p_ids = result.recordset;
  console.log(p_ids);

  res.render("views/addPrescription.ejs", { p_ids });
});

app.post("/prescription", async (req, res) => {
  let { p_id, detail, date } = req.body;
  console.log(p_id, detail, date);
  try {
    const request = new sql.Request();

    // SQL query to insert data into the table
    const query = `
        INSERT INTO prescription ( patient_id,  detail,  date)
        VALUES ( @name,  @age,@depID)
      `;

    // Parameters for the SQL query
    //request.input("ID", sql.Int, Math.floor(Math.random() * 1000));
    request.input("name", sql.Int, p_id);
    request.input("age", sql.VarChar(50), detail);
    request.input("depID", sql.Date, date);

    // Execute the query
    const result = await request.query(query);
    console.log("Data inserted successfully:", result.recordset);
    res.redirect("/prescription");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.send("Error isnerting data");
  }
});

app.delete("/prescription/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    const request = new sql.Request();
    const query = `DELETE FROM prescription WHERE pre_id = @patID`;
    request.input("patID", sql.Int, id);
    const result = await request.query(query);
    console.log("Doctor deleted successfully:", result);
    res.redirect("/prescription");
  } catch (err) {
    console.error("Error deleting department:", err);
    res.send("Error Deleting");
  }
});

//Billing//////////////////////
////////
///////
////////////
app.get("/billing", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select * from billing`);
  const billings = result.recordset;
  res.render("views/billing.ejs", { billings });
});

app.get("/billing/add", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select p_id from patient `);
  const p_ids = result.recordset;
  console.log(p_ids);

  res.render("views/addBilling.ejs", { p_ids });
});

app.post("/billing", async (req, res) => {
  let { p_id, date, total } = req.body;
  console.log(p_id, date, total);
  try {
    const request = new sql.Request();

    // SQL query to insert data into the table
    const query = `
        INSERT INTO billing ( patient_id,  date,  total)
        VALUES ( @name,  @age,@depID)
      `;

    // Parameters for the SQL query
    // request.input("ID", sql.Int, Math.floor(Math.random() * 1000));
    request.input("name", sql.Int, p_id);
    request.input("age", sql.Date, date);
    request.input("depID", sql.Int, total);

    // Execute the query
    const result = await request.query(query);
    console.log("Data inserted successfully:", result.recordset);
    res.redirect("/billing");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.send("Error isnerting data");
  }
});

app.delete("/billing/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    const request = new sql.Request();
    const query = `DELETE FROM billing WHERE bill_id = @patID`;
    request.input("patID", sql.Int, id);
    const result = await request.query(query);
    console.log("Bill deleted successfully:", result);
    res.redirect("/billing");
  } catch (err) {
    console.error("Error deleting department:", err);
    res.send("Error Deleting");
  }
});

//Admitted//////////////////////
////////
///////
////////////
app.get("/admitted", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select * from admittedat`);
  const admitted = result.recordset;
  res.render("views/admitted.ejs", { admitted });
});

app.get("/admitted/add", async (req, res) => {
  if (islogged === false) {
    res.redirect("/login");
  }
  const result = await sql.query(`select p_id from patient `);
  const p_ids = result.recordset;
  console.log(p_ids);

  res.render("views/addAdmitted.ejs", { p_ids });
});

app.post("/admitted", async (req, res) => {
  let { roomname, p_id, status, checkin, checkout } = req.body;
  console.log(roomname, p_id, status, checkin, checkout);
  try {
    const request = new sql.Request();

    // SQL query to insert data into the table
    const query = `
        INSERT INTO admittedat (roomname, patient_id,status,checkin,checkout)
        VALUES (@room, @pid,  @status,@checkin,@checkout)
      `;

    // Parameters for the SQL query
    request.input("room", sql.VarChar(30), roomname);
    request.input("pid", sql.Int, p_id);
    request.input("status", sql.VarChar(20), status);
    request.input("checkin", sql.Date, checkin);
    request.input("checkout", sql.Date, checkout);

    // Execute the query
    const result = await request.query(query);
    console.log("Data inserted successfully:", result.recordset);
    res.redirect("/admitted");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.send("Error isnerting data");
  }
});

app.delete("/admitted/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    const request = new sql.Request();
    const query = `DELETE FROM admittedat WHERE roomname = @patID`;
    request.input("patID", sql.VarChar, id);
    const result = await request.query(query);
    console.log("Record deleted successfully:", result);
    res.redirect("/admitted");
  } catch (err) {
    console.error("Error deleting department:", err);
    res.send("Error Deleting");
  }
});

app.get("/logout", (req, res) => {
  islogged = false;
  res.redirect("/login");
});
