import {
  ClassTransformOptions,
  Exclude,
  instanceToPlain,
} from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractAuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: string;

  toDto<T>(options?: ClassTransformOptions): T {
    return instanceToPlain(this, options) as T;
  }
}
