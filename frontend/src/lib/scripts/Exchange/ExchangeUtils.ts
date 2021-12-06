import type { JsonRpcSigner } from '@ethersproject/providers';
import type { MyToken } from '$lib/typesUsed/MyToken'
import { ethers } from 'ethers'
import { NoRouteError } from './Errors';
import { Address } from 'soltypes';

export async function getErc20Balance(contract: MyToken, address: string) {
    return (await contract.balanceOf(address)).div(ethers.constants.WeiPerEther).toString();
}

export function getSignerAddress(signer: JsonRpcSigner) {
    return signer.getAddress()
}

/// @dev if executes without throwing, safe to assume route exists against native token
export async function checkPairAgainstNative(factory, nativeAddr, addr1, addr2) {
    const tk1AgainstNative = await factory.getPair(nativeAddr, addr1);
    const tk2AgainstNative = await factory.getPair(nativeAddr, addr2);

    if (!(checkAddressExists(tk1AgainstNative) && checkAddressExists(tk2AgainstNative))) {
        throw new NoRouteError("No obvious route exists, be the first to add liquidity")
    }
}

export function checkAddressExists(address: string) {
    return address !== ethers.constants.AddressZero
}