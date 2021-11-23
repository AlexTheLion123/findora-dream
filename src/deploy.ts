import { deploy, contract } from 'ethereum-mars';
import { MyToken } from '../build/artifacts';

import * as dotenv from "dotenv";
dotenv.config();

const privateKey = process.env.TEST_PK as string;
console.log(privateKey)
deploy({network: 'http://localhost:8545', privateKey},() => {
    contract('myToken', MyToken);
});