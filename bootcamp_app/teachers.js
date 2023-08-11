const { Pool } = require("pg");

// import env variables
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
});

pool.connect()
.then(() => console.log("connected"));

pool
  .query(
    `
    SELECT DISTINCT teachers.name AS teacher, cohorts.name AS cohort
    FROM teachers
    JOIN assistance_requests ON teachers.id = teacher_id
    JOIN students ON students.id = student_id
    JOIN cohorts ON cohorts.id = cohort_id
    WHERE cohorts.name LIKE $1
    ORDER BY teacher
    ; 
    `,
    [`%${process.argv[2]}%`]
  ) //user input for cohort name
  .then((res) => {
    res.rows.forEach((row) => {
      console.log(`${row.cohort}: ${row.teacher}`);
    });
  })
  .catch((err) => console.error("query error", err.stack));

  pool.end();