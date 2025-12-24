import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Verification {
  @PrimaryKey({ type: 'text' })
  id!: string;

  @Property({ type: 'text', index: 'verification_identifier_idx' })
  identifier!: string;

  @Property({ type: 'text' })
  value!: string;

  @Property({ fieldName: 'expiresAt', type: 'date' })
  expiresAt!: string;

  @Property({ fieldName: 'createdAt', type: 'date' })
  createdAt!: string;

  @Property({ fieldName: 'updatedAt', type: 'date' })
  updatedAt!: string;
}
