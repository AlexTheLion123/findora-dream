import { Contract } from 'ethers';
import deployments from '$lib/assets/deployments.json';
import { UniswapV2FactoryABI, UniswapV2Router02ABI } from '$lib/abis';
import type { UniswapV2Router02, UniswapV2Factory } from '$lib/typesUsed';
import type { Signer } from 'ethers';

export async function getFactoryAndRouterObjects(signer: Signer, factoryAddress: string, routerAddress: string) {
    console.log(signer, factoryAddress, routerAddress)
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

    return { factoryAddress: factory, routerAddress: router }
}

export function getNativeAndDollarAddr(tokens: {address: string, symbol: string, name: string}[]) {

    let nativeAddr: string = "";
    let dollarsAddr: string = "";

    tokens.map((item) => {
        if (item.symbol === 'NATIVE') {
            nativeAddr = item.address;
        }
        if (item.symbol === 'USDT') {
            dollarsAddr = item.address;
        }
        
    });

    if(!nativeAddr && !dollarsAddr) {
        throw "unable to find native and dollar address"
           
    }

    return {
        nativeAddr: nativeAddr,
        dollarsAddr: dollarsAddr
    };
}

async function getSignedFactoryAndRouterContracts(factoryAddress: string, routerAddress: string, signer: Signer) {
    const factoryContract =await new Contract(factoryAddress, UniswapV2FactoryABI, signer) as UniswapV2Factory
    const routerContract = await new Contract(routerAddress, UniswapV2Router02ABI, signer) as UniswapV2Router02
    return {routerContract: routerContract, factoryContract: factoryContract}
}