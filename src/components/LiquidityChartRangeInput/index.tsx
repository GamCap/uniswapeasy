import { Currency, Price, Token } from "@uniswap/sdk-core";
import Column, { AutoColumn, ColumnCenter } from "../Column";
import Loader from "../Icons/LoadingSpinner";
import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { Bound } from "../../state/v4/actions";
import styled, { useTheme } from "styled-components";
import formatDelta from "../../utils/formatDelta";

import { Chart } from "./Chart";
import { usePriceHistoryEntry, useTickDataEntry } from "./hooks";
import { BigNumberish } from "ethers";
import { BoxSecondary, ThemedText } from "../../theme/components";

const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-content: center;
`;

function InfoBox({ message, icon }: { message?: ReactNode; icon: ReactNode }) {
  return (
    <ColumnCenter style={{ height: "100%", justifyContent: "center" }}>
      {icon}
      {message && (
        <ThemedText.MediumHeader
          textColor="text.primary"
          padding={10}
          marginTop="20px"
          textAlign="center"
        >
          {message}
        </ThemedText.MediumHeader>
      )}
    </ColumnCenter>
  );
}

export default function LiquidityChartRangeInput({
  currencyA,
  currencyB,
  feeAmount,
  tickSpacing,
  hooks,
  ticksAtLimit,
  price,
  formattedPrice,
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  interactive,
}: {
  currencyA?: Currency;
  currencyB?: Currency;
  feeAmount?: BigNumberish;
  tickSpacing?: BigNumberish;
  hooks?: string;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  price?: number;
  formattedPrice?: string;
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  interactive: boolean;
}) {
  const theme = useTheme();

  // TODO: use token colors
  // const tokenAColor = useColor(currencyA);
  // const tokenBColor = useColor(currencyB);

  const isSorted =
    currencyA &&
    currencyB &&
    currencyA?.wrapped.sortsBefore(currencyB?.wrapped);

  const {
    isLoading: isTickDataLoading,
    error: tickDataError,
    formattedData: formattedTickData,
  } = useTickDataEntry({
    currencyA,
    currencyB,
    feeAmount,
    tickSpacing,
    hooks,
  });

  const {
    isLoading: isPriceDataLoading,
    error: priceDataError,
    formattedData: formattedPriceData,
  } = usePriceHistoryEntry({
    currencyA,
    currencyB,
    feeAmount,
    tickSpacing,
    hooks,
    currentPrice: price,
  });

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      let leftRangeValue = Number(domain[1]);
      const rightRangeValue = Number(domain[0]);
      console.log("leftRangeValue", leftRangeValue);
      console.log("rightRangeValue", rightRangeValue);
      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6;
      }

      // simulate user input for auto-formatting and other validations
      if (
        (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ||
          mode === "handle" ||
          mode === "reset") &&
        leftRangeValue > 0
      ) {
        onLeftRangeInput(leftRangeValue.toFixed(6));
      }

      if (
        (!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ||
          mode === "reset") &&
        rightRangeValue > 0
      ) {
        // todo: remove this check. Upper bound for large numbers
        // sometimes fails to parse to tick.
        if (rightRangeValue < 1e35) {
          onRightRangeInput(rightRangeValue.toFixed(6));
        }
      }
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit]
  );

  interactive = interactive && Boolean(formattedTickData?.length);

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const leftPrice = isSorted ? priceLower : priceUpper?.invert();
    const rightPrice = isSorted ? priceUpper : priceLower?.invert();

    return leftPrice && rightPrice
      ? [
          parseFloat(rightPrice?.toSignificant(6)),
          parseFloat(leftPrice?.toSignificant(6)),
        ]
      : undefined;
  }, [isSorted, priceLower, priceUpper]);

  const brushLabelValue = useCallback(
    (d: "s" | "n", x: number) => {
      if (!price) return "";

      if (d === "s" && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER])
        return "0";
      if (d === "n" && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER])
        return "∞";

      const percent =
        (x < price ? -1 : 1) *
        ((Math.max(x, price) - Math.min(x, price)) / price) *
        100;

      return price
        ? `${(Math.sign(percent) < 0 ? "-" : "") + formatDelta(percent)}`
        : "";
    },
    [formatDelta, isSorted, price, ticksAtLimit]
  );

  const isUninitialized = useMemo(
    () =>
      !currencyA ||
      !currencyB ||
      (formattedTickData === undefined && !isTickDataLoading),
    [currencyA, currencyB, formattedTickData, isTickDataLoading]
  );

  //TODO
  //Add Icons and get colors from theme
  return (
    <>
      {isUninitialized ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "0 24px",
            boxSizing: "border-box",
            height: "fit-content",
          }}
        >
          <BoxSecondary $radius="8px" $padding="12px">
            <Column
              style={{
                alignItems: "flex-start",
                width: "fit-content",
                gap: "8px",
              }}
            >
              <ThemedText.SubHeader textColor="text.tertiary">
                Current Price
              </ThemedText.SubHeader>
              <ThemedText.SmallText textColor="text.primary">
                {formattedPrice}
              </ThemedText.SmallText>
            </Column>
          </BoxSecondary>
        </div>
      ) : isTickDataLoading ? (
        <InfoBox icon={<Loader size="40px" stroke={"#fff"} />} />
      ) : tickDataError ? (
        <InfoBox
          message={"Liquidity data not available."}
          icon={<div>CloudOff</div>}
        />
      ) : !formattedTickData || formattedTickData.length === 0 || !price ? (
        <InfoBox
          message={"There is no liquidity data."}
          icon={<div>BarChart2</div>}
        />
      ) : (
        <ChartWrapper>
          <Chart
            data={{
              tickData: formattedTickData.reverse(),
              //TODO: remove this hardcoded data
              priceHistory: formattedPriceData ?? [],
              current: price,
            }}
            dimensions={{ width: 668, height: 170 }}
            margins={{ top: 0, right: 90, bottom: 40, left: 0 }}
            styles={{
              area: {
                selection: theme.components.graph.main,
              },
              brush: {
                handle: {
                  east: "#FAB01D",
                  west: "#627EEA",
                },
              },
              divider: theme.borders.dividers,
            }}
            interactive={interactive}
            brushLabels={brushLabelValue}
            brushDomain={brushDomain}
            onBrushDomainChange={onBrushDomainChangeEnded}
            zoomLevels={{
              initialMin: 0.5,
              initialMax: 2,
              min: 0.00001,
              max: 20,
            }} // TODO: change this depending on fee amount
            ticksAtLimit={ticksAtLimit}
          />
        </ChartWrapper>
      )}
    </>
  );
}
