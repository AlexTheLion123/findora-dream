import { ethers } from 'ethers'
import {addDecimals } from './utils/utils';
import type {Signer, } from 'ethers'
import type { ISwapInput, ISwapOutput } from '$lib/typesFrontend'
import { ERC20ABI } from '$lib/abis';
import type { Ierc20 } from '$lib/typesUsed';

export async function swapExactInput({ amountInExact, amountOutMin, route, to, router, deadline}: ISwapInput) {
    let txn = await router.swapExactTokensForTokens(amountInExact, amountOutMin, route, to, deadline)
    await txn.wait();
    alert("yay, swap performed")
}


// TODO but don't implement for now
export async function swapExactOutput({ amountInMax, amountOutExact, route, to, router, deadline}: ISwapOutput) {
    let txn = await router.swapTokensForExactTokens(amountInMax, amountOutExact, route, to, deadline)
    await txn.wait();
    alert("yay, swap performed")
}


export async function approveMax(addressToken: string, addressSpender: string, signer: Signer) {
    let txn = await (new ethers.Contract(addressToken, ERC20ABI, signer) as Ierc20).deployed()
        .then(res => {
            res.connect(signer)
            return res.approve(addressSpender, ethers.constants.MaxUint256)
        })
    await txn.wait();
}

export async function performLiquidity() {
    alert("perform liquidity")
}