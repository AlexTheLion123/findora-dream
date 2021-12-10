import type { BigNumber, ethers, Signer } from "ethers";
import { getReservesQuery } from "./utils";
import {Contract} from 'ethers'
import {ERC20ABI} from '$lib/abis'
import type {Ierc20} from '$lib/typesUsed'

// amounts and reserves out are gotten together to save on queries
export async function getAmountsAndReservesOut({ route, numInput, factoryAddr, signer }: {
    route: string[],
    numInput: BigNumber,
    factoryAddr: string,
    signer: Signer
}){
    // TODO ensure route is valid

    let currentNum = numInput
    
    let reserves: {
        reserve0: ethers.BigNumber,
        reserve1: ethers.BigNumber
    }[] = new Array(route.length-1)

    let amountsOut: BigNumber[] = new Array(route.length-1)

    for (let i = 0; i < route.length - 1; i++) {
        
        const [reserve0, reserve1] = await getReservesQuery({ factoryAddr: factoryAddr, addrInput: route[i], addrOutput: route[i+1], signer: signer});
        const amountOut = getAmountOutManual({amountIn: currentNum, reserveIn: reserve0, reserveOut: reserve1});
        
        reserves[i] = ({reserve0: reserve0, reserve1: reserve1})
        amountsOut[i] = (amountOut)
    }  

    return {
        reservesArr: reserves,
        amountsOutArr: amountsOut
    }
}

function getAmountOutManual({amountIn, reserveIn, reserveOut}: { [k: string]: BigNumber}) {
    const amountInWithFee = amountIn.mul(997);
    const numerator = amountInWithFee.mul(reserveOut);
    const denominator = reserveIn.mul(1000).add(amountInWithFee);
    return numerator.div(denominator);
}

export async function getAllowance({ tokenAddr, ownerAddr, spenderAddr, signer }: {
    tokenAddr: string,
    ownerAddr: string,
    spenderAddr: string,
    signer: Signer
}): Promise<BigNumber> {
    const erc20Instance = new Contract(tokenAddr, ERC20ABI, signer) as Ierc20
    return await erc20Instance.allowance(ownerAddr, spenderAddr);
}