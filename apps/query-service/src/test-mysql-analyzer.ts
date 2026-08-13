import { MysqlAnalyzer } from "./query-analyzer/mysql/mysql-analyzer.js";

const analyzer = new MysqlAnalyzer();

const queries = [
  "SELECT * FROM users;",
  "SHOW TABLES;",
  "DESCRIBE users;",
  "INSERT INTO users(name) VALUES('Shaqib');",
  "UPDATE users SET name='Ali';",
  "DELETE FROM users;",
  "CREATE TABLE test(id INT);",
  "ALTER TABLE users ADD age INT;",
  "DROP TABLE users;",
  "START TRANSACTION;"
];
