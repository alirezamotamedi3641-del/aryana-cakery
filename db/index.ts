import * as schema from "./schema";

const noOp = {
  findMany: async () => [],
  findFirst: async () => null,
  findUnique: async () => null,
  create: async (d: Record<string, unknown>) => d?.data ?? {},
  update: async (d: Record<string, unknown>) => d?.data ?? {},
  delete: async () => ({}),
};

let db: unknown;
try {
  db = new Proxy({}, {
    get: (_, prop) =>
      prop === "query"
        ? new Proxy({}, { get: () => noOp })
        : async () => [],
  });
} catch {
  console.warn("[AI Studio] Database not connected — using mock");
}

export function getDb() {
  return db;
}

export { db, schema };
