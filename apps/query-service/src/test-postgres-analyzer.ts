import { PostgresAnalyzer } from "./query-analyzer/postgres/postgres-analyzer.js";

const analyzer = new PostgresAnalyzer();

const queries = [
  `SELECT * FROM "User";`,
  `WITH users AS (SELECT * FROM "User") SELECT * FROM users;`,
  `INSERT INTO "User"(id) VALUES ('1');`,
  `UPDATE "User" SET email='a@test.com';`,
  `DELETE FROM "User";`,
  `CREATE TABLE test(id INT);`,
  `ALTER TABLE "User" ADD COLUMN age INT;`,
  `DROP TABLE "User";`,
  `BEGIN;`
];

for (const query of queries) {
  console.log(query);
  console.log(analyzer.analyze(query));
  console.log("--------------------------------");
}
