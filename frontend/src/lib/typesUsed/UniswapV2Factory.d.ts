/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface UniswapV2FactoryInterface extends ethers.utils.Interface {
  functions: {
    "INIT_CODE_PAIR_HASH()": FunctionFragment;
    "allPairs(uint256)": FunctionFragment;
    "allPairsLength()": FunctionFragment;
    "createPair(address,address)": FunctionFragment;
    "feeTo()": FunctionFragment;
    "feeToSetter()": FunctionFragment;
    "getPair(address,address)": FunctionFragment;
    "setFeeTo(address)": FunctionFragment;
    "setFeeToSetter(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "INIT_CODE_PAIR_HASH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "allPairs",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "allPairsLength",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createPair",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "feeTo", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "feeToSetter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPair",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "setFeeTo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setFeeToSetter",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "INIT_CODE_PAIR_HASH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "allPairs", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "allPairsLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "createPair", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "feeToSetter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPair", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setFeeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setFeeToSetter",
    data: BytesLike
  ): Result;

  events: {
    "PairCreated(address,address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "PairCreated"): EventFragment;
}

export class UniswapV2Factory extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: UniswapV2FactoryInterface;

  functions: {
    INIT_CODE_PAIR_HASH(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    "INIT_CODE_PAIR_HASH()"(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    allPairs(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "allPairs(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    allPairsLength(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "allPairsLength()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    createPair(
      tokenA: string,
      tokenB: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "createPair(address,address)"(
      tokenA: string,
      tokenB: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    feeTo(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    "feeTo()"(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    feeToSetter(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    "feeToSetter()"(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    getPair(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "getPair(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    setFeeTo(
      _feeTo: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setFeeTo(address)"(
      _feeTo: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setFeeToSetter(
      _feeToSetter: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setFeeToSetter(address)"(
      _feeToSetter: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  INIT_CODE_PAIR_HASH(overrides?: CallOverrides): Promise<string>;

  "INIT_CODE_PAIR_HASH()"(overrides?: CallOverrides): Promise<string>;

  allPairs(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  "allPairs(uint256)"(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  allPairsLength(overrides?: CallOverrides): Promise<BigNumber>;

  "allPairsLength()"(overrides?: CallOverrides): Promise<BigNumber>;

  createPair(
    tokenA: string,
    tokenB: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "createPair(address,address)"(
    tokenA: string,
    tokenB: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  feeTo(overrides?: CallOverrides): Promise<string>;

  "feeTo()"(overrides?: CallOverrides): Promise<string>;

  feeToSetter(overrides?: CallOverrides): Promise<string>;

  "feeToSetter()"(overrides?: CallOverrides): Promise<string>;

  getPair(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<string>;

  "getPair(address,address)"(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<string>;

  setFeeTo(_feeTo: string, overrides?: Overrides): Promise<ContractTransaction>;

  "setFeeTo(address)"(
    _feeTo: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setFeeToSetter(
    _feeToSetter: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setFeeToSetter(address)"(
    _feeToSetter: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    INIT_CODE_PAIR_HASH(overrides?: CallOverrides): Promise<string>;

    "INIT_CODE_PAIR_HASH()"(overrides?: CallOverrides): Promise<string>;

    allPairs(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    "allPairs(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    allPairsLength(overrides?: CallOverrides): Promise<BigNumber>;

    "allPairsLength()"(overrides?: CallOverrides): Promise<BigNumber>;

    createPair(
      tokenA: string,
      tokenB: string,
      overrides?: CallOverrides
    ): Promise<string>;

    "createPair(address,address)"(
      tokenA: string,
      tokenB: string,
      overrides?: CallOverrides
    ): Promise<string>;

    feeTo(overrides?: CallOverrides): Promise<string>;

    "feeTo()"(overrides?: CallOverrides): Promise<string>;

    feeToSetter(overrides?: CallOverrides): Promise<string>;

    "feeToSetter()"(overrides?: CallOverrides): Promise<string>;

    getPair(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<string>;

    "getPair(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<string>;

    setFeeTo(_feeTo: string, overrides?: CallOverrides): Promise<void>;

    "setFeeTo(address)"(
      _feeTo: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setFeeToSetter(
      _feeToSetter: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "setFeeToSetter(address)"(
      _feeToSetter: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    PairCreated(
      token0: string | null,
      token1: string | null,
      pair: null,
      undefined: null
    ): EventFilter;
  };

  estimateGas: {
    INIT_CODE_PAIR_HASH(overrides?: CallOverrides): Promise<BigNumber>;

    "INIT_CODE_PAIR_HASH()"(overrides?: CallOverrides): Promise<BigNumber>;

    allPairs(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "allPairs(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    allPairsLength(overrides?: CallOverrides): Promise<BigNumber>;

    "allPairsLength()"(overrides?: CallOverrides): Promise<BigNumber>;

    createPair(
      tokenA: string,
      tokenB: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "createPair(address,address)"(
      tokenA: string,
      tokenB: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    feeTo(overrides?: CallOverrides): Promise<BigNumber>;

    "feeTo()"(overrides?: CallOverrides): Promise<BigNumber>;

    feeToSetter(overrides?: CallOverrides): Promise<BigNumber>;

    "feeToSetter()"(overrides?: CallOverrides): Promise<BigNumber>;

    getPair(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getPair(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setFeeTo(_feeTo: string, overrides?: Overrides): Promise<BigNumber>;

    "setFeeTo(address)"(
      _feeTo: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setFeeToSetter(
      _feeToSetter: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setFeeToSetter(address)"(
      _feeToSetter: string,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    INIT_CODE_PAIR_HASH(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "INIT_CODE_PAIR_HASH()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    allPairs(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "allPairs(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    allPairsLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "allPairsLength()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createPair(
      tokenA: string,
      tokenB: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "createPair(address,address)"(
      tokenA: string,
      tokenB: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    feeTo(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "feeTo()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    feeToSetter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "feeToSetter()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPair(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getPair(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setFeeTo(
      _feeTo: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setFeeTo(address)"(
      _feeTo: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setFeeToSetter(
      _feeToSetter: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setFeeToSetter(address)"(
      _feeToSetter: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
