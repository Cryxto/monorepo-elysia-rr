import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class Account {
  @PrimaryKey({ type: 'text' })
  id!: string;

  @Property({ fieldName: 'accountId', type: 'text' })
  accountId!: string;

  @Property({ fieldName: 'providerId', type: 'text' })
  providerId!: string;

  @ManyToOne({
    entity: () => User,
    fieldName: 'userId',
    deleteRule: 'cascade',
    index: 'account_userId_idx',
  })
  userId!: User;

  @Property({ fieldName: 'accessToken', type: 'text', nullable: true })
  accessToken?: string;

  @Property({ fieldName: 'refreshToken', type: 'text', nullable: true })
  refreshToken?: string;

  @Property({ fieldName: 'idToken', type: 'text', nullable: true })
  idToken?: string;

  @Property({ fieldName: 'accessTokenExpiresAt', type: 'date', nullable: true })
  accessTokenExpiresAt?: string;

  @Property({
    fieldName: 'refreshTokenExpiresAt',
    type: 'date',
    nullable: true,
  })
  refreshTokenExpiresAt?: string;

  @Property({ type: 'text', nullable: true })
  scope?: string;

  @Property({ type: 'text', nullable: true })
  password?: string;

  @Property({ fieldName: 'createdAt', type: 'date' })
  createdAt!: string;

  @Property({ fieldName: 'updatedAt', type: 'date' })
  updatedAt!: string;
}
