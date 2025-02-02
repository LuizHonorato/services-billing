import Id from '../value-objects/id.value-object';

export abstract class Entity {
  private _id: string;
  private _created_at: Date;
  private _updated_at: Date;
  private _deleted_at: Date | undefined;

  constructor(
    id?: string,
    created_at?: Date,
    updated_at?: Date,
    deleted_at?: Date,
  ) {
    this._id = id || new Id().id;
    this._created_at = created_at || new Date();
    this._updated_at = updated_at || new Date();
    this._deleted_at = deleted_at || undefined;
  }

  get id(): string {
    return this._id;
  }

  get created_at(): Date {
    return this._created_at;
  }

  get updated_at(): Date {
    return this._updated_at;
  }

  get deleted_at(): Date | undefined {
    return this._deleted_at;
  }
}
