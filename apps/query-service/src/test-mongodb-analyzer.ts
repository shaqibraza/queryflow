import { MongoDbAnalyzer } from "./query-analyzer/mongodb/mongodb-analyzer.js";

const analyzer = new MongoDbAnalyzer();

const queries = [
  `db.users.find({})`,
  `db.users.findOne({ _id: 1 })`,
  `db.users.aggregate([])`,
  `db.users.insertOne({ name: "Shaqib" })`,
  `db.users.updateOne({}, { $set: { name: "Ali" } })`,
  `db.users.deleteMany({})`,
  `db.users.createIndex({ email: 1 })`,
  `db.users.drop()`,
  `db.createCollection("users")`,
  `session.startTransaction()`,
  `session.commitTransaction()`
];

for (const query of queries) {
  console.log(query);
  console.log(analyzer.analyze(query));
  console.log("--------------------------------");
}
