import { ProgressStatus } from '../model/topic-progress.model';

export interface ActivityAttemptResult {
  attemptCount: number;
  threshold: number;
  completed: boolean;
  star: number;
}

export interface ActivityProgressSnapshot {
  activityId: string;
  attemptCount: number;
  isCompleted: boolean;
}

export interface IProgressService {
  reportActivityAttempt(
    userId: string,
    activityId: string,
    result?: string | boolean,
  ): Promise<ActivityAttemptResult>;

  getActivityProgressByTopic(
    userId: string,
    topicId: string,
  ): Promise<Map<string, Omit<ActivityProgressSnapshot, 'activityId'>>>;

  getCompletedTopicIds(
    userId: string,
    topicIds: string[],
  ): Promise<Set<string>>;

  getDailyProgressSummary(
    userId: string,
    date: Date,
  ): Promise<DailyProgressSummary>;

  getTopicStatus(userId: string, topicId: string): Promise<ProgressStatus>;

  getWeeklyStatistics(
    userId: string,
    referenceDate: Date,
  ): Promise<IWeeklyStatistics>;
}

export interface IDailyCompletion {
  date: string;
  completed: number;
  starsEarned: number;
}

export interface IWeeklyStatistics {
  weekStart: string;
  weekEnd: string;
  days: IDailyCompletion[];
  totalProgress: number;
  maxTaskCount: number;
}

export interface DailyProgressSummary {
  completedToday: number;
  timePlayed: { minutes: number; seconds: number };
  totalProgress: number;
}

export const PROGRESS_SERVICE = Symbol('PROGRESS_SERVICE');
