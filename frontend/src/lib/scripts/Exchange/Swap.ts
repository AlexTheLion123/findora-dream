import type { Bytes32, Uint256, Uint32, Address } from 'soltypes';

export async function getExactSwapData(
        tk1Addr: Address,
        tk2Addr: Address,
        numTk1: number,
        numTk2: number,
        route: Array<Address>
    ) {
        if(numTk2===0) {
            return Math.random()*100;
        }
        if(numTk1===0){
            return Math.random()*100;
        }
        throw new Error("Can only calculate output with respect to 1 token");
    };

export async function getDollarValue(addr: Address, numTk: number) { // TODO fix
    

    return numTk * Math.random() * 100;
}

export async function getRoute(tk1Addr, tk2Addr) {



    async function checkPairExists(tk1Addr: Address, tk2Addr: Address) {
        return true; // query blockchain
    }

    return [tk1Addr, tk2Addr];
}




