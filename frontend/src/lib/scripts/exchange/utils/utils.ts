import {  Contract, constants, utils } from 'ethers'
import { pairCreationCode } from '$lib/assets/pairInitCode';
import {  UniswapV2PairABI } from '$lib/abis';
import type { UniswapV2Factory, UniswapV2Pair, Ierc20 } from '$lib/typesUsed';
import type { Signer, BigNumber } from 'ethers';


export function removeDecimals(bigNum: BigNumber, decimals: number): number {
    return parseInt(utils.formatUnits(bigNum), decimals)
}

export function addDecimals(num: number, decimals: number): BigNumber {
    return utils.parseUnits(num.toString(), decimals)
}

export function checkAddressExists(address: string) {
    return address !== constants.AddressZero
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

    return utils.getCreate2Address(
        factoryAddr,
        getSalt(token0, token1),
        getPairInitCode(pairCreationCode)
    );

    function getPairInitCode(_code: string) {
        return utils.keccak256("0x" + _code)
    }

    function getSalt(addr1: string, addr2: string) {
        return utils.keccak256(utils.solidityPack(["address", "address"], [addr1, addr2]));

    }
}

export async function getReservesQuery({factoryAddr, addrInput, addrOutput, signer}: {
    factoryAddr: string,
    addrInput: string,
    addrOutput: string,
    signer: Signer
}): Promise<BigNumber[]> {
    const pairAddress = getPairAddress(factoryAddr, addrInput, addrOutput)
    
    const { _reserve0, _reserve1 } = await (new Contract(pairAddress, UniswapV2PairABI, signer) as UniswapV2Pair).getReserves();

    if (addrInput < addrOutput) {
        return [_reserve0, _reserve1]
    } else {
        return [_reserve1, _reserve0]
    }
}

export async function checkAddressAgainstNative(factory: UniswapV2Factory, nativeAddr: string, addr: string) {
    const tk1AgainstNative = await factory.getPair(nativeAddr, addr);
    return checkAddressExists(tk1AgainstNative);
}