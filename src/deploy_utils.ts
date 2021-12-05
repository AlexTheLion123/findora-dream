const fs = require('fs');
const lineReplace = require('line-replace')


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
        callback: ({ error }: {error: string}) => {console.log(error)}
    })
}