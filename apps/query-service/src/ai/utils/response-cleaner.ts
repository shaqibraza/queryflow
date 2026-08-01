export class ResponseCleaner {
  static clean(response: string): string {
    let sql = response.trim();

    // Remove markdown code fences
    sql = sql.replace(/^```sql\s*/i, "");
    sql = sql.replace(/^```\s*/i, "");
    sql = sql.replace(/```$/i, "");

    // Remove common AI prefixes
    sql = sql.replace(/^Here is the SQL query:\s*/i, "");
    sql = sql.replace(/^Here is your SQL query:\s*/i, "");
    sql = sql.replace(/^SQL:\s*/i, "");

    return sql.trim();
  }
}
