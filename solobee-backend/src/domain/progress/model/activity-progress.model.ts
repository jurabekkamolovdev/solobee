import { v4 as uuidv4 } from 'uuid';
import {
  Activity,
  ActivityType,
  WritingPayload,
} from 'src/domain/courses/model/activity.model';
import { isBoolean, isString } from 'class-validator';

export const ATTEMPT_THRESHOLDS: Record<ActivityType, number> = {
  [ActivityType.LEARN]: 4,
  [ActivityType.WRITING]: 1,
  [ActivityType.WORDHUNT]: 1,
  [ActivityType.PICQUEST]: 1,
};

export const MAX_STAR = 5;

export class ActivityProgress {
  private id: string;
  private studentUserId: string;
  private activityId: string;
  private starsEarned: number;
  private attemptCount: number;
  private isCompleted: boolean;

  constructor(params: {
    id: string;
    studentUserId: string;
    activityId: string;
    starsEarned?: number;
    attemptCount?: number;
    isCompleted?: boolean;
  }) {
    this.id = params.id;
    this.studentUserId = params.studentUserId;
    this.activityId = params.activityId;
    this.starsEarned = params.starsEarned ?? 0;
    this.attemptCount = params.attemptCount ?? 0;
    this.isCompleted = params.isCompleted ?? false;
  }

  static create(studentUserId: string, activityId: string): ActivityProgress {
    return new ActivityProgress({
      id: uuidv4(),
      studentUserId,
      activityId,
    });
  }

  recordAttempt(activity: Activity, result?: string | boolean): void {
    const threshold = ATTEMPT_THRESHOLDS[activity.getType()] ?? 1;
    if (activity.getType() === ActivityType.WRITING) {
      const payload = activity.getPayload() as WritingPayload;
      this.attemptCount++;
      if (payload.mode === 'spell') {
        if (isString(result)) {
          this.isCompleted =
            payload.answer.trim().toLowerCase() === result.trim().toLowerCase();
        }
      } else if (payload.mode === 'trace') {
        this.isCompleted = true;
      }
    } else if (
      activity.getType() === ActivityType.WORDHUNT ||
      activity.getType() === ActivityType.PICQUEST
    ) {
      this.attemptCount++;
      if (isBoolean(result) && result) {
        this.isCompleted = result;
      }
    } else if (activity.getType() === ActivityType.LEARN) {
      this.attemptCount++;
      if (this.attemptCount >= threshold) {
        this.isCompleted = true;
      }
    }

    if (this.isCompleted) {
      this.calculateStars(activity.getType());
    }
  }

  getStars() {
    return this.starsEarned;
  }

  private calculateStars(type: ActivityType) {
    if (type === ActivityType.LEARN) {
      this.starsEarned = MAX_STAR;
    } else if (this.attemptCount - 1 < MAX_STAR) {
      this.starsEarned = MAX_STAR - (this.attemptCount - 1);
    }
  }

  getId(): string {
    return this.id;
  }
  getStudentUserId(): string {
    return this.studentUserId;
  }
  getActivityId(): string {
    return this.activityId;
  }
  getAttemptCount(): number {
    return this.attemptCount;
  }
  getIsCompleted(): boolean {
    return this.isCompleted;
  }
  incrementAttempt(): void {
    this.attemptCount++;
  }
}
