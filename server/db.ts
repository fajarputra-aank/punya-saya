import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ActionItem, InsertActionItem, InsertMeeting, InsertUser, actionItems, meetings, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listMeetings(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(meetings).where(eq(meetings.ownerId, ownerId)).orderBy(desc(meetings.createdAt));
}

export async function getMeeting(ownerId: number, id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(meetings).where(and(eq(meetings.id, id), eq(meetings.ownerId, ownerId))).limit(1);
  return result[0];
}

export async function createMeeting(data: InsertMeeting) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(meetings).values(data).$returningId();
  return result[0]?.id ? getMeeting(data.ownerId, result[0].id) : undefined;
}

export async function updateMeeting(ownerId: number, id: number, data: Partial<InsertMeeting>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(meetings).set(data).where(and(eq(meetings.id, id), eq(meetings.ownerId, ownerId)));
  return getMeeting(ownerId, id);
}

export async function deleteMeeting(ownerId: number, id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(meetings).where(and(eq(meetings.id, id), eq(meetings.ownerId, ownerId)));
  return true;
}

export async function listActionItems(ownerId: number, meetingId?: number) {
  const db = await getDb();
  if (!db) return [];
  const filters = meetingId ? and(eq(actionItems.ownerId, ownerId), eq(actionItems.meetingId, meetingId)) : eq(actionItems.ownerId, ownerId);
  return db.select().from(actionItems).where(filters).orderBy(desc(actionItems.createdAt));
}

export async function createActionItem(data: InsertActionItem) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(actionItems).values(data).$returningId();
  if (!result[0]?.id) return undefined;
  const created = await db.select().from(actionItems).where(eq(actionItems.id, result[0].id)).limit(1);
  return created[0];
}

export async function updateActionItem(ownerId: number, id: number, data: Partial<InsertActionItem>): Promise<ActionItem | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(actionItems).set(data).where(and(eq(actionItems.id, id), eq(actionItems.ownerId, ownerId)));
  const result = await db.select().from(actionItems).where(and(eq(actionItems.id, id), eq(actionItems.ownerId, ownerId))).limit(1);
  return result[0];
}
