import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  type IProgressService,
  ActivityAttemptResult,
  ActivityProgressSnapshot,
} from './progress.service.interface';
import {
  ActivityProgress,
  ATTEMPT_THRESHOLDS,
} from '../model/activity-progress.model';
import { ProgressStatus } from '../model/topic-progress.model';
import {
  ACTIVITY_PROGRESS_REPOSITORY,
  type IActivityProgressRepository,
} from 'src/datasource/progress/repository/activity-progress.repository.interface';
import {
  TOPIC_PROGRESS_REPOSITORY,
  type ITopicProgressRepository,
} from 'src/datasource/progress/repository/topic-progress.repository.interface';

import {
  ACTIVITY_REPOSITORY,
  type IActivityRepository,
} from 'src/datasource/courses/repository/interface/activity.repository.interface';

@Injectable()
export class ProgressServiceImpl implements IProgressService {
  constructor(
    @Inject(ACTIVITY_PROGRESS_REPOSITORY)
    private readonly activityProgressRepository: IActivityProgressRepository,
    @Inject(TOPIC_PROGRESS_REPOSITORY)
    private readonly topicProgressRepository: ITopicProgressRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRefRepository: IActivityRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async reportActivityAttempt(
    userId: string,
    activityId: string,
  ): Promise<ActivityAttemptResult> {
    const activity = await this.activityRefRepository.findById(activityId);
    if (!activity) throw new NotFoundException('Activity not found');

    const threshold = ATTEMPT_THRESHOLDS[activity.getType()] ?? 1;

    let progress =
      await this.activityProgressRepository.findByStudentAndActivity(
        userId,
        activityId,
      );

    if (!progress) {
      progress = ActivityProgress.create(userId, activityId);
    }

    const justCompleted = progress.recordAttempt(threshold);

    await this.activityProgressRepository.save(progress);

    if (justCompleted) {
      this.eventEmitter.emit('activity.completed', {
        studentUserId: userId,
        activityId,
        topicId: activity.getTopicId(),
      });
    }

    return {
      attemptCount: progress.getAttemptCount(),
      threshold,
      completed: progress.getIsCompleted(),
    };
  }

  async getActivityProgressByTopic(
    userId: string,
    topicId: string,
  ): Promise<Map<string, Omit<ActivityProgressSnapshot, 'activityId'>>> {
    const snapshots =
      await this.activityProgressRepository.findSnapshotsByStudentAndTopic(
        userId,
        topicId,
      );

    const map = new Map<string, Omit<ActivityProgressSnapshot, 'activityId'>>();
    for (const s of snapshots) {
      map.set(s.activityId, {
        attemptCount: s.attemptCount,
        isCompleted: s.isCompleted,
      });
    }
    return map;
  }

  async getCompletedTopicIds(
    userId: string,
    topicIds: string[],
  ): Promise<Set<string>> {
    if (topicIds.length === 0) return new Set();
    const ids = await this.topicProgressRepository.findCompletedTopicIds(
      userId,
      topicIds,
    );
    return new Set(ids);
  }

  async getTopicStatus(
    userId: string,
    topicId: string,
  ): Promise<ProgressStatus> {
    const status =
      await this.topicProgressRepository.findStatusByStudentAndTopic(
        userId,
        topicId,
      );
    return status ?? ProgressStatus.LOCKED;
  }
}
