import { database_url } from '../src/config/database';
import { signup } from '../src/signup';
import pgp from "pg-promise";

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('123e4567-e89b-12d3-a456-426614174000'),
}));

describe('SignUp', () => {
  const connection = pgp()(database_url);
  beforeEach(async () => {
    await connection.any('TRUNCATE TABLE cccat17.account RESTART IDENTITY CASCADE');
  });
  afterAll(async () => {
    await connection.$pool.end();
  });

  test('Should returns accountId', async () => {
    const client = await signup({name: 'Tester Test', email: 'test@test.com', cpf: '94738919032', car_plate: 'ABC1234', is_passenger: false, is_driver: true});
    expect(client).toEqual({ accountId: '123e4567-e89b-12d3-a456-426614174000'});
  })

  describe('Should return erro', () => {
    test('Email already exists', async () =>  {
      const email = 'test@test.com';
      await signup({name: 'Tester Test', email: email, cpf: '94738919032', car_plate: 'ABC1234', is_passenger: false, is_driver: true});
      const client = await signup({name: 'Tester Test', email: email, cpf: '94738919032', car_plate: 'ABC1234', is_passenger: false, is_driver: true});
      expect(client.message).toBe('Email already exists');
    })

    test.each([
      'T3st',
      '123',
      'Teste_T3st'
    ])('Invalid name %s', async (name: string) =>  {
      const client = await signup({name: name, email: 'test@test.com', cpf: '94738919032', car_plate: 'ABC1234', is_passenger: false, is_driver: true});
      expect(client.message).toBe('Invalid name')
    })

    test.each([
      'test@',
      '@test',
      'test.test',
    ])('Invalid email %s', async (email: string) =>  {
      const client = await signup({name: 'Tester Test', email: email, cpf: '94738919032', car_plate: 'ABC1234', is_passenger: false, is_driver: true});
      expect(client.message).toBe('Invalid email');
    })

    test.each([
      "",
      "123456",
    ])("Invalid cpf %s", async (cpf: any) =>  {
      const client = await signup({name: 'Tester Test', email: 'test@test.com', cpf: cpf, car_plate: 'ABC1234', is_passenger: false, is_driver: true});
      expect(client.message).toBe('Invalid cpf');
    });

    test.each([
      "",
      "AB12345",
      "ABc123",
      "ABC",
      "1234567",
    ])("Invalid car plate %s", async (car_plate: string) =>  {
      const client = await signup({name: 'Tester Test', email: 'test@test.com', cpf: '94738919032', car_plate: car_plate, is_passenger: false, is_driver: true});
      expect(client.message).toBe('Invalid car plate');
    });
  })
})
