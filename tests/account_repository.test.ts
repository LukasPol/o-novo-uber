import pgp from "pg-promise";
import { Account } from "../src/account"
import { AccountRepository } from "../src/account_repository"
import { database_url } from "../src/config/database";

describe('AccountRepository', () => {
  const connection = pgp()(database_url);
  beforeEach(async () => {
    await connection.any('TRUNCATE TABLE cccat17.account RESTART IDENTITY CASCADE');
  });
  afterAll(async () => {
    await connection.$pool.end();
  });

  describe('Find', () => {
    beforeEach(async () => {
      const account = new Account({name: 'Test Respo Save', email: 'test@test.com', cpf: '94738919032', car_plate: 'ABC1234', is_passenger: false, is_driver: true})
      new AccountRepository().save(account)
    });

    test('by email', async () => {
      const email = 'test@test.com'
      const reposiroty = new AccountRepository
      const search = await reposiroty.find('email', email)
      expect(search?.email).toEqual(email)
    })
  })

  test('Save', async()=>{
    const account = new Account({name: 'Test Respo Save', email: 'test@test.com', cpf: '94738919032', car_plate: 'ABC1234', is_passenger: false, is_driver: true})
    const reposiroty = new AccountRepository
    await reposiroty.save(account)
    const search = await reposiroty.find('name', 'Test Respo Save')
    expect(search?.name).toEqual('Test Respo Save')
  })
})
