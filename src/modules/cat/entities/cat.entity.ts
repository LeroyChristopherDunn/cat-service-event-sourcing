import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

export enum CatProjection {}

export const SUMMARY_PROJECTION: CatProjection[] = [];

export const DEFAULT_PROJECTION: CatProjection[] = [];

@Entity()
export class Cat {
  @PrimaryKey()
  id: string = v4();

  @Property()
  name: string;

  @Property()
  age: number;

  @Property()
  colour: string;

  @Property({ onCreate: () => new Date() })
  createdDate: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  modifiedDate: Date;
}
