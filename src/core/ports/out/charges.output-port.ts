import Charge from '@/core/domain/entities/charge.entity';

export default interface ChargesOutputPort {
  findByGovernmentId(governmentId: number): Promise<Charge | null>;
  create(bankSlip: Charge): Promise<void>;
}
