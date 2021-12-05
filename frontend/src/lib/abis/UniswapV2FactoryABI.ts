export const UniswapV2FactoryABI = [
    'constructor(address _feeToSetter)',
    'event PairCreated(address indexed token0, address indexed token1, address pair, uint256)',
    'function INIT_CODE_PAIR_HASH() view returns (bytes32)',
    'function allPairs(uint256) view returns (address)',
    'function allPairsLength() view returns (uint256)',
    'function createPair(address tokenA, address tokenB) returns (address pair)',
    'function feeTo() view returns (address)',
    'function feeToSetter() view returns (address)',
    'function getPair(address, address) view returns (address)',
    'function setFeeTo(address _feeTo)',
    'function setFeeToSetter(address _feeToSetter)'
]