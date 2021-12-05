const fs = require('fs');
const lineReplace = require('line-replace')
import { ethers } from 'ethers'; // TODO delete

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

getNiceAbi("UniswapV2Router02")