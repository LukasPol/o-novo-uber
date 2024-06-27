import { Driver, IAccount, Passanger } from "./account";
import { AccountRepository } from "./account_repository";

export async function signup (input: any): Promise<any> {
	try {
		let account: IAccount;

		if (input.is_driver) {
			account = new Driver(input)
		} else {
			account = new Passanger(input)
		}

		account.validate()

		const reposiroty = new AccountRepository
    const same_email = await reposiroty.find('email', account.email)
		if (same_email) throw new Error("Email already exists")

		if (account.is_driver) { account.validateCarPlate() }
		await reposiroty.save(account)

		const obj = {
			accountId: account.account_id
		};
		return obj;
	} catch (error: any) {
		return error
	}
}
