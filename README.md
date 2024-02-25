# UniswapEasy

UniswapEasy is a React widget for providing liquidity to Uniswap V4. This package is designed for easy integration of Uniswap liquidity management into React applications.

## Installation

```bash
npm install uniswapeasy
# or
yarn add uniswapeasy
```

## Building from Source

Before building, ensure you have all peer dependencies installed. Your project should have `react`, `react-dom`, `react-redux`, `redux`, `redux-persist`, `styled-components`, and `ethers` as they are listed as peer dependencies.

To build the package from source:

1. Clone the repository:
   ```bash
   git clone https://github.com/GamCap/uniswapeasy.git
   ```
2. Navigate to the project directory:
   ```bash
   cd uniswapeasy
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Run the prebuild script which includes ABI type generation:
   ```bash
   yarn prebuild
   ```
5. Build the package:
   ```bash
   yarn build
   ```
   The build artifacts will be outputted to the `dist` directory.

## Usage

Import `UniswapEasy` from the package and use it in your React application. Note that the package is currently hard-coded to work on the Goerli testnet, which means contract addresses are pre-set for that network.

## Customization

To customize the pool via the poolKeys input, pass an array of pool configurations to the UniswapEasy component. Only the first pool is displayed as pool selection has not been implemented yet.

```jsx
<UniswapEasy
  // ...other props
  poolKeys={[{
    currency0: new Token(/* ... */),
    currency1: new Token(/* ... */),
    fee: /* ... */,
    tickSpacing: /* ... */,
    hooks: /* ... */,
  }]}
/>
```

## Additional Resources

Below are links to the smart contracts on the Goerli testnet and other resources that are used by this widget:

- **PoolModifyPositionTest Contract**: [View on Etherscan](https://goerli.etherscan.io/address/0x83feDBeD11B3667f40263a88e8435fca51A03F8C#code)
- **PoolManager Contract**: [View on Etherscan](https://goerli.etherscan.io/address/0x3A9D48AB9751398BbFa63ad67599Bb04e4BdF98b#code)
- **Example Pool ID**: `0x81c2aeb9580f893f1bd130ea78633f476604312c9122e3d3988a8dd72e3494dd`
- **UNI Token Contract**: [View on Etherscan](https://goerli.etherscan.io/address/0x981d8acaf6af3a46785e7741d22fbe81b25ebf1e)
- **USDC Token Contract**: [View on Etherscan](https://goerli.etherscan.io/token/0x9fd21be27a2b059a288229361e2fa632d8d2d074)
- **Aave Faucet**: [Access the Faucet](https://staging.aave.com/faucet/)

These resources are essential for developers looking to understand the underlying contracts and for testing purposes using the Goerli testnet.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
