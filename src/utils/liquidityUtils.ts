
import { ethers } from "ethers";
import { erc20ABI, uniswapV2PairABI } from '../ABIs';
import type { MyToken, UniswapV2Router02, UniswapV2Factory, UniswapV2Pair } from '../../build/types';
import type { Wallet } from 'ethers'
import { getPairAddress } from "."

/**
     * @dev 
     * We don't need to worry about creating pair first since router will automatically call createPair on factory if pair does not exist
     * @param spender - address of the smart contract. This is used to approve tokens transfer to LP 
     * @param minTo - address of the account to mint the liquidity tokens to.
     */
export async function addLiquitySpecific(_addr1: string, _addr2: string, _amount1: ethers.BigNumber, _amount2: ethers.BigNumber, spender: string, router: UniswapV2Router02, factory: UniswapV2Factory, provider: Wallet, mintTo: string) {
    await approveTransfer(_addr1, _amount1, spender, router, factory, provider)
    await approveTransfer(_addr2, _amount2, spender, router, factory, provider)

    const txn = await router.addLiquidity(_addr1, _addr2, _amount1, _amount2, 0, 0, mintTo, _amount1) // TODO fix deadline to get realistic value
    await txn.wait();

    // check that pair was indeed create and that liquidity was added
    await checkAdditionSuccess(factory, _addr1, _addr2, provider);

}

async function approveTransfer(tokenAddress: string, _amount: ethers.BigNumber, _spender: string, _router: UniswapV2Router02, _factory: UniswapV2Factory, provider: Wallet) {
    const erc20Instance = await new ethers.Contract(tokenAddress, erc20ABI, provider).deployed() as MyToken;

    // approve router contract to spend wallet's coins
    const txn = await erc20Instance.approve(_router.address, _amount);
    await txn.wait();
}

async function checkAdditionSuccess(_factory: UniswapV2Factory, _addr1: string, _addr2: string, _provider: Wallet) {
    const pairAddress = getPairAddress(_factory.address, _addr1, _addr2)

    const pairContract = await new ethers.Contract(pairAddress, uniswapV2PairABI, _provider).deployed() as UniswapV2Pair
    const reserves: any = await pairContract.getReserves();
    console.log("Reserve1: ", reserves[0].toString(), "Token at", _addr1);
    console.log("Reserve2: ", reserves[1].toString(), "Token at", _addr2);
}


