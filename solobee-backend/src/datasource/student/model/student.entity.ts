import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/datasource/user/model/user.entity';

@Entity('students')
export class StudentEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @PrimaryColumn('uuid')
  userId: string;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ type: 'varchar', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', nullable: true })
  parentPhone: string | null;

  @Column({ default: 12000 })
  score: number;

  @Column({ type: 'varchar', nullable: true })
  avatarKey: string | null;

  @Column({ type: 'varchar', nullable: true })
  currentTopicId: string | null; // Last accessed or next lesson for the Home Page card

  @Column({ type: 'varchar', nullable: true })
  currentCategoryId: string | null; // The category of the current topic for UI quick-access

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
