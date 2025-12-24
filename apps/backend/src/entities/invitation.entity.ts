import { BaseEntityWithTimestamp } from '@infrastructures/orm/base';
import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Unique({ properties: ['invitee', 'by'] })
@Entity()
export class Invitation extends BaseEntityWithTimestamp {
  @PrimaryKey()
  id!: string;

  @Property()
  by!: string;

  @Property()
  invitee!: string;

  @Property({
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  invitedAt?: string | null;
}
