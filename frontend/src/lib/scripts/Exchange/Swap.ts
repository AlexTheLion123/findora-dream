import type { Bytes32, Uint256, Uint32, Address } from 'soltypes';

export async function getExactSwapData(
        tk1Addr: Address,
        tk2Addr: Address,
        numTk1P: number,
        route: Array<Address>
    ) {
        
            return Math.random()*100;
    };

export async function getDollarValue(addr: Address, numTk: number) { // TODO fix
    

    return numTk * Math.random() * 100;
}

export async function getRoute(tk1Addr, tk2Addr): Promise<Address[]> {



    async function checkPairExists(tk1Addr: Address, tk2Addr: Address) {
        return true; // query blockchain
    }

    return [tk1Addr, tk2Addr];
}




