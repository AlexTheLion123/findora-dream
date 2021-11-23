import * as Mars from "ethereum-mars";

const ERC20__JSON = require("./ERC20.json");
const MyToken__JSON = require("./MyToken.json");

export const ERC20 = Mars.createArtifact<{
  new(name_: Mars.StringLike, symbol_: Mars.StringLike): void;
  allowance(owner: Mars.AddressLike, spender: Mars.AddressLike): Mars.FutureNumber;
  approve(spender: Mars.AddressLike, amount: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  balanceOf(account: Mars.AddressLike): Mars.FutureNumber;
  decimals(): Mars.FutureNumber;
  decreaseAllowance(spender: Mars.AddressLike, subtractedValue: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  increaseAllowance(spender: Mars.AddressLike, addedValue: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  name(): Mars.Future<string>;
  symbol(): Mars.Future<string>;
  totalSupply(): Mars.FutureNumber;
  transfer(recipient: Mars.AddressLike, amount: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  transferFrom(sender: Mars.AddressLike, recipient: Mars.AddressLike, amount: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
}>("ERC20", ERC20__JSON);

export const MyToken = Mars.createArtifact<{
  new(): void;
  allowance(owner: Mars.AddressLike, spender: Mars.AddressLike): Mars.FutureNumber;
  approve(spender: Mars.AddressLike, amount: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  balanceOf(account: Mars.AddressLike): Mars.FutureNumber;
  decimals(): Mars.FutureNumber;
  decreaseAllowance(spender: Mars.AddressLike, subtractedValue: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  increaseAllowance(spender: Mars.AddressLike, addedValue: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  initialize(initialSupply: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  name(): Mars.Future<string>;
  symbol(): Mars.Future<string>;
  totalSupply(): Mars.FutureNumber;
  transfer(recipient: Mars.AddressLike, amount: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  transferFrom(sender: Mars.AddressLike, recipient: Mars.AddressLike, amount: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
}>("MyToken", MyToken__JSON);
