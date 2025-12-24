import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class Session {
  @PrimaryKey({ type: 'text' })
  id!: string;

  @Property({ fieldName: 'expiresAt', type: 'date' })
  expiresAt!: string;

  @Property({ type: 'text' })
  token!: string;

  @Property({ fieldName: 'createdAt', type: 'date' })
  createdAt!: string;

  @Property({ fieldName: 'updatedAt', type: 'date' })
  updatedAt!: string;

  @Property({ fieldName: 'ipAddress', type: 'text', nullable: true })
  ipAddress?: string;

  @Property({ fieldName: 'userAgent', type: 'text', nullable: true })
  userAgent?: string;

  @ManyToOne({
    entity: () => User,
    fieldName: 'userId',
    deleteRule: 'cascade',
    index: 'session_userId_idx',
  })
  userId!: User;

  @Property({ fieldName: 'impersonatedBy', type: 'text', nullable: true })
  impersonatedBy?: string;
}
