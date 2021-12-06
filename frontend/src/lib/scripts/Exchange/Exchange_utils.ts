import type { JsonRpcSigner } from '@ethersproject/providers';
import type { MyToken } from '$lib/typesUsed/MyToken'
import { ethers } from 'ethers'

export async function getErc20Balance(contract: MyToken, address: string) {
    return (await contract.balanceOf(address)).div(ethers.constants.WeiPerEther).toString();
}

export async function getSignerAddress(signer: JsonRpcSigner) {
    return await signer.getAddress()
}