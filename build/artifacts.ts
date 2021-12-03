import * as Mars from "ethereum-mars";

const AddressStringUtil__JSON = require("./AddressStringUtil.json");
const Babylonian__JSON = require("./Babylonian.json");
const BitMath__JSON = require("./BitMath.json");
const ERC20__JSON = require("./ERC20.json");
const FixedPoint__JSON = require("./FixedPoint.json");
const FullMath__JSON = require("./FullMath.json");
const Math__JSON = require("./Math.json");
const SafeERC20Namer__JSON = require("./SafeERC20Namer.json");
const TokenFactory__JSON = require("./TokenFactory.json");
const TransferHelper__JSON = require("./TransferHelper.json");
const UQ112x112__JSON = require("./UQ112x112.json");
const UniswapV2ERC20__JSON = require("./UniswapV2ERC20.json");
const UniswapV2Factory__JSON = require("./UniswapV2Factory.json");
const UniswapV2Library__JSON = require("./UniswapV2Library.json");
const UniswapV2LiquidityMathLibrary__JSON = require("./UniswapV2LiquidityMathLibrary.json");
const UniswapV2OracleLibrary__JSON = require("./UniswapV2OracleLibrary.json");
const UniswapV2Pair__JSON = require("./UniswapV2Pair.json");
const UniswapV2Router02__JSON = require("./UniswapV2Router02.json");

export const AddressStringUtil = Mars.createArtifact<{
  new(): void;
}>("AddressStringUtil", AddressStringUtil__JSON);

export const Babylonian = Mars.createArtifact<{
  new(): void;
}>("Babylonian", Babylonian__JSON);

export const BitMath = Mars.createArtifact<{
  new(): void;
}>("BitMath", BitMath__JSON);

