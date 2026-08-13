import { DatabaseType } from "@queryflow/database";

import { AnalyzerFactory } from "./query-analyzer/analyzer.factory.js";

const postgres = AnalyzerFactory.create(DatabaseType.POSTGRESQL);

const mysql = AnalyzerFactory.create(DatabaseType.MYSQL);

const mongo = AnalyzerFactory.create(DatabaseType.MONGODB);
