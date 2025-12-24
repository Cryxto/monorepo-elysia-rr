import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey({ type: 'text' })
  id!: string;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  email!: string;

  @Property({ fieldName: 'emailVerified' })
  emailVerified!: number;

  @Property({ type: 'text', nullable: true })
  image?: string;

  @Property({ fieldName: 'createdAt', type: 'date' })
  createdAt!: string;

  @Property({ fieldName: 'updatedAt', type: 'date' })
  updatedAt!: string;

  @Property({ type: 'text', nullable: true })
  role?: string;

  @Property({ nullable: true })
  banned?: number;

  @Property({ fieldName: 'banReason', type: 'text', nullable: true })
  banReason?: string;

  @Property({ fieldName: 'banExpires', type: 'date', nullable: true })
  banExpires?: string;
}
