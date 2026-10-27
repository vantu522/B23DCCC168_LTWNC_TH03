import { readDb } from "@/lib/db";
import { Subject } from "@/types/deadline";

export class SubjectService {
  static async getAllSubjects(): Promise<Subject[]> {
    const db = await readDb();
    return db.subjects || [];
  }

  static async getSubjectBySlug(slug: string): Promise<Subject | null> {
    const db = await readDb();
    const found = db.subjects.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
    return found || null;
  }

  static async getSubjectById(id: string): Promise<Subject | null> {
    const db = await readDb();
    const found = db.subjects.find((s) => s.id.toLowerCase() === id.toLowerCase());
    return found || null;
  }
}
