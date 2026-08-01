import { DatabaseType } from "@queryflow/database";

import { AnalyzerFactory } from "./query-analyzer/analyzer.factory.js";

const postgres = AnalyzerFactory.create(DatabaseType.POSTGRESQL);

console.log(postgres.analyze(`SELECT * FROM "User";`));

const mysql = AnalyzerFactory.create(DatabaseType.MYSQL);

console.log(mysql.analyze(`UPDATE users SET name='Shaqib';`));

const mongo = AnalyzerFactory.create(DatabaseType.MONGODB);

console.log(mongo.analyze(`db.users.find({})`));
