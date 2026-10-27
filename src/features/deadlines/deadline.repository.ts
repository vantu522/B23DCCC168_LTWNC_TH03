import { readDb, writeDb } from "@/lib/db";
import { CreateDeadlineInput, Deadline, StudentProgressMap } from "@/types/deadline";

export class DeadlineRepository {
  static async findAll(): Promise<Deadline[]> {
    const db = await readDb();
    return db.deadlines || [];
  }

  static async findById(id: string): Promise<Deadline | null> {
    const db = await readDb();
    const found = db.deadlines.find((d) => d.id === id);
    return found || null;
  }

  static async findBySubject(subjectId: string): Promise<Deadline[]> {
    const db = await readDb();
    return db.deadlines.filter((d) => d.subjectId === subjectId);
  }

  static async create(input: CreateDeadlineInput): Promise<Deadline> {
    const db = await readDb();
    const newDeadline: Deadline = {
      id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      subjectId: input.subjectId,
      title: input.title.trim(),
      description: input.description ? input.description.trim() : "",
      dueDate: input.dueDate,
      priority: input.priority,
      type: input.type,
      submissionUrl: input.submissionUrl ? input.submissionUrl.trim() : "",
      target: input.target || "Cá nhân",
      createdAt: new Date().toISOString(),
    };

    db.deadlines.unshift(newDeadline);
    await writeDb(db);
    return newDeadline;
  }

  static async delete(id: string): Promise<boolean> {
    const db = await readDb();
    const initialLen = db.deadlines.length;
    db.deadlines = db.deadlines.filter((d) => d.id !== id);

    if (db.deadlines.length !== initialLen) {
      // Dọn dẹp trong progress
      for (const email of Object.keys(db.progress)) {
        db.progress[email] = db.progress[email].filter((dId) => dId !== id);
      }
      await writeDb(db);
      return true;
    }
    return false;
  }

  static async getProgressMap(): Promise<StudentProgressMap> {
    const db = await readDb();
    return db.progress || {};
  }

  static async getCompletedByUser(email: string): Promise<string[]> {
    const db = await readDb();
    return db.progress[email.toLowerCase()] || [];
  }

  static async toggleCompletion(
    email: string,
    deadlineId: string
  ): Promise<{ completed: boolean; completedList: string[] }> {
    const db = await readDb();
    const key = email.toLowerCase();
    const currentList = db.progress[key] || [];
    const exists = currentList.includes(deadlineId);

    let updatedList: string[];
    if (exists) {
      updatedList = currentList.filter((id) => id !== deadlineId);
    } else {
      updatedList = [...currentList, deadlineId];
    }

    db.progress[key] = updatedList;
    await writeDb(db);

    return {
      completed: !exists,
      completedList: updatedList,
    };
  }
}
