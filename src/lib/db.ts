import fs from "fs/promises";
import path from "path";
import { Deadline, Subject, StudentProgressMap } from "@/types/deadline";
import { User } from "@/types/auth";

export interface DatabaseSchema {
  users: User[];
  subjects: Subject[];
  deadlines: Deadline[];
  progress: StudentProgressMap;
}

const DB_PATH = path.join(process.cwd(), "src", "data", "db.json");

export async function readDb(): Promise<DatabaseSchema> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as DatabaseSchema;
  } catch (error) {
    console.error("Failed to read database db.json:", error);
    return {
      users: [],
      subjects: [],
      deadlines: [],
      progress: {},
    };
  }
}

export async function writeDb(data: DatabaseSchema): Promise<void> {
  try {
    const dir = path.dirname(DB_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write database db.json:", error);
    throw error;
  }
}
