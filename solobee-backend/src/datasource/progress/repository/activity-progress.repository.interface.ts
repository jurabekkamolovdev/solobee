import { ActivityProgress } from 'src/domain/progress/model/activity-progress.model';
import { ActivityProgressSnapshot } from 'src/domain/progress/service/progress.service.interface';

export interface IActivityProgressRepository {
  save(progress: ActivityProgress): Promise<ActivityProgress>;
  findByStudentAndActivity(
    studentUserId: string,
    activityId: string,
  ): Promise<ActivityProgress | null>;
  countCompletedByStudentInActivities(
    studentUserId: string,
    activityIds: string[],
  ): Promise<number>;
  findCompletedByStudentAndDate(
    studentUserId: string,
    date: Date,
  ): Promise<ActivityProgress[]>;
  findSnapshotsByStudentAndTopic(
    studentUserId: string,
    topicId: string,
  ): Promise<ActivityProgressSnapshot[]>;

  getCompletedStatsGroupedByDate(
    studentUserId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{ date: string; count: number; totalStars: number }[]>;
}

export const ACTIVITY_PROGRESS_REPOSITORY = Symbol(
  'ACTIVITY_PROGRESS_REPOSITORY',
);
