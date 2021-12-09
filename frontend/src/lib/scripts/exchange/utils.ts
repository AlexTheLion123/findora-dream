import { ethers } from 'ethers'
import { SamePairError } from './errors';
import { pairCreationCode } from '$lib/assets/pairInitCode';
import { ERC20ABI, UniswapV2PairABI } from '$lib/abis';
import type { Ierc20, UniswapV2Factory, UniswapV2Pair } from '$lib/typesUsed';
import type { ITokenInfo, IGetAllowance, ICheckAllowance, IGetReserves } from '$lib/typesFrontend'
import type { Signer } from 'ethers';

export async function getErc20Balance(contract: Ierc20, address: string, decimals: number) {
    return removeDecimals(await contract.balanceOf(address), decimals)
}

export function removeDecimals(bigNum: ethers.BigNumber, decimals: number): number {
    return parseInt(ethers.utils.formatUnits(bigNum, decimals))
}

export function addDecimals(num: number, decimals: number): ethers.BigNumber {
    return ethers.utils.parseUnits(num.toString(), decimals)
}

export function checkAddressExists(address: string) {
    return address !== ethers.constants.AddressZero
}

/// @dev gets address of a pair without making any external queries to the blockchain, so far unused
export function getPairAddress(factoryAddr: string, addr1: string, addr2: string) {
    let token0: string;
    let token1: string;

    if (addr1 < addr2) {
        token0 = addr1;
        token1 = addr2;
    } else {
        token0 = addr2;
        token1 = addr1;
    }

    return ethers.utils.getCreate2Address(
        factoryAddr,
        getSalt(token0, token1),
        getPairInitCode(pairCreationCode)
    );

    function getPairInitCode(_code: string) {
        return ethers.utils.keccak256("0x" + _code)
    }

    function getSalt(addr1: string, addr2: string) {
        return ethers.utils.keccak256(ethers.utils.solidityPack(["address", "address"], [addr1, addr2]));

    }
}

export async function getReserves({factoryAddr, addr1, addr2, signer, decimals}: IGetReserves): Promise<number[]> {
    const pairAddress = getPairAddress(factoryAddr, addr1, addr2)
    const { _reserve0, _reserve1 } = await (new ethers.Contract(pairAddress, UniswapV2PairABI, signer) as UniswapV2Pair).getReserves();

    const reserve0 = removeDecimals(_reserve0, decimals)
    const reserve1 = removeDecimals(_reserve1, decimals)

    if (addr1 < addr2) {
        return [reserve0, reserve1]
    } else {
        return [reserve1, reserve0]
    }
}

// TODO cache reserve figures
export async function calcOutputFromPair({ addrInput, addrOutput, numInput, decimals }: ITokenInfo, factoryAddr: string, signer: Signer) {
    if (addrInput == addrOutput) {
        throw new SamePairError();
    }
    const [reserve0, reserve1] = await getReserves({factoryAddr: factoryAddr, addr1: addrInput, addr2: addrOutput, signer: signer, decimals: decimals});
    return calcNumOutputTokens(numInput, reserve0, reserve1);
}

// TODO take slippage into account!
// TODO take trading fee into account
function calcNumOutputTokens(numInput: number | string, reserve0: number, reserve1: number) { // TODO perhaps leave in big number until the end, more accurate?
    numInput = typeof numInput === 'string' ? parseInt(numInput) : numInput;
    return reserve1 - ((reserve0 * reserve1) / (reserve0 + numInput))
}

// TODO display on swap
function calcNoSlippageSwapRate(numInputTk: number, reserve0: number, reserve1: number) { // TODO perhaps leave in big number until the end, more accurate?
    return numInputTk * reserve1 / reserve0
}

export async function getAllowance({ tokenAddr, ownerAddr, spenderAddr, signer }: IGetAllowance): Promise<number> {
    const erc20Instance = new ethers.Contract(tokenAddr, ERC20ABI, signer) as Ierc20
    return parseInt(ethers.utils.formatEther(await erc20Instance.allowance(ownerAddr, spenderAddr)));
}

export async function checkAllowance({ toSpend, ownerAddr, spenderAddr, tokenAddr, signer }: ICheckAllowance): Promise<boolean> {
    return await getAllowance({
        tokenAddr: tokenAddr,
        ownerAddr: ownerAddr,
        spenderAddr: spenderAddr,
        signer: signer
    }) < toSpend ? false : true;

}

export async function checkAddressAgainstNative(factory: UniswapV2Factory, nativeAddr: string, addr: string) {
    const tk1AgainstNative = await factory.getPair(nativeAddr, addr);
    return checkAddressExists(tk1AgainstNative);
}