import { ethers } from 'ethers';
import deployments from '$lib/assets/deployments.json';
import { UniswapV2FactoryABI, UniswapV2Router02ABI } from '$lib/abis';
import type { UniswapV2Router02, UniswapV2Factory } from '$lib/typesUsed';
import type { JsonRpcSigner } from '@ethersproject/providers';

export async function getFactoryAndRouterObjects(signer: JsonRpcSigner, factoryAddress: string, routerAddress: string) {
    const {factoryContract, routerContract} = await getSignedFactoryAndRouterContracts(factoryAddress, routerAddress, signer)
    return {
        factory: factoryContract,
        router: routerContract
    }
}

export function getFactoryAndRouterAddress() {
    let factory: string | undefined;
    let router: string | undefined;

    deployments.map(({ contract, address }) => {
        if (contract === 'UniswapV2Factory') {
            factory = address;
        } else if (contract === 'UniswapV2Router02') {
            router = address;
        }
    });

    if (!(factory && router)) { 
        throw "This should never happen, make sure deployment files are in correct location in frontend files"; 
    }

    console.log("factory and router address set")
    return { factoryAddress: factory, routerAddress: router }
}

async function getSignedFactoryAndRouterContracts(factoryAddress: string, routerAddress: string, signer: JsonRpcSigner) {
    const factoryContract =await new ethers.Contract(factoryAddress, UniswapV2FactoryABI, signer).deployed() as UniswapV2Factory
    const routerContract = await new ethers.Contract(routerAddress, UniswapV2Router02ABI, signer).deployed() as UniswapV2Router02
    return {routerContract: routerContract, factoryContract: factoryContract}
}