import { deploy, contract } from 'ethereum-mars';
// import { MyToken } from '../build/artifacts';

import * as dotenv from "dotenv";
import {
    AddressStringUtil, Babylonian, BitMath, FixedPoint, FullMath,
    Math, SafeERC20Namer, TransferHelper, UniswapV2ERC20, UniswapV2Factory, UniswapV2Library,
    UniswapV2LiquidityMathLibrary, UniswapV2OracleLibrary, UniswapV2Pair, UniswapV2Router02, UQ112x112,
} from '../build/artifacts';

dotenv.config();

const privateKey = process.env.TEST_PK as string;
console.log(privateKey)
deploy({ network: 'http://localhost:8545', privateKey }, () => {
    // contract('myToken', MyToken);
    contract('AddressStringUtil', AddressStringUtil)
    contract('Babylonian', Babylonian)
    contract('BitMath', BitMath)
    contract('FixedPoint', FixedPoint)
    contract('FullMath', FullMath)
    contract('Math', Math);
    contract('SafeERC20Namer', SafeERC20Namer)
    contract('TransferHelper', TransferHelper)
    contract('UniswapV2ERC20', UniswapV2ERC20)
    // use current address in ganache
    contract('UniswapV2Factory', UniswapV2Factory, ['0xd8fbe0E6876C70784253af76e5CC6422C8c28f9c'])
    contract('UniswapV2Library', UniswapV2Library)
    contract('UniswapV2LiquidityMathLibrary', UniswapV2LiquidityMathLibrary)
    contract('UniswapV2OracleLibrary', UniswapV2OracleLibrary)
    contract('UniswapV2Pair', UniswapV2Pair)

    // get factory address from deployments.json, second address is supposed to be WETH
    contract('UniswapV2Router02', UniswapV2Router02, ['0xFf38f7AC1D964E7bbb2ccc35a247D9A4f3DE4992','0xFf38f7AC1D964E7bbb2ccc35a247D9A4f3DE4992']);
    contract('UQ112x112', UQ112x112)
});