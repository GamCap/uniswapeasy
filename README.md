
# UniswapEasy

UniswapEasy is a React widget designed to simplify liquidity management on the Uniswap V4 protocol. This version has been updated to include more customization options and supports the Ethereum Sepolia chain for testing purposes.

# Table of Contents
- [UniswapEasy](#uniswapeasy)
    - [Installation](#installation)
    - [Building from Source](#building-from-source)
    - [Usage](#usage)
        - [Theme Customization](#theme-customization)
        - [PoolInfo and PoolKey](#poolinfo-and-poolkey)
            - [PoolInfo Definition](#poolinfo-definition)
        - [HookInfo and InputField](#hookinfo-and-inputfield)
            - [HookInfo Definition](#hookinfo-definition)
        - [CurrencyIconMap](#currencyiconmap)
            - [CurrencyIconMap Definition](#currencyiconmap-definition)
        - [Handling Complex Cases with Custom Inputs](#handling-complex-cases-with-custom-inputs)
            - [Using overrideInputFields and hookData](#using-overrideinputfields-and-hookdata)
            - [Integrating Custom Interfaces](#integrating-custom-interfaces)
    - [Contracts and Supported Chains](#contracts-and-supported-chains)
    - [Additional Resources](#additional-resources)
    - [License](#license)


## Installation

```bash
npm install @gamcaplabs/uniswapeasy
# or
yarn add @gamcaplabs/uniswapeasy
```

## Building from Source

Before building, ensure you have all peer dependencies installed:

- react
- react-dom
- react-redux
- redux
- redux-persist
- styled-components
- ethers

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
6. Generate a gzip archive of the package for local development:
  ```bash
  yarn pack
  ```

## Usage

Import `UniswapEasy` from the package and use it in your React application with the following props for extensive customization:

```jsx
import {UniswapEasy, defaultTheme} from '@gamcaplabs/uniswapeasy';

<UniswapEasy
  theme={defaultTheme}
  defaultChainId={1}
  provider={provider}
  poolInfos={poolKeys}
  hookInfos={hookInfos}
  onPoolSelect={onPoolSelect}
  currencyIconMap={currencyIconMap}
  hookData={hookData}
/>
```

### Theme Customization

Customize the theme using the following interface, which allows for detailed adjustments to colors, fonts, and layout specifics:

```typescript
import {type Theme, type Colors, defaultTheme, orangeDark } // other preset themes are orangeLight, tealDark,and tealLight.

// Example custom colors:
const myColors : Colors = {
  ...orangeDark,
  text: {
    ...orangeDark.text,
    primary: "#d9d9d9"
  }
}

const myTheme : Theme = {
  ...defaultTheme,
  ...myColors
  // You can also add other custom attributes like font family
}

```

### PoolInfo and PoolKey

The `PoolInfo` object is essential for configuring liquidity pools. Each `PoolInfo` specifies the blockchain network with `chainId` and contains a `poolKey` detailing specific pool parameters.

#### PoolInfo Definition

```typescript
type PoolKey = {
  currency0: Currency;  // First currency in the liquidity pool
  currency1: Currency;  // Second currency in the liquidity pool
  fee: BigNumberish;    // Fee associated with the pool
  tickSpacing: BigNumberish; // The minimum price movement between ticks
  hooks: string;        // Address of any additional hooks used with the pool
};

export type PoolInfo = {
  chainId: number;      // Blockchain network ID
  poolKey: PoolKey;     // Specific pool parameters
};

// Example of PoolInfo
const poolInfos: PoolInfo[] = [{
  chainId: 1, // Ethereum mainnet
  poolKey: {
    currency0: new Token(1, '0x...', 18, 'ETH'),
    currency1: new Token(1, '0x...', 6, 'USDC'),
    fee: 3000,
    tickSpacing: 60,
    hooks: '0x0000000000000000000000000000000000000000'
  }
}];
```

### HookInfo and InputField

`HookInfo` defines hooks available within the liquidity pool, providing metadata and the required inputs.

#### HookInfo Definition

```typescript
export type HookInfo = {
  address: string;              // Smart contract address of the hook
  name: string;                 // Display name of the hook
  abbr: string;                 // Abbreviation of the hook name
  desc: string;                 // Description of the hook's functionality
  inputFields: InputField[];    // Array of input fields for the hook
  overrideInputFields?: boolean; // Flag to override default input fields
};

interface InputRestrictions {
  min?: string;                // Minimum value for the input
  max?: string;                // Maximum value for the input
  pattern?: string;            // Regular expression for validating the input
  required?: boolean;          // Whether the input is required
};

interface BaseProps {
  name: string;
  description?: string;
}

interface BaseInputField extends BaseProps {
  type: string;                // Data type of the input field
  defaultValue?: string;       // Default value for the input field
  restrictions?: InputRestrictions; // Restrictions for the input field
};

interface Tuple extends BaseProps {
  fields: InputField[];        // Fields in case the input is a tuple
};

type InputField = BaseInputField | Tuple;

// Example of HookInfo
const hookInfos: HookInfo[] = [{
  address: '0x...',
  name: 'Example Hook',
  abbr: 'ExHook',
  desc: 'This hook does XYZ',
  inputFields: [{
    name: 'Sender',
    type: 'address',
    restrictions: { required: true }
  }, {
    name: 'Value',
    type: 'uint256',
    restrictions: { min: '1', max: '1000', required: true }
  }]
}];
```

### CurrencyIconMap

Maps currency symbols to image URLs or base64 encoded images for enhancing user interface.

#### CurrencyIconMap Definition

```typescript
const currencyIconMap: Record<string, string> = {
  'ETH': 'data:image/png;base64,...', // Base64 encoded image of Ethereum
  'USDC': 'https://example.com/usdc.png' // URL to an image of USDC
};
```

### Handling Complex Cases with Custom Inputs

For scenarios where the widget's dynamic input field generation does not meet specific requirements, or if you need to handle complex data types that the widget cannot automatically encode, you can utilize the `overrideInputFields` and `hookData` properties.

#### Using `overrideInputFields` and `hookData`

When a hook requires complex data handling, set `overrideInputFields` to `true` to disable the widget's automatic input field generation. This allows you to implement a custom interface to collect and encode data according to the hook's needs.

```typescript
// Example showing how to set overrideInputFields
const hookInfos: HookInfo[] = [{
  address: '0x...',
  name: 'Complex Data Hook',
  abbr: 'CDH',
  desc: 'A hook requiring complex data input',
  inputFields: [], // Normally filled, now empty due to override
  overrideInputFields: true
}];
```

#### Integrating Custom Interfaces

Use the `onPoolSelect` callback to detect when a user selects a pool. This callback provides the selected `poolKey`, enabling you to display the appropriate custom interface for data input.

```typescript
// Example of using onPoolSelect to handle complex cases
<UniswapEasy
  theme={defaultTheme}
  defaultChainId={1}
  provider={provider}
  poolInfos={poolInfos}
  hookInfos={hookInfos}
  onPoolSelect={(poolKey) => {
    console.log('Selected pool:', poolKey);
    // Logic to display custom interface for hook data input goes here}
  }
  currencyIconMap={currencyIconMap}
  hookData={hookData} // Encoded data provided by the user's custom interface
/>
```


## Contracts and Supported Chains

Currently, the UniswapEasy widget is only supported on the Ethereum Sepolia test network. The addresses for pool management and liquidity modification contracts are:

- **PoolManager Contract**: `0xf7a031A182aFB3061881156df520FE7912A51617`
- **PoolModifyLiquidity Contract**: `0x140C64C63c52cE05138E21564b72b0B2Dff9B67f`

## Additional Resources

Below are links to the smart contracts on the Ethereum Sepolia testnet and other resources used by this widget:

- [Etherscan link for Pool Manager](https://sepolia.etherscan.io/address/0xf7a031A182aFB3061881156df520FE7912A51617)
- [Etherscan link for Pool Modify Liquidity](https://sepolia.etherscan.io/address/0x140C64C63c52cE05138E21564b72b0B2Dff9B67f)

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
