import { IPoolManager, PoolKeyStruct } from "abis/types/PoolManager";
import { InputField } from "components/DynamicFeatureForm/types";
import { isTuple } from "components/DynamicFeatureForm/utils";
import { BigNumber, Contract } from "ethers";
import type {
  Web3Provider,
  TransactionResponse,
} from "@ethersproject/providers";
import { toHex } from "utils/toHex";

const mapValuesToEncodedFormat = (
  stateValues: Record<string, any>,
  fields: InputField[]
): any[] => {
  return fields.map((field) => {
    if (isTuple(field)) {
      const nestedStateValues = stateValues[field.name];
      return mapValuesToEncodedFormat(nestedStateValues, field.fields);
    }
    return stateValues[field.name];
  });
};

const mapInputFieldTypesToAbiTypes = (fields: InputField[]): string[] => {
  return fields.map((field) => {
    if (isTuple(field)) {
      return `(${mapInputFieldTypesToAbiTypes(field.fields).join(",")})`;
    }
    return field.type;
  });
};

interface TransactionResult {
  success: boolean;
  transaction?: TransactionResponse;
  errorMessage?: string;
}

async function sendModifyLiquidityTransaction(
  contract: Contract,
  poolKey: PoolKeyStruct,
  modifyLiquidityParams: IPoolManager.ModifyLiquidityParamsStruct,
  hookData: string,
  provider: Web3Provider
): Promise<TransactionResult> {
  try {
    const data = contract.interface.encodeFunctionData(
      "modifyLiquidity((address,address,uint24,int24,address),(int24,int24,int256),bytes)",
      [poolKey, modifyLiquidityParams, hookData]
    );
    const tx = {
      to: contract.address,
      data,
      value: toHex(0),
      gasLimit: BigNumber.from(500000),
    };

    const response = await provider.getSigner().sendTransaction(tx);
    return { success: true, transaction: response };
  } catch (error) {
    console.error("Failed to send modify liquidity transaction", error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : JSON.stringify(error),
    };
  }
}

async function approveAndSendTransaction(
  provider: Web3Provider,
  contractAddress: string,
  data: string
): Promise<TransactionResponse | undefined> {
  const tx = {
    to: contractAddress,
    data,
    value: toHex(0),
    gasLimit: BigNumber.from(500000),
  };

  try {
    const response = await provider.getSigner().sendTransaction(tx);
    return response;
  } catch (error) {
    console.error("Failed to send transaction", error);
    return undefined;
  }
}

export {
  mapValuesToEncodedFormat,
  mapInputFieldTypesToAbiTypes,
  sendModifyLiquidityTransaction,
  approveAndSendTransaction,
};
