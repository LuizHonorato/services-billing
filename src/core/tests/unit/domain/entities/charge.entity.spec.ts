import Charge from '../../../../domain/entities/charge.entity';

describe('Charge', () => {
  it('should create a charge entity', () => {
    // 🔧 ARRANGE
    const props = {
      name: 'John Doe',
      government_id: 12345678900,
      email: 'john@doe.com',
      debt_amount: 100.0,
      debt_due_date: new Date(),
      debt_id: '2',
    };

    // 🚀 ACT
    const sut = new Charge(props);

    // 👀 ASSERT
    expect(sut).toBeDefined();
    expect(sut.name).toBe('John Doe');
    expect(sut.government_id).toBe(12345678900);
    expect(sut.email).toBe('john@doe.com');
    expect(sut.debt_amount).toBe(100.0);
    expect(sut.debt_due_date).toBeInstanceOf(Date);
    expect(sut.debt_id).toBe('2');
  });
});
