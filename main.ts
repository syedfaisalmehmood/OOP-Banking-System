#! /usr/bin/env node

import { faker } from "@faker-js/faker";
import inquirer from "inquirer";
import chalk from "chalk";

//Class of customer
class Customer {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  mob_number: number;
  acc_number: number;

  constructor(
    fName: string,
    lName: string,
    age: number,
    gender: string,
    mobile: number,
    accNum: number
  ) {
    this.firstName = fName;
    this.lastName = lName;
    this.age = age;
    this.gender = gender;
    this.mob_number = mobile;
    this.acc_number = accNum;
  }
}

//Interface of Bank Account
interface BankAccount {
  accNumber: number;
  balance: number;
}

//Class of Bank
class Bank {
  customer: Customer[] = [];
  account: BankAccount[] = [];

  addCustomer(obj: Customer) {
    this.customer.push(obj);
  }

  addAccountNumber(obj: BankAccount) {
    this.account.push(obj);
  }

  transaction(accobj: BankAccount) {
    let newAccounts = this.account.filter(
      (acc) => acc.accNumber !== accobj.accNumber
    );
    this.account = [...newAccounts, accobj];
  }
}

let myBank = new Bank();

//Create Customers
for (let i: number = 1; i <= 5; i++) {
  let fName = faker.person.firstName("male");
  let lName = faker.person.lastName();
  let num = parseInt(faker.string.numeric("3##########"));
  const cus = new Customer(fName, lName, 18 * i, "male", num, 1000 + i);
  myBank.addCustomer(cus);
  myBank.addAccountNumber({ accNumber: cus.acc_number, balance: 1000 * i });
}

// Bank Functionality
async function bankService(bank: Bank) {
  do {
    let service = await inquirer.prompt({
      type: "list",
      name: "select",
      message: "Please Select the Service",
      choices: ["View Balance", "Cash Withdrawal", "Cash Deposit", "Exit"],
    });
    //View Balance
    if (service.select == "View Balance") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Please Enter your Account Number:",
      });
      let account = myBank.account.find((acc) => acc.accNumber == res.num);
      if (!account) {
        console.log(chalk.bold.italic.red("Invalid Account Number"));
      }
      if (account) {
        let name = myBank.customer.find(
          (item) => item.acc_number == account?.accNumber
        );
        console.log(
          `\nDear ${chalk.italic.green(name?.firstName)} ${chalk.italic.green(
            name?.lastName
          )} \nYour Account Balance is ${chalk.bold.blueBright(
            `$${account.balance}\n`
          )}`
        );
      }
    }

    //Cash Withdrawal
    if (service.select == "Cash Withdrawal") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Please Enter your Account Number:",
      });
      let account = myBank.account.find((acc) => acc.accNumber == res.num);
      if (!account) {
        console.log(chalk.bold.italic.red("\nInvalid Account Number\n"));
      }
      if (account) {
        let ans = await inquirer.prompt({
          type: "number",
          name: "US Dollar",
          message: "Please Enter your Desired Amount for Withdrawal:",
        });
        if (ans["US Dollar"] > account.balance) {
          console.log(
            chalk.bold.red.italic(
              "\nYou have insufficient Balance in Your Account\n"
            )
          );
        } else {
          let newBalance = account.balance - ans["US Dollar"];
          // Transaction Method
          bank.transaction({
            accNumber: account.accNumber,
            balance: newBalance,
          });
          console.log(
            chalk.bold.red.italic(
              `\nYour Remaining balance is: $${newBalance}\n`
            )
          );
        }
      }
    }

    //Cash Deposit
    if (service.select == "Cash Deposit") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Please Enter your Account Number:",
      });
      let account = myBank.account.find((acc) => acc.accNumber == res.num);
      if (!account) {
        console.log(chalk.bold.italic.red("\nInvalid Account Number\n"));
      }
      if (account) {
        let ans = await inquirer.prompt({
          type: "number",
          name: "US Dollar",
          message: "Please Enter your Desired Amount for Cash Deposit:",
        });
        let newBalance = account.balance + ans["US Dollar"];
        // Transaction Method
        bank.transaction({
          accNumber: account.accNumber,
          balance: newBalance,
        });
        console.log(
          chalk.bold.italic.green(`\nYour New balance is : $${newBalance}\n`)
        );
      }
    }

    //Exit
    if (service.select == "Exit") {
      console.log(
        chalk.bold.italic.red("\nThank You for Using our Banking Services.\n")
      );
      process.exit();
    }
  } while (true);
}

bankService(myBank);
