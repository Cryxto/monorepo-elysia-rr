import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class Apikey {
  @PrimaryKey({ type: 'text' })
  id!: string;

  @Property({ type: 'text', nullable: true })
  name?: string;

  @Property({ type: 'text', nullable: true })
  start?: string;

  @Property({ type: 'text', nullable: true })
  prefix?: string;

  @Property({ type: 'text', index: 'apikey_key_idx' })
  key!: string;

  @ManyToOne({
    entity: () => User,
    fieldName: 'userId',
    deleteRule: 'cascade',
    index: 'apikey_userId_idx',
  })
  userId!: User;

  @Property({ fieldName: 'refillInterval', nullable: true })
  refillInterval?: number;

  @Property({ fieldName: 'refillAmount', nullable: true })
  refillAmount?: number;

  @Property({ fieldName: 'lastRefillAt', type: 'date', nullable: true })
  lastRefillAt?: string;

  @Property({ nullable: true })
  enabled?: number;

  @Property({ fieldName: 'rateLimitEnabled', nullable: true })
  rateLimitEnabled?: number;

  @Property({ fieldName: 'rateLimitTimeWindow', nullable: true })
  rateLimitTimeWindow?: number;

  @Property({ fieldName: 'rateLimitMax', nullable: true })
  rateLimitMax?: number;

  @Property({ fieldName: 'requestCount', nullable: true })
  requestCount?: number;

  @Property({ nullable: true })
  remaining?: number;

  @Property({ fieldName: 'lastRequest', type: 'date', nullable: true })
  lastRequest?: string;

  @Property({ fieldName: 'expiresAt', type: 'date', nullable: true })
  expiresAt?: string;

  @Property({ fieldName: 'createdAt', type: 'date' })
  createdAt!: string;

  @Property({ fieldName: 'updatedAt', type: 'date' })
  updatedAt!: string;

  @Property({ type: 'text', nullable: true })
  permissions?: string;

  @Property({ type: 'text', nullable: true })
  metadata?: string;
}
