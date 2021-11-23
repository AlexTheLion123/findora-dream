import { use, expect } from 'chai';
import { JsonRpcProvider, Provider } from '@ethersproject/providers';
import { solidity } from 'ethereum-waffle';
import { ethers, Wallet } from 'ethers';
import { MyToken, MyTokenFactory } from '../build/types';

import * as dotenv from "dotenv";
dotenv.config();

// Tell Chai to use Waffle's Solidity plugin
use(solidity);

describe ('MyToken', () => {
  // Use custom provider to connect to Moonbase Alpha
  let provider: JsonRpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  let wallet: Wallet;
  let walletTo: Wallet;
  let token: MyToken;

  beforeEach(async () => {
    // Logic for setting up the wallet and deploying MyToken will go here
    const PRIVATE_KEY = process.env.TEST_PK as string;
    // Create a wallet instance using your private key & connect it to the provider
    wallet = new Wallet(PRIVATE_KEY).connect(provider);

    // Create a random account to transfer tokens to & connect it to the provider
    walletTo = Wallet.createRandom().connect(provider);

    // Use your wallet to deploy the MyToken contract
    token = await new MyTokenFactory(wallet).deploy();

    // Mint 10 tokens to the contract owner, which is you
    let contractTransaction = await token.initialize(10);

    // Wait until the transaction is confirmed before running tests
    await contractTransaction.wait();
  });

  // Tests will go here
  it('Mints the correct initial balance', async () => {
    expect(await token.balanceOf(wallet.address)).to.equal(10); // This should fail
  });

  it('Should transfer the correct amount of tokens to the destination account', async () => {
    // Send the destination wallet 7 tokens
    await (await token.transfer(walletTo.address, 7)).wait();
  
    // Expect the destination wallet to have received the 7 tokens
    expect(await token.balanceOf(walletTo.address)).to.equal(7);
  });
})