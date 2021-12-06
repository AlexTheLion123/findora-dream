import { Provider } from '@ethersproject/providers';
import { ethers, Wallet } from 'ethers';
import {
    UniswapV2Factory, UniswapV2FactoryFactory, UniswapV2Router02, UniswapV2Router02Factory, UniswapV2Pair, MyToken
} from '../build/types';
import { MyTokenFactory } from '../build/types/MyTokenFactory';
import { writeToJson } from './deployUtils';
import { erc20ABI, uniswapV2PairABI } from './deployABIs';
import { replaceInitCodeInFile} from './deployUtils'; // keep but don't use 
import type { ITokensInfo } from './deployTypes';
import {sendToAddress} from './deployUtils'

let provider: Provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const PRIVATE_KEY = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
const MY_ADDRESS = '0x6919aE4C89f9ED4A79aE70Fb4cC78396F48A42cA'
const wallet = new Wallet(PRIVATE_KEY).connect(provider);

let uniswapV2Factory: UniswapV2Factory;
let uniswapV2Router02: UniswapV2Router02;
let tokensInfo: ITokensInfo[] = new Array()

deploy();

async function deploy() {
    await deployUniswapAndWrite();
    await deployTokensAndWrite();
    await addLiquity();
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
    for (let i = 0; i < 4; i++) {
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

    writeToJson(tokensInfo, "frontend/src/lib/assets/tokens/tokens.json")
    await sendToAddress(MY_ADDRESS, tokensInfo, wallet, erc20ABI)

}


/**
 * @dev adds liquidity for first four pairs in all combinations (ie. 1-2, 1-3, 1-4, 2-3, 2-4, 3-4)
 * sends liquidity tokens to my address
 */
async function addLiquity() {
    const tenThou = ethers.constants.WeiPerEther.mul(10000);
    const nineThou = ethers.constants.WeiPerEther.mul(9000)
    
    const addr1 = tokensInfo[0].address
    const addr2 = tokensInfo[1].address
    const addr3 = tokensInfo[2].address
    const addr4 = tokensInfo[3].address

    const signedRouter = uniswapV2Router02.connect(wallet);
    const signedFactory = uniswapV2Factory.connect(wallet);
    
    addLiquity2();
    
    /**
     * @dev first approve before spending
     * We don't need to worry about creating pair first since router will automatically call createPair on factory if pair does not exist
     */
    async function addLiquity2() {
        const walletAddress = await wallet.getAddress();

        // need to approve for both tokens
        await approveTransfer(addr1)
        await approveTransfer(addr2)

        async function approveTransfer(_addr: string) {
            const erc20Instance = new ethers.Contract(_addr, erc20ABI, wallet) as MyToken;

            // approve router contract to spend wallet's coins
            const txn = await erc20Instance.approve(signedRouter.address, tenThou);
            await txn.wait();

            // check that approval
            const txn2 = await erc20Instance.allowance(walletAddress, signedRouter.address)
            console.log(txn2.toString())
        }


        let txn = await signedRouter.addLiquidity(addr1,addr2,nineThou,nineThou,0,0,await wallet.getAddress(),tenThou)
        await txn.wait();
    
        const pairAddress = await signedFactory.getPair(addr1, addr2);
    
        // check that pair was indeed create and that liquidity was added
        const pairContract = await new ethers.Contract(pairAddress, uniswapV2PairABI, wallet) as UniswapV2Pair
        await pairContract.deployed();
        const reserves: any = await pairContract.getReserves();
        console.log("Reserve1: ", reserves[0].toString());
        console.log("Reserve2: ", reserves[1].toString());
    }

    
    
    // signedRouter.addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)
    // signedRouter.addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)
    // signedRouter.addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)
    // signedRouter.addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)
    // signedRouter.addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)
}




// function createPairAndAddLiquidity(factory, router, addr1, addr2, mintTo, deadline) {
    

// }