export const ERC20 = Mars.createArtifact<{
  new(name_: Mars.StringLike, symbol_: Mars.StringLike): void;
  allowance(owner: Mars.AddressLike, spender: Mars.AddressLike): Mars.FutureNumber;
  approve(spender: Mars.AddressLike, amount: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  balanceOf(account: Mars.AddressLike): Mars.FutureNumber;
  decimals(): Mars.FutureNumber;
  decreaseAllowance(spender: Mars.AddressLike, subtractedValue: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  increaseAllowance(spender: Mars.AddressLike, addedValue: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  name(): Mars.Future<string>;
  symbol(): Mars.Future<string>;
  totalSupply(): Mars.FutureNumber;
  transfer(recipient: Mars.AddressLike, amount: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  transferFrom(sender: Mars.AddressLike, recipient: Mars.AddressLike, amount: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
}>("ERC20", ERC20__JSON);

export const FixedPoint = Mars.createArtifact<{
  new(): void;
  Q112(): Mars.FutureNumber;
  RESOLUTION(): Mars.FutureNumber;
}>("FixedPoint", FixedPoint__JSON);

export const FullMath = Mars.createArtifact<{
  new(): void;
}>("FullMath", FullMath__JSON);

export const Math = Mars.createArtifact<{
  new(): void;
}>("Math", Math__JSON);

export const SafeERC20Namer = Mars.createArtifact<{
  new(): void;
}>("SafeERC20Namer", SafeERC20Namer__JSON);

export const TokenFactory = Mars.createArtifact<{
  new(): void;
  arr(_: Mars.NumberLike): Mars.Future<string>;
  createNewToken(_name: Mars.StringLike, _symbol: Mars.StringLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  getArr(): Mars.Future<Mars.Future<string>[]>;
}>("TokenFactory", TokenFactory__JSON);

export const TransferHelper = Mars.createArtifact<{
  new(): void;
}>("TransferHelper", TransferHelper__JSON);

export const UQ112x112 = Mars.createArtifact<{
  new(): void;
}>("UQ112x112", UQ112x112__JSON);

export const UniswapV2ERC20 = Mars.createArtifact<{
  new(): void;
  DOMAIN_SEPARATOR(): Mars.FutureBytes;
  PERMIT_TYPEHASH(): Mars.FutureBytes;
  allowance(_: Mars.AddressLike, __: Mars.AddressLike): Mars.FutureNumber;
  approve(spender: Mars.AddressLike, value: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  balanceOf(_: Mars.AddressLike): Mars.FutureNumber;
  decimals(): Mars.FutureNumber;
  name(): Mars.Future<string>;
  nonces(_: Mars.AddressLike): Mars.FutureNumber;
  permit(owner: Mars.AddressLike, spender: Mars.AddressLike, value: Mars.NumberLike, deadline: Mars.NumberLike, v: Mars.NumberLike, r: Mars.BytesLike, s: Mars.BytesLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  symbol(): Mars.Future<string>;
  totalSupply(): Mars.FutureNumber;
  transfer(to: Mars.AddressLike, value: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  transferFrom(from: Mars.AddressLike, to: Mars.AddressLike, value: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
}>("UniswapV2ERC20", UniswapV2ERC20__JSON);

export const UniswapV2Factory = Mars.createArtifact<{
  new(_feeToSetter: Mars.AddressLike): void;
  allPairs(_: Mars.NumberLike): Mars.Future<string>;
  allPairsLength(): Mars.FutureNumber;
  createPair(tokenA: Mars.AddressLike, tokenB: Mars.AddressLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  feeTo(): Mars.Future<string>;
  feeToSetter(): Mars.Future<string>;
  getPair(_: Mars.AddressLike, __: Mars.AddressLike): Mars.Future<string>;
  setFeeTo(_feeTo: Mars.AddressLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  setFeeToSetter(_feeToSetter: Mars.AddressLike, options?: Mars.TransactionOverrides): Mars.Transaction;
}>("UniswapV2Factory", UniswapV2Factory__JSON);

export const UniswapV2Library = Mars.createArtifact<{
  new(): void;
}>("UniswapV2Library", UniswapV2Library__JSON);

export const UniswapV2LiquidityMathLibrary = Mars.createArtifact<{
  new(): void;
}>("UniswapV2LiquidityMathLibrary", UniswapV2LiquidityMathLibrary__JSON);

export const UniswapV2OracleLibrary = Mars.createArtifact<{
  new(): void;
}>("UniswapV2OracleLibrary", UniswapV2OracleLibrary__JSON);

export const UniswapV2Pair = Mars.createArtifact<{
  new(): void;
  DOMAIN_SEPARATOR(): Mars.FutureBytes;
  MINIMUM_LIQUIDITY(): Mars.FutureNumber;
  PERMIT_TYPEHASH(): Mars.FutureBytes;
  allowance(_: Mars.AddressLike, __: Mars.AddressLike): Mars.FutureNumber;
  approve(spender: Mars.AddressLike, value: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  balanceOf(_: Mars.AddressLike): Mars.FutureNumber;
  burn(to: Mars.AddressLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  decimals(): Mars.FutureNumber;
  factory(): Mars.Future<string>;
  getReserves(): Mars.Future<[Mars.FutureNumber, Mars.FutureNumber, Mars.FutureNumber]>;
  initialize(_token0: Mars.AddressLike, _token1: Mars.AddressLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  kLast(): Mars.FutureNumber;
  mint(to: Mars.AddressLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  name(): Mars.Future<string>;
  nonces(_: Mars.AddressLike): Mars.FutureNumber;
  permit(owner: Mars.AddressLike, spender: Mars.AddressLike, value: Mars.NumberLike, deadline: Mars.NumberLike, v: Mars.NumberLike, r: Mars.BytesLike, s: Mars.BytesLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  price0CumulativeLast(): Mars.FutureNumber;
  price1CumulativeLast(): Mars.FutureNumber;
  skim(to: Mars.AddressLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  swap(amount0Out: Mars.NumberLike, amount1Out: Mars.NumberLike, to: Mars.AddressLike, data: Mars.BytesLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  symbol(): Mars.Future<string>;
  sync(options?: Mars.TransactionOverrides): Mars.Transaction;
  token0(): Mars.Future<string>;
  token1(): Mars.Future<string>;
  totalSupply(): Mars.FutureNumber;
  transfer(to: Mars.AddressLike, value: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  transferFrom(from: Mars.AddressLike, to: Mars.AddressLike, value: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
}>("UniswapV2Pair", UniswapV2Pair__JSON);

export const UniswapV2Router02 = Mars.createArtifact<{
  new(_factory: Mars.AddressLike, _WETH: Mars.AddressLike): void;
  WETH(): Mars.Future<string>;
  addLiquidity(tokenA: Mars.AddressLike, tokenB: Mars.AddressLike, amountADesired: Mars.NumberLike, amountBDesired: Mars.NumberLike, amountAMin: Mars.NumberLike, amountBMin: Mars.NumberLike, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  addLiquidityETH(token: Mars.AddressLike, amountTokenDesired: Mars.NumberLike, amountTokenMin: Mars.NumberLike, amountETHMin: Mars.NumberLike, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  factory(): Mars.Future<string>;
  getAmountIn(amountOut: Mars.NumberLike, reserveIn: Mars.NumberLike, reserveOut: Mars.NumberLike): Mars.FutureNumber;
  getAmountOut(amountIn: Mars.NumberLike, reserveIn: Mars.NumberLike, reserveOut: Mars.NumberLike): Mars.FutureNumber;
  getAmountsIn(amountOut: Mars.NumberLike, path: Mars.MaybeFuture<Mars.AddressLike[]>): Mars.Future<Mars.FutureNumber[]>;
  getAmountsOut(amountIn: Mars.NumberLike, path: Mars.MaybeFuture<Mars.AddressLike[]>): Mars.Future<Mars.FutureNumber[]>;
  quote(amountA: Mars.NumberLike, reserveA: Mars.NumberLike, reserveB: Mars.NumberLike): Mars.FutureNumber;
  removeLiquidity(tokenA: Mars.AddressLike, tokenB: Mars.AddressLike, liquidity: Mars.NumberLike, amountAMin: Mars.NumberLike, amountBMin: Mars.NumberLike, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  removeLiquidityETH(token: Mars.AddressLike, liquidity: Mars.NumberLike, amountTokenMin: Mars.NumberLike, amountETHMin: Mars.NumberLike, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  removeLiquidityETHSupportingFeeOnTransferTokens(token: Mars.AddressLike, liquidity: Mars.NumberLike, amountTokenMin: Mars.NumberLike, amountETHMin: Mars.NumberLike, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  removeLiquidityETHWithPermit(token: Mars.AddressLike, liquidity: Mars.NumberLike, amountTokenMin: Mars.NumberLike, amountETHMin: Mars.NumberLike, to: Mars.AddressLike, deadline: Mars.NumberLike, approveMax: Mars.BooleanLike, v: Mars.NumberLike, r: Mars.BytesLike, s: Mars.BytesLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(token: Mars.AddressLike, liquidity: Mars.NumberLike, amountTokenMin: Mars.NumberLike, amountETHMin: Mars.NumberLike, to: Mars.AddressLike, deadline: Mars.NumberLike, approveMax: Mars.BooleanLike, v: Mars.NumberLike, r: Mars.BytesLike, s: Mars.BytesLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  removeLiquidityWithPermit(tokenA: Mars.AddressLike, tokenB: Mars.AddressLike, liquidity: Mars.NumberLike, amountAMin: Mars.NumberLike, amountBMin: Mars.NumberLike, to: Mars.AddressLike, deadline: Mars.NumberLike, approveMax: Mars.BooleanLike, v: Mars.NumberLike, r: Mars.BytesLike, s: Mars.BytesLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  swapETHForExactTokens(amountOut: Mars.NumberLike, path: Mars.MaybeFuture<Mars.AddressLike[]>, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  swapExactETHForTokens(amountOutMin: Mars.NumberLike, path: Mars.MaybeFuture<Mars.AddressLike[]>, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  swapExactETHForTokensSupportingFeeOnTransferTokens(amountOutMin: Mars.NumberLike, path: Mars.MaybeFuture<Mars.AddressLike[]>, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  swapExactTokensForETH(amountIn: Mars.NumberLike, amountOutMin: Mars.NumberLike, path: Mars.MaybeFuture<Mars.AddressLike[]>, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  swapExactTokensForETHSupportingFeeOnTransferTokens(amountIn: Mars.NumberLike, amountOutMin: Mars.NumberLike, path: Mars.MaybeFuture<Mars.AddressLike[]>, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  swapExactTokensForTokens(amountIn: Mars.NumberLike, amountOutMin: Mars.NumberLike, path: Mars.MaybeFuture<Mars.AddressLike[]>, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn: Mars.NumberLike, amountOutMin: Mars.NumberLike, path: Mars.MaybeFuture<Mars.AddressLike[]>, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  swapTokensForExactETH(amountOut: Mars.NumberLike, amountInMax: Mars.NumberLike, path: Mars.MaybeFuture<Mars.AddressLike[]>, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
  swapTokensForExactTokens(amountOut: Mars.NumberLike, amountInMax: Mars.NumberLike, path: Mars.MaybeFuture<Mars.AddressLike[]>, to: Mars.AddressLike, deadline: Mars.NumberLike, options?: Mars.TransactionOverrides): Mars.Transaction;
}>("UniswapV2Router02", UniswapV2Router02__JSON);
