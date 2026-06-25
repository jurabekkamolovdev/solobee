import { ProgressStatus } from '../model/topic-progress.model';

export interface ActivityAttemptResult {
  attemptCount: number;
  threshold: number;
  completed: boolean;
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
    result?: string,
  ): Promise<ActivityAttemptResult>;

  getActivityProgressByTopic(
    userId: string,
    topicId: string,
  ): Promise<Map<string, Omit<ActivityProgressSnapshot, 'activityId'>>>;

  getCompletedTopicIds(
    userId: string,
    topicIds: string[],
  ): Promise<Set<string>>;

  getTopicStatus(userId: string, topicId: string): Promise<ProgressStatus>;
}

export const PROGRESS_SERVICE = Symbol('PROGRESS_SERVICE');
