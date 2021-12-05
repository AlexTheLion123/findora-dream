import { Provider } from '@ethersproject/providers';
import { ethers, Wallet } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import {
    TokenFactory, TokenFactoryFactory, FixedPoint, FixedPointFactory, UniswapV2Factory, UniswapV2FactoryFactory, UniswapV2Router02, UniswapV2Router02Factory
} from '../build/types';


const fs = require('fs');

let provider: Provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const PRIVATE_KEY = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
const wallet = new Wallet(PRIVATE_KEY).connect(provider);
let tokenFactory: TokenFactory;

deploy();

async function deploy() {
    const msgSender = await wallet.getAddress();

    const uniswapV2Factory = await new UniswapV2FactoryFactory(wallet).deploy(msgSender);
    const uniswapV2Router02 = await new UniswapV2Router02Factory(wallet).deploy(uniswapV2Factory.address, msgSender); // 2nd argument is meant to be address of WETH

    writeToJson([{contract:"UniswapV2Factory",address:uniswapV2Factory.address}, {contract:"UniswapV2Router02",address:uniswapV2Router02.address}], "./frontend/src/lib/assets/deployments.json")

    tokenFactory = await new TokenFactoryFactory(wallet).deploy();
    await deployTokensAndWrite();
    
}

async function deployTokensAndWrite() {
    for (let i = 0; i < 1; i++) {
        let txn = await tokenFactory.createNewToken(`Token${i+1}`, `TK${i+1}`)
        await txn.wait();

    }

    let addresses = await tokenFactory.getArr();

    
    writeToJson((populate(addresses)), "./frontend/src/lib/assets/tokens/tokens.json")
    sendToAddress(0x6919aE4C89f9ED4A79aE70Fb4cC78396F48A42cA, addresses)
    
}

async function sendToAddress(amount: number, addresses: string[]) {
    const walletAddress = await wallet.getAddress()
    for(let i=0; i<addresses.length; i++) {
        const contract = await new ethers.Contract(addresses[i], erc20Abi, wallet);
        // await contract.transferFrom(await wallet.getAddress(), '0x6919aE4C89f9ED4A79aE70Fb4cC78396F48A42cA', 100)
        await contract.mint()
        console.log(await contract.balanceOf(walletAddress))
    }
}

function populate(arr: string[]) {
    return arr.map((item, i) => {
        return { "address": item, "name": `Token${i+1}`, "symbol": `TK${i+1}` }
    })
}

function writeToJson(info: any , path: string) {
    const jsonContent = JSON.stringify(info);

    fs.writeFile(path, jsonContent, 'utf8', (err: any) => {
        if (err) {
            return console.log(err);
        }
        console.log(info)
        console.log("The file was saved");
    })
}


const erc20Abi = [
    "constructor(string name_, string symbol_)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function decreaseAllowance(address spender, uint256 subtractedValue) returns (bool)",
    "function increaseAllowance(address spender, uint256 addedValue) returns (bool)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function transfer(address recipient, uint256 amount) returns (bool)",
    "function transferFrom(address sender, address recipient, uint256 amount) returns (bool)"
]