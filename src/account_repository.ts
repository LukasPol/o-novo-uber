import pgp from "pg-promise";
import { database_url } from "./config/database";
import { Account, IAccount } from "./account";

export class AccountRepository {
  connection: any

  constructor() {
    this.connection = pgp()(database_url);
  }

  async save({...account}) {
    return await this.connection.query("insert into cccat17.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.account_id, account.name, account.email, account.cpf, account.car_plate, !!account.is_passenger, !!account.is_driver]);
  }

  async find(attr: string, value: string): Promise<IAccount | undefined> {
    const search = await this.connection.query(`select * from cccat17.account where ${attr} = $1`, value);

    if (!search.length) return undefined

    return new Account(search[0])
  }
}
