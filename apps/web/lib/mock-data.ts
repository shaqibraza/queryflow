export interface Conversation {
  id: string;
  title: string;
  timestamp: string;
}

export const recentConversations: Conversation[] = [
  { id: "c1", title: "Show all users", timestamp: "2h ago" },
  { id: "c2", title: "Monthly revenue", timestamp: "5h ago" },
  { id: "c3", title: "Inactive customers", timestamp: "Yesterday" },
  { id: "c4", title: "Orders report", timestamp: "Yesterday" },
  { id: "c5", title: "Top products", timestamp: "2 days ago" }
];

export interface Connection {
  id: string;
  name: string;
  environment: "production" | "staging" | "local";
  engine: "PostgreSQL" | "MySQL" | "MongoDB";
  status: "online" | "offline";
}

export const connections: Connection[] = [
  {
    id: "conn-prod",
    name: "Production",
    environment: "production",
    engine: "PostgreSQL",
    status: "online"
  },
  {
    id: "conn-staging",
    name: "Staging",
    environment: "staging",
    engine: "PostgreSQL",
    status: "online"
  },
  { id: "conn-local", name: "Local", environment: "local", engine: "MongoDB", status: "offline" }
];

export interface Suggestion {
  id: string;
  label: string;
  description: string;
  icon: "users" | "trending-up" | "copy-x" | "package-x";
}

export const suggestions: Suggestion[] = [
  {
    id: "s1",
    label: "Show all active users",
    description: "List users active in the last 30 days",
    icon: "users"
  },
  {
    id: "s2",
    label: "Monthly revenue",
    description: "Break revenue down by month, this year",
    icon: "trending-up"
  },
  {
    id: "s3",
    label: "Find duplicate emails",
    description: "Surface records with matching email addresses",
    icon: "copy-x"
  },
  {
    id: "s4",
    label: "Products out of stock",
    description: "Inventory items at zero quantity",
    icon: "package-x"
  }
];

export interface QueryResultColumn {
  key: string;
  label: string;
}

export interface QueryResult {
  columns: QueryResultColumn[];
  rows: Record<string, string | number>[];
  totalRows: number;
}

export const mockSql = `SELECT
    u.id,
    u.full_name,
    u.email,
    u.plan,
    u.last_active_at
FROM users u
WHERE u.last_active_at >= NOW() - INTERVAL '30 days'
ORDER BY u.last_active_at DESC
LIMIT 50;`;

export const mockExplanation =
  "This query selects users whose last_active_at falls within the past 30 days, ordered by most recently active first. It's scoped to the users table and limited to 50 rows for a quick preview.";

export const mockResult: QueryResult = {
  columns: [
    { key: "id", label: "ID" },
    { key: "full_name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "plan", label: "Plan" },
    { key: "last_active_at", label: "Last Active" }
  ],
  rows: [
    {
      id: 1024,
      full_name: "Ada Lovelace",
      email: "ada@queryflow.io",
      plan: "Pro",
      last_active_at: "2026-08-03 14:22"
    },
    {
      id: 1023,
      full_name: "Grace Hopper",
      email: "grace@queryflow.io",
      plan: "Team",
      last_active_at: "2026-08-03 11:05"
    },
    {
      id: 1019,
      full_name: "Alan Turing",
      email: "alan@queryflow.io",
      plan: "Pro",
      last_active_at: "2026-08-02 19:41"
    },
    {
      id: 1017,
      full_name: "Margaret Hamilton",
      email: "margaret@queryflow.io",
      plan: "Enterprise",
      last_active_at: "2026-08-02 09:12"
    },
    {
      id: 1012,
      full_name: "Katherine Johnson",
      email: "katherine@queryflow.io",
      plan: "Pro",
      last_active_at: "2026-08-01 16:53"
    },
    {
      id: 1008,
      full_name: "Radia Perlman",
      email: "radia@queryflow.io",
      plan: "Team",
      last_active_at: "2026-08-01 08:30"
    }
  ],
  totalRows: 214
};
