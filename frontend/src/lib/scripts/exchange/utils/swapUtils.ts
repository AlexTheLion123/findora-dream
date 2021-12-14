import type { ethers, Signer } from "ethers";
import { getReservesQuery } from "./utils";
import { Contract, BigNumber } from 'ethers'
import { ERC20ABI } from '$lib/abis'
import type { Ierc20 } from '$lib/typesUsed'

// type SomeProps<T extends boolean> =  {
//     route: string[], 
//     numInputOrOutput: number, 
//     factoryAddr: string, 
//     signer: Signer, 
//     isInput: T
// }

// type ReturnProps<T extends boolean> = T extends true ? { 
//     reservesArr: { reserve0: BigNumber; reserve1: BigNumber; }[]; 
//     amountsOutArr: BigNumber[]; 
// } : string;

// type FuncType<Q extends SomeProps<H>, H extends boolean> = ({ route, numInputOrOutput, factoryAddr, signer, isInput }: Q) => ReturnProps<H>;

// amounts and reserves out are gotten together to save on queries
export async function getAmountsAndReservesInOrOut({ route, numInputOrOutput, factoryAddr, signer, isInput }: {
    route: string[],
    numInputOrOutput: BigNumber,
    factoryAddr: string,
    signer: Signer,
    isInput: boolean
}) {
    // TODO ensure route is valid

    let currentNum = numInputOrOutput

    let reserves: {
        reserve0: ethers.BigNumber,
        reserve1: ethers.BigNumber
    }[] = new Array()

    let amounts: BigNumber[] = new Array()

    if (isInput) {
        for (let i = 0; i < route.length - 1; i++) {
            // working towards output
            const [reserve0, reserve1] = await getReservesQuery({ factoryAddr: factoryAddr, addrInput: route[i], addrOutput: route[i + 1], signer: signer });
            const amountOut = getAmountOutManual({ amountIn: currentNum, reserveIn: reserve0, reserveOut: reserve1 })

            reserves.push({ reserve0: reserve0, reserve1: reserve1 })
            amounts.push(amountOut)

            currentNum = amountOut
        }

    } else {
        for (let i = route.length - 1; i > 0; i--) {
            // working towards input
            console.log(route[i-1], route[i])

            const [reserve0, reserve1] = await getReservesQuery({ factoryAddr: factoryAddr, addrInput: route[i-1], addrOutput: route[i], signer: signer });
            
            const amountIn = getAmountInManual({ amountOut: currentNum, reserveOut: reserve1, reserveIn: reserve0 })

            reserves.push({ reserve0: reserve0, reserve1: reserve1 })
            amounts.push(amountIn)

            currentNum = amountIn
            console.log(reserves, amounts)
        }        
    }
    return {
        reservesArr: reserves,
        amountsArr: amounts
    }
}

function getAmountOutManual({ amountIn, reserveIn, reserveOut }: { [k: string]: BigNumber }) {
    const amountInWithFee = amountIn.mul(997);
    const numerator = amountInWithFee.mul(reserveOut);
    const denominator = reserveIn.mul(1000).add(amountInWithFee);
    return numerator.div(denominator);
}

function getAmountInManual({ amountOut, reserveOut, reserveIn }: { [k: string]: BigNumber }) {
    // get amount In from amount out
    const numerator = amountOut.mul(reserveIn).mul(1000)
    const denominator = reserveOut.sub(amountOut).mul(997)
    return numerator.div(denominator)

}

export async function getAllowance({ tokenAddr, ownerAddr, spenderAddr, signer }: {
    tokenAddr: string,
    ownerAddr: string,
    spenderAddr: string,
    signer: Signer
}): Promise<BigNumber> {
    const erc20Instance = new Contract(tokenAddr, ERC20ABI, signer) as Ierc20
    return erc20Instance.allowance(ownerAddr, spenderAddr);
}