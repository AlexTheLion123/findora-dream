import type { JsonRpcSigner } from '@ethersproject/providers';
import type { MyToken } from '$lib/typesUsed/MyToken'
import { ethers } from 'ethers'
import { NoRouteError, SamePairError } from './Errors';
import { pairCreationCode } from '$lib/assets/pairInitCode';
import type { UniswapV2Factory } from '$lib/typesUsed/UniswapV2Factory';
import type { UniswapV2Pair } from '$lib/typesUsed/UniswapV2Pair';
import { UniswapV2PairABI } from '$lib/abis/UniswapV2PairABI';
import { getOtherNumTokens, getDollarValue, getRoute } from '$lib/scripts/Exchange/ExchangeQueries';


export async function getErc20Balance(contract: MyToken, address: string) {

    return removeDecimals(await contract.balanceOf(address))
}

export function removeDecimals(bigNum: ethers.BigNumber): number {
    return parseInt(bigNum.div(ethers.constants.WeiPerEther).toString())
}

export function addDecimals(num: number) {
    const multiplier = ethers.constants.WeiPerEther
    return ethers.BigNumber.from(num).mul(multiplier)
}

// export function getSignerAddress(signer: JsonRpcSigner) {
//     return signer.getAddress()
// }

export async function checkAddressAgainstNative(factory: UniswapV2Factory, nativeAddr: string, addr: string) {
    const tk1AgainstNative = await factory.getPair(nativeAddr, addr);
    return checkAddressExists(tk1AgainstNative);
}

export function checkAddressExists(address: string) {
    return address !== ethers.constants.AddressZero
}

/// @dev gets address of a pair without making any external queries to the blockchain
export function getPairAddress(_factory_addr: string, _addr1: string, _addr2: string) {
    let token0: string;
    let token1: string;

    if (_addr1 < _addr2) {
        token0 = _addr1;
        token1 = _addr2;
    } else {
        token0 = _addr2;
        token1 = _addr1;
    }

    return ethers.utils.getCreate2Address(
        _factory_addr,
        getSalt(token0, token1),
        getPairInitCode(pairCreationCode)
    );
}

function getPairInitCode(_code: string) {
    return ethers.utils.keccak256("0x" + _code)
}

function getSalt(addr1: string, addr2: string) {
    return ethers.utils.keccak256(ethers.utils.solidityPack(["address", "address"], [addr1, addr2]));

}

export async function getReserves(factory_addr: string, addr1: string, addr2: string, _signer: JsonRpcSigner): Promise<number[]> {
    const pairAddress = getPairAddress(factory_addr, addr1, addr2)
    const pairInstance = new ethers.Contract(pairAddress, UniswapV2PairABI, _signer) as UniswapV2Pair;
    const { _reserve0, _reserve1 } = await pairInstance.getReserves();

    const reserve0 = removeDecimals(_reserve0)
    const reserve1 = removeDecimals(_reserve1)

    if (addr1 < addr2) {
        return [reserve0, reserve1]
    } else {
        return [reserve1, reserve0]
    }
}

// TODO cache reserve figures
export async function calcOutputFromPair(factory_addr: string, numTk1: number, addr1: string, addr2: string, _signer: JsonRpcSigner) {
    if (addr1 == addr2) {
        throw new SamePairError();
    }


    const reserves = await getReserves(factory_addr, addr1, addr2, _signer);
    const reserve0 = reserves[0];
    const reserve1 = reserves[1];
    return calcNumOutputTokens(numTk1, reserve0, reserve1);
}

// TODO take slippage into account!
// TODO take trading fee into account
function calcNumOutputTokens(numInputTk: number, _reserve0: number, _reserve1: number) { // TODO perhaps leave in big number until the end, more accurate?
    return _reserve1 - (_reserve0 * _reserve1) / (_reserve0 + numInputTk)
}

// TODO display on swap
function calcNoSlippageSwapRate(numInputTk: number, _reserve0: number, _reserve1: number) { // TODO perhaps leave in big number until the end, more accurate?
    return numInputTk * _reserve1 / _reserve0
}

export async function getExactSwapData(addr1: string, addr2: string, numTk1: number, factory: UniswapV2Factory, nativeAddr: string, _signer: JsonRpcSigner) {
    let route: string[];
    let numTk2: number;
    let dollars2: number;

    try {
        route = await getRoute(addr1, addr2, factory, nativeAddr)
        numTk2 = await getOtherNumTokens(factory.address, numTk1, route, _signer)
        dollars2 = await getDollarValue(addr2, numTk2)
    } catch (error) {
        if (error instanceof NoRouteError) {
            alert("No route exists between this pair")
        } else if (error instanceof SamePairError) {
            alert("Cannot trade same pair")
        }
        throw error;
    }

    return {
        route: route,
        numOutput: numTk2,
        dollarsOutput: dollars2
    }
}
