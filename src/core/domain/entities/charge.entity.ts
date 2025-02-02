import { AggregateRootInterface } from '../../shared/domain/entities/aggregate-root.interface';
import { Entity } from '../../shared/domain/entities/entity.abstract';

export type ChargeProps = {
  id?: string;
  name: string;
  government_id: number;
  email: string;
  debt_amount: number;
  debt_due_date: Date;
  debt_id: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
};

export default class Charge extends Entity implements AggregateRootInterface {
  private _name: string;
  private _government_id: number;
  private _email: string;
  private _debt_amount: number;
  private _debt_due_date: Date;
  private _debt_id: string;

  constructor(props: ChargeProps) {
    super(props.id, props.created_at, props.updated_at, props.deleted_at);
    this._name = props.name;
    this._government_id = props.government_id;
    this._email = props.email;
    this._debt_amount = props.debt_amount;
    this._debt_due_date = props.debt_due_date;
    this._debt_id = props.debt_id;
  }

  get name(): string {
    return this._name;
  }

  get government_id(): number {
    return this._government_id;
  }

  get email(): string {
    return this._email;
  }

  get debt_amount(): number {
    return this._debt_amount;
  }

  get debt_due_date(): Date {
    return this._debt_due_date;
  }

  get debt_id(): string {
    return this._debt_id;
  }

  generateDocument(): string {
    return 'Boleto gerado com sucesso!';
  }

  toJSON(): ChargeProps {
    return {
      id: this.id,
      name: this._name,
      government_id: this._government_id,
      email: this._email,
      debt_amount: this._debt_amount,
      debt_due_date: this._debt_due_date,
      debt_id: this._debt_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    };
  }
}
