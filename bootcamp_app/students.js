const { Pool } = require("pg");
require("dotenv").config();
// create pool object with connection info for bootcampx database
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME
});

const parameters = process.argv.slice(2);
const inputCohort = parameters[0];
const inputLimit = parameters[1];


/**
 * 
 * @param {string} cohortName 
 * @param {integer} limit 
 * 
 * Query structured for 'bootcampx' database:
 * This function takes in a cohort name and 
 * the desired number of results and 
 * returns a promise that logs the results of the query to the terminal
 * in the following format:
 * `${student_name} has a student id of ${student_id} and was in the ${cohort_name} cohort`
 * 
 */

const logStudentSummary = (cohortName, limit) => {
  return pool
    .query(
      `SELECT students.id as student_id, students.name as name, cohorts.name as cohort
      FROM students
      JOIN cohorts ON cohorts.id = cohort_id
      WHERE cohorts.name LIKE $1
      LIMIT $2;
      `, [`%${cohortName}%`, limit || 5]
    )
    .then((res) => {
      res.rows.forEach((user) => {
        console.log(
          `${user.name} has an id of ${user.student_id} and was in the ${user.cohort} cohort`
        );
      });
    })
    .catch((err) => console.error("query error", err.stack));
};

logStudentSummary(inputCohort, inputLimit);
pool.end();