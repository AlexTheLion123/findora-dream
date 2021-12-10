import type { Provider } from '@ethersproject/providers';
import { ethers, Wallet } from 'ethers';
import {
    UniswapV2Factory, UniswapV2FactoryFactory, UniswapV2Router02, UniswapV2Router02Factory, MyTokenFactory
} from '../build/types';
import { writeToJson, sendToAddress, addLiquitySpecific,replaceInitCodeInFile } from './utils'
import { erc20ABI, uniswapV2PairABI } from './ABIs';
import type { ITokensInfo } from '.';

require('dotenv').config()

let provider: Provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const PRIVATE_KEY = process.env.TEST_PK as string;
const MY_ADDRESS = process.env.MY_ADDRESS as string;
const MY_PK_DEV = process.env.MY_PK_DEV as string;

const wallet = new Wallet(PRIVATE_KEY).connect(provider);

let uniswapV2Factory: UniswapV2Factory;
let uniswapV2Router02: UniswapV2Router02;
let tokensInfo: ITokensInfo[] = new Array()

deploy();

async function deploy() {
    await deployUniswapAndWrite();
    await deployTokensAndWrite();
    await addLiquity();
    await sendMeGasMoney();
}

/**
 * @dev to deploy the uniswap contracts, the following steps are required:
 * 1. Deploy factory with (address feetosetter) in constructor. This address can decide who receives trading fees
 * 2. Execute function setFeeTo(address) and assign an address to receive all trading fees
 * 3. Call the value of INIT_CODE_PAIR_HASH and record it, we need it to correctly deploy the router.
 * 4. Replace hash in Router with INIT_CODE_PAIR_HASH // TODO someone make sure this is done programatically
 * 4. Deploy the router with (factory address, WETH address) in the constructor
 * 5. 
 */
async function deployUniswapAndWrite() {
    const msgSender = await wallet.getAddress();
    uniswapV2Factory = await new UniswapV2FactoryFactory(wallet).deploy(msgSender);
    await uniswapV2Factory.deployed();

    // replaceInitCode()

    uniswapV2Router02 = await new UniswapV2Router02Factory(wallet).deploy(uniswapV2Factory.address, msgSender); // 2nd argument is meant to be address of WETH
    await uniswapV2Router02.deployed();
    writeToJson([{ contract: "UniswapV2Factory", address: uniswapV2Factory.address }, { contract: "UniswapV2Router02", address: uniswapV2Router02.address }], "frontend/src/lib/assets/deployments.json")
}

async function deployTokensAndWrite() {
    for (let i = 0; i < 10; i++) {
        if (i == 0) {
            await deployWithName("Native", "NATIVE")
            continue
        } else if(i == 1) {
            await deployWithName("USDT", "USDT")
            continue
        }
        await deployWithName(`Token${i + 1}`, `TK${i + 1}`)
    }

    writeToJson(tokensInfo, "frontend/src/lib/assets/tokens/tokens.json")
    await sendToAddress(MY_ADDRESS, tokensInfo, wallet, erc20ABI)

}

async function deployWithName(name: string, symbol: string) {
    let txn = await new MyTokenFactory(wallet).deploy(name, symbol);
    await txn.deployed();
    console.log(`${symbol} has been deployed at ${txn.address}`)
    tokensInfo.push({ address: txn.address, name: name, symbol: symbol })
}


/**
 * @dev adds liquidity for first four pairs in all combinations (ie. 1-2, 1-3, 1-4, 2-3, 2-4, 3-4)
 * sends liquidity tokens to my address
 */
async function addLiquity() {
    //const tenThou = ethers.constants.WeiPerEther.mul(10000);
    const nineThou = ethers.constants.WeiPerEther.mul(9000);
    const fiftyThou = ethers.constants.WeiPerEther.mul(50000);
    const walletAddress = await wallet.getAddress();

    const addr1 = tokensInfo[0].address
    const addr2 = tokensInfo[1].address
    const addr3 = tokensInfo[2].address
    const addr4 = tokensInfo[3].address

    const signedRouter = uniswapV2Router02.connect(wallet);
    const signedFactory = uniswapV2Factory.connect(wallet);


    
    await addLiquitySpecific(addr1, addr2, fiftyThou, fiftyThou, walletAddress, signedRouter, signedFactory, wallet, MY_ADDRESS);
    await addLiquitySpecific(addr1, addr3, fiftyThou, fiftyThou, walletAddress, signedRouter, signedFactory, wallet, MY_ADDRESS);
    await addLiquitySpecific(addr1, addr4, fiftyThou, fiftyThou, walletAddress, signedRouter, signedFactory, wallet, MY_ADDRESS);
    await addLiquitySpecific(addr2, addr3, fiftyThou, fiftyThou, walletAddress, signedRouter, signedFactory, wallet, MY_ADDRESS);
    await addLiquitySpecific(addr2, addr4, fiftyThou, fiftyThou, walletAddress, signedRouter, signedFactory, wallet, MY_ADDRESS);
    await addLiquitySpecific(addr3, addr4, fiftyThou, fiftyThou, walletAddress, signedRouter, signedFactory, wallet, MY_ADDRESS);
    
}

async function sendMeGasMoney() {
    const txn = await wallet.sendTransaction({
        to: MY_ADDRESS,
        value: ethers.utils.parseEther("5.0")
    });
    await txn.wait()

    console.log("my eth balance", await checkMybalance())
}

async function checkMybalance() {
    const myWallet = new Wallet(MY_PK_DEV).connect(provider);
    return ethers.utils.formatEther(await myWallet.getBalance())
}