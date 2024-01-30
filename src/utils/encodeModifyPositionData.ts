
import { BigNumberish, Contract } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
//modifyPosition((address,address,uint24,int24,address),(int24,int24,int256),bytes)": FunctionFragment;
// (currency0 currency1 fee tickspacing hookAddress), (tickLower tickUpper  liquidityDelta), hookData)
// return 3 values [bytes, bytes, bytes]

function encodeModifyPositionData(
  currency0: string,
  currency1: string,
  fee: BigNumberish,
  tickSpacing: BigNumberish,
  hookAddress: string,
  tickLower: number,
  tickUpper: number,
  liquidityDelta: BigNumberish,
  hookData: string
): [string,string,string] {
    //tuple (address,address,uint24,int24,address)
  const poolKey = defaultAbiCoder.encode(
    ['tuple(address,address,uint24,int24,address)'],
    [[currency0, currency1, fee, tickSpacing, hookAddress]]
  );
    //tuple (int24,int24,int256)
  const tickRange = defaultAbiCoder.encode(
    ['tuple(int24,int24,int256)'],
    [[tickLower, tickUpper, liquidityDelta]]
  );
  const hookInput = defaultAbiCoder.encode(["bytes"], [hookData]);
  return [poolKey, tickRange, hookInput];
}

export default encodeModifyPositionData;