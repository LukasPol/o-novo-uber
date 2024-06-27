import { validateCpf } from "./validateCpf"
import crypto from "crypto";

export interface IAccount {
	account_id :string
	name: string
	email: string
  cpf: string
	car_plate?: string
	is_passenger: boolean
	is_driver: boolean

	validate(): any
	validateName(): boolean
	validateEmail(): boolean
  validateCpf(): boolean
	validateCarPlate(): boolean
}

interface IParamsAccount {
	account_id?: string
	name: string
	email: string
  cpf: string
	car_plate?: string
	is_driver: boolean
	is_passenger: boolean
}

export class Account implements IAccount {
	account_id :string
	name: string;
	email: string;
  cpf: string
	car_plate: string;
	is_passenger: boolean;
	is_driver: boolean;

	constructor ({...params}: IParamsAccount) {
		this.account_id = params.account_id || crypto.randomUUID();
		this.name = params.name
		this.email = params.email
		this.cpf = params.cpf
		this.car_plate = params.car_plate || '';
		this.is_driver = params.is_driver
		this.is_passenger = params.is_passenger
	}

  validate(): any {
    return this.validateName() &&
            this.validateEmail() &&
            this.validateCpf()
  }

	validateName(): boolean {
    if (/[a-zA-Z] [a-zA-Z]+/.test(this.name)) return true

    throw new Error("Invalid name");
	}

	validateEmail(): boolean {
    if (/^(.+)@(.+)$/.test(this.email)) return true
    throw new Error("Invalid email");
	}

  validateCpf(): boolean {
    if (validateCpf(this.cpf)) return true

    throw new Error("Invalid cpf");
  }

  validateCarPlate(): boolean {
    throw new Error("Method not implemented.")
  }
}

export class Passanger extends Account {
  constructor ({...params}: IParamsAccount) {
    super(params)
  }
}

export class Driver extends Account {
  constructor ({...params}: IParamsAccount) {
    super(params)
  }

  validateCarPlate(): boolean {
		if(/[A-Z]{3}[0-9]{4}/.test(this.car_plate)) return true

		throw new Error("Invalid car plate")
	}
}
