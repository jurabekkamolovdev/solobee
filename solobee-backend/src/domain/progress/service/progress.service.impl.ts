import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  type IProgressService,
  ActivityAttemptResult,
  ActivityProgressSnapshot,
  IDailyCompletion,
  IWeeklyStatistics,
  DailyProgressSummary,
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
  private readonly dayNames = [
    'Dushanba',
    'Seshanba',
    'Chorshanba',
    'Payshanba',
    'Juma',
    'Shanba',
    'Yakshanba',
  ];
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
    result?: string | boolean,
  ): Promise<ActivityAttemptResult> {
    const activity = await this.activityRefRepository.findById(activityId);
    if (!activity) throw new NotFoundException('Activity not found');

    // const type = activity.getType();
    const threshold = ATTEMPT_THRESHOLDS[activity.getType()] ?? 1;

    let progress =
      await this.activityProgressRepository.findByStudentAndActivity(
        userId,
        activityId,
      );

    if (!progress) {
      progress = ActivityProgress.create(userId, activityId);
    }

    // if (type === ActivityType.WRITING) {
    //   const payload = activity.getPayload() as WritingPayload;
    //   if (payload.mode === 'spell') {
    //     result = result?.toString();
    //     const isCorrect =
    //       result !== undefined &&
    //       payload.answer.trim().toLowerCase() === result.trim().toLowerCase();

    //     if (!isCorrect) {
    //       progress.incrementAttempt();
    //       await this.activityProgressRepository.save(progress);
    //       return {
    //         attemptCount: progress.getAttemptCount(),
    //         threshold,
    //         completed: false,
    //       };
    //     }
    //   }
    // } else if (
    //   type === ActivityType.WORDHUNT ||
    //   type === ActivityType.PICQUEST
    // ) {
    //   if (!result) {
    //     progress.incrementAttempt();
    //     await this.activityProgressRepository.save(progress);
    //     return {
    //       attemptCount: progress.getAttemptCount(),
    //       threshold,
    //       completed: false,
    //     };
    //   }
    // } else if (type === ActivityType.LEARN) {
    //   progress.incrementAttempt();
    //   await this.activityProgressRepository.save(progress);
    //   if (progress.getAttemptCount() < threshold) {
    //     return {
    //       attemptCount: progress.getAttemptCount(),
    //       threshold,
    //       completed: false,
    //     };
    //   }
    // }
    if (!progress.getIsCompleted()) {
      progress.recordAttempt(activity, result);
      await this.activityProgressRepository.save(progress);
      if (progress.getIsCompleted()) {
        this.eventEmitter.emit('activity.completed', {
          studentUserId: userId,
          activityId,
          topicId: activity.getTopicId(),
          stars: progress.getStars(),
        });
      }
      await this.activityProgressRepository.save(progress);
    }

    // if (progress.getIsCompleted()) {
    //   this.eventEmitter.emit('activity.completed', {
    //     studentUserId: userId,
    //     activityId,
    //     topicId: activity.getTopicId(),
    //   });
    // }

    return {
      attemptCount: progress.getAttemptCount(),
      threshold,
      completed: progress.getIsCompleted(),
      star: progress.getStars(),
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

  async getDailyProgressSummary(
    userId: string,
    date: Date,
  ): Promise<DailyProgressSummary> {
    const activityProgress: ActivityProgress[] =
      await this.activityProgressRepository.findCompletedByStudentAndDate(
        userId,
        date,
      );

    const completedToday = activityProgress.length;

    const totalSeconds = activityProgress.reduce((acc, ap) => {
      const createdAt = ap.getCreatedAt();
      const updatedAt = ap.getUpdatedAt();
      if (!createdAt || !updatedAt) return acc;

      const diffMs = updatedAt.getTime() - createdAt.getTime();
      return acc + Math.max(0, Math.floor(diffMs / 1000));
    }, 0);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const MAX_STARS_PER_ACTIVITY = 5;
    const maxPossibleStars = completedToday * MAX_STARS_PER_ACTIVITY;
    const earnedStars = activityProgress.reduce(
      (acc, ap) => acc + ap.getStars(),
      0,
    );

    const totalProgress =
      maxPossibleStars > 0
        ? Math.round((earnedStars / maxPossibleStars) * 100)
        : 0;

    return {
      completedToday,
      timePlayed: { minutes, seconds },
      totalProgress,
    };
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

  async getWeeklyStatistics(
    userId: string,
    referenceDate: Date = new Date(),
  ): Promise<IWeeklyStatistics> {
    const { weekStart, weekEnd } = this.getWeekRange(referenceDate);

    const grouped =
      await this.activityProgressRepository.getCompletedStatsGroupedByDate(
        userId,
        weekStart,
        weekEnd,
      );

    const statsByDate = new Map(
      grouped.map((g) => [
        g.date,
        { count: g.count, totalStars: g.totalStars },
      ]),
    );

    const days: IDailyCompletion[] = [];
    let weeklyCompleted = 0;
    let weeklyStars = 0;

    for (let i = 0; i < 7; i++) {
      const current = new Date(weekStart);
      current.setDate(weekStart.getDate() + i);
      const dateKey = current.toISOString().slice(0, 10);

      const dayStats = statsByDate.get(dateKey) ?? { count: 0, totalStars: 0 };

      days.push({
        date: dateKey,
        dayOfWeek: this.dayNames[i],
        completed: dayStats.count,
        starsEarned: dayStats.totalStars,
      });

      weeklyCompleted += dayStats.count;
      weeklyStars += dayStats.totalStars;
    }

    const MAX_STARS_PER_ACTIVITY = 5;
    const maxPossibleStars = weeklyCompleted * MAX_STARS_PER_ACTIVITY;
    const totalProgress =
      maxPossibleStars > 0
        ? Math.round((weeklyStars / maxPossibleStars) * 100)
        : 0;

    return {
      weekStart: weekStart.toISOString().slice(0, 10),
      weekEnd: weekEnd.toISOString().slice(0, 10),
      days,
      totalProgress,
    };
  }

  private getWeekRange(referenceDate: Date): {
    weekStart: Date;
    weekEnd: Date;
  } {
    const date = new Date(referenceDate);
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() + diffToMonday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return { weekStart, weekEnd };
  }
}
