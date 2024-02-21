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

- Clone the repository:
  ```bash
  git clone https://github.com/GamCap/uniswapeasy.git
  ```
- Navigate to the project directory:
  ```bash
  cd uniswapeasy
  ```
- Install dependencies:
  ```bash
  yarn install
  ```
- Run the prebuild script which includes ABI type generation:
  ```bash
  yarn prebuild
  ```
- Build the package:
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

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
