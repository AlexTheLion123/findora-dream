import { Contract, constants } from 'ethers'
import type { Signer, } from 'ethers'
import type { ISwapOutput } from '$lib/typesFrontend'
import { ERC20ABI } from '$lib/abis';
import type { Ierc20, UniswapV2Router02 } from '$lib/typesUsed';
import type { BigNumber, ContractTransaction } from 'ethers';

export async function swapExactInput({ amountInExact, amountOutMin, route, to, router, deadline }: {
    amountInExact: BigNumber, amountOutMin: BigNumber, route: string[], to: string, router: UniswapV2Router02, deadline: BigNumber
}) {
    return router.swapExactTokensForTokens(amountInExact, amountOutMin, route, to, deadline)
}


// TODO but don't implement for now
export async function swapExactOutput({ amountInMax, amountOutExact, route, to, router, deadline }: ISwapOutput) {
    let txn = await router.swapTokensForExactTokens(amountInMax, amountOutExact, route, to, deadline)
    await txn.wait();
    alert("yay, swap performed")
}


export async function approveMax({ tokenAddress, spenderAddress, signer }: { tokenAddress: string, spenderAddress: string, signer: Signer }): Promise<ContractTransaction> {
    const tokenInstance = (new Contract(tokenAddress, ERC20ABI, signer) as Ierc20)
    return tokenInstance.connect(signer).approve(spenderAddress, constants.MaxUint256)
}

export async function checkAllowanceAndApproveMax({ toSpend, ownerAddr, spenderAddr, tokenAddr, signer }: {
    toSpend: BigNumber, ownerAddr: string, spenderAddr: string, tokenAddr: string, signer: Signer
}) {
    const tokenInstance = new Contract(tokenAddr, ERC20ABI, signer) as Ierc20
    if((await tokenInstance.allowance(ownerAddr, spenderAddr)).lt(toSpend)) {
        return approveMax({tokenAddress: tokenAddr, spenderAddress: spenderAddr, signer: signer})
    }
}