const fs = require('fs');
const lineReplace = require('line-replace')
import { ethers } from 'ethers'; // TODO delete
import type { MyToken } from '../build/types/MyToken';
import type { ITokensInfo } from './deployTypes';
import { BigNumber } from 'ethers';
import UniswapV2Pair from '../build/UniswapV2Pair.json'

export function writeToJson(info: any, path: string) {
    const jsonContent = JSON.stringify(info);

    fs.writeFile(path, jsonContent, 'utf8', (err: any) => {
        if (err) {
            return console.log(err);
        }
        console.log(info)
        console.log("The file was saved");
    })
}

export function replaceInitCodeInFile(initCode: string, location: string) {
    lineReplace({
        file: location,
        line: 24,
        text: initCode,
        addNewLine: true,
        callback: ({ error }: { error: string }) => { console.log(error) }
    })
}

/// @dev gets human readable abi format from json file in build
function getNiceAbi(filename: string) {
    const FormatTypes = ethers.utils.FormatTypes;
    const fileAsString = fs.readFile(`../build/${filename}.json`, "utf8", (err: string, data: string) => {
        const abi = JSON.parse(data).abi
        const iface = new ethers.utils.Interface(abi);
        console.log(iface.format(FormatTypes.full))
    })
}

export async function sendToAddress(recipient: string, addresses: Array<ITokensInfo>, wallet: any, erc20Abi: any) {
    for (let i = 0; i < addresses.length; i++) {
        let amount = ethers.constants.WeiPerEther.mul(BigNumber.from(Math.round(Math.random() * 100000)))
        const contract = await new ethers.Contract(addresses[i].address, erc20Abi, wallet) as MyToken;
        await contract.deployed();

        let txn = await contract.transfer(recipient, amount)
        await txn.wait()
        console.log(await getBalance(contract, recipient), `of TK${i + 1} has been sent to`, recipient);
    }
}

async function getBalance(contract: MyToken, address: string) {
    return (await contract.balanceOf(address)).div(ethers.constants.WeiPerEther).toString()
}

/**
* @dev unused, since only needed after UniswapV2Pair creation code is edited. (Never?)
* Prints undefined when there is no error
*/
export function replaceInitCode(){
   const pairInitCode = ethers.utils.keccak256("0x" + UniswapV2Pair.bytecode).substring(2)
   replaceInitCodeInFile(`hex'${pairInitCode}' // init code hash`, '../lib/v2-periphery/contracts/libraries/UniswapV2Library.sol')
}

// getNiceAbi("UniswapV2Pair")