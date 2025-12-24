import {
  BeforeUpdate,
  BeforeUpsert,
  Entity,
  OptionalProps,
  Property,
} from '@mikro-orm/core';
import { DateTime } from 'luxon';

@Entity({ abstract: true })
export abstract class BaseEntityWithTimestamp {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
  @Property({
    type: 'timestamp with time zone',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onCreate: () => DateTime.now().toUTC().toISO(),
  })
  createdAt!: string;

  @Property({
    type: 'timestamp with time zone',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => DateTime.now().toUTC().toISO(),
    onCreate: () => DateTime.now().toUTC().toISO(),
  })
  updatedAt!: string;

  @BeforeUpsert()
  update() {
    console.log('before upsert');
    const time = DateTime.now().toUTC().toSQL();
    this.updatedAt = time;
  }
}
