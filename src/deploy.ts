import { Provider } from '@ethersproject/providers';
import { ethers, Wallet } from 'ethers';
import {
    UniswapV2Factory, UniswapV2FactoryFactory, UniswapV2Router02, UniswapV2Router02Factory
} from '../build/types';
import UniswapV2Pair from '../build/UniswapV2Pair.json'
import { MyToken } from '../build/types/MyToken';
import { MyTokenFactory } from '../build/types/MyTokenFactory';
import { BigNumber } from 'ethers';
import { writeToJson } from './deploy_utils';
import { erc20Abi } from './deploy_abi';
import { replaceInitCodeInFile} from './deploy_utils'

let provider: Provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const PRIVATE_KEY = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
const MY_ADDRESS = '0x6919aE4C89f9ED4A79aE70Fb4cC78396F48A42cA'
const wallet = new Wallet(PRIVATE_KEY).connect(provider);

deploy();

async function deploy() {
    await deployUniswapAndWrite();
    await deployTokensAndWrite();
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
    const uniswapV2Factory = await new UniswapV2FactoryFactory(wallet).deploy(msgSender);
    await uniswapV2Factory.deployed();

    // replaceInitCode()

    const uniswapV2Router02 = await new UniswapV2Router02Factory(wallet).deploy(uniswapV2Factory.address, msgSender); // 2nd argument is meant to be address of WETH
    await uniswapV2Router02.deployed();
    writeToJson([{ contract: "UniswapV2Factory", address: uniswapV2Factory.address }, { contract: "UniswapV2Router02", address: uniswapV2Router02.address }], "../frontend/src/lib/assets/deployments.json")
}

/**
 * @dev unused, since only needed after UniswapV2Pair creation code is edited. (Never?)
 * Prints undefined when there is no error
 */
function replaceInitCode(){
    const pairInitCode = ethers.utils.keccak256("0x" + UniswapV2Pair.bytecode).substring(2)
    replaceInitCodeInFile(`hex'${pairInitCode}' // init code hash`, '../lib/v2-periphery/contracts/libraries/UniswapV2Library.sol')
}

async function deployTokensAndWrite() {
    let tokensInfo: Array<ITokensInfo> = new Array();

    for (let i = 0; i < 30; i++) {
        if (i == 0) {
            let txn = await new MyTokenFactory(wallet).deploy(`Native`, `NATIVE`);
            await txn.deployed();
            console.log(`NATIVE has been deployed at ${txn.address}`)
            tokensInfo.push({ address: txn.address, name: `Native`, symbol: `NATIVE` })
            continue
        }

        let txn = await new MyTokenFactory(wallet).deploy(`Token${i + 1}`, `TK${i + 1}`)
        await txn.deployed();
        console.log(`TK${i + 1} has been deployed at ${txn.address}"`)
        tokensInfo.push({ address: txn.address, name: `Token${i + 1}`, symbol: `TK${i + 1}` })
    }

    writeToJson(tokensInfo, "../frontend/src/lib/assets/tokens/tokens.json")
    sendToAddress(MY_ADDRESS, tokensInfo)

}

async function sendToAddress(recipient: string, addresses: Array<ITokensInfo>) {
    const walletAddress = await wallet.getAddress()
    for (let i = 0; i < addresses.length; i++) {
        let amount = ethers.constants.WeiPerEther.mul(BigNumber.from(Math.round(Math.random() * 100000)))
        const contract = await new ethers.Contract(addresses[i].address, erc20Abi, wallet) as MyToken;
        await contract.deployed();

        let txn = await contract.transfer(recipient, amount)
        await txn.wait()
        console.log(await getBalance(contract, recipient), `of TK${i + 1} has been sent to`, recipient);
    }
}

export async function getBalance(contract: MyToken, address: string) {
    return (await contract.balanceOf(address)).div(ethers.constants.WeiPerEther).toString()
}

interface ITokensInfo {
    address: string,
    name: string,
    symbol: string
}