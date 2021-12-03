import { Provider } from '@ethersproject/providers';
import { ethers, Wallet } from 'ethers';
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

    writeToJson([{contract:"UniswapV2Factory",address:uniswapV2Factory.address}, {contract:"UniswapV2Router02",address:uniswapV2Router02.address}], "./src/deployments.json")

    tokenFactory = await new TokenFactoryFactory(wallet).deploy();
    await deployTokensAndWrite();
    
}

async function deployTokensAndWrite() {
    for (let i = 0; i <= 3; i++) {
        let txn = await tokenFactory.createNewToken(`Token${i}`, `TK${i}`)
        await txn.wait();
    }

    let addresses = await tokenFactory.getArr();

    writeToJson((populate(addresses)), "./frontend/src/lib/assets/tokens/tokens.json")
    
}


function populate(arr: string[]) {
    return arr.map((item, i) => {
        return { "address": item, "name": `Token${i}`, "symbol": `TK${i}` }
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

interface ITokens { // TODO remove
    address: string,
    name: string,
    symbol: string
}