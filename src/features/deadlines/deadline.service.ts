import { DeadlineRepository } from "./deadline.repository";
import { CreateDeadlineInput, Deadline } from "@/types/deadline";
import dayjs from "dayjs";

export class DeadlineService {
  static async getAllDeadlines(): Promise<Deadline[]> {
    return DeadlineRepository.findAll();
  }

  static async getDeadlineById(id: string): Promise<Deadline | null> {
    return DeadlineRepository.findById(id);
  }

  static async getDeadlinesBySubject(subjectId: string): Promise<Deadline[]> {
    return DeadlineRepository.findBySubject(subjectId);
  }

  static async createDeadline(input: CreateDeadlineInput): Promise<Deadline> {
    return DeadlineRepository.create(input);
  }

  static async deleteDeadline(id: string): Promise<boolean> {
    return DeadlineRepository.delete(id);
  }

  static async getUserProgress(email: string): Promise<string[]> {
    return DeadlineRepository.getCompletedByUser(email);
  }

  static async getAllProgress() {
    return DeadlineRepository.getProgressMap();
  }

  static async toggleCompletion(email: string, deadlineId: string) {
    return DeadlineRepository.toggleCompletion(email, deadlineId);
  }

  static calculateStats(deadlines: Deadline[], completedIds: string[] = []) {
    const now = dayjs();
    let urgentCount = 0;
    let overdueCount = 0;

    deadlines.forEach((d) => {
      const due = dayjs(d.dueDate);
      if (due.isBefore(now)) overdueCount++;
      else if (due.diff(now, "day") <= 3) urgentCount++;
    });

    const total = deadlines.length;
    const completedCount = completedIds.filter((id) =>
      deadlines.some((d) => d.id === id)
    ).length;
    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return {
      total,
      urgentCount,
      overdueCount,
      completedCount,
      percent,
    };
  }
}
