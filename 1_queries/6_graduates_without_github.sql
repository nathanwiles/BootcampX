SELECT name, email, phone
FROM students
WHERE end_date < NOW()
AND github IS NULL;