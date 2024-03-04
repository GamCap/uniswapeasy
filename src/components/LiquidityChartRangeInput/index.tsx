import { Currency, Price, Token } from "@uniswap/sdk-core";
import { AutoColumn, ColumnCenter } from "../Column";
import Loader from "../Icons/LoadingSpinner";
import { ReactNode, useCallback, useMemo } from "react";
import { Bound } from "../../state/v4/actions";
import styled, { useTheme } from "styled-components";
import formatDelta from "../../utils/formatDelta";

import { Chart } from "./Chart";
import { useDensityChartData } from "./hooks";
import { BigNumberish } from "ethers";
import { ThemedText } from "../../theme/components";

const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
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
  ticksAtLimit,
  price,
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
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  price?: number;
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

  const { isLoading, error, formattedData } = useDensityChartData({
    currencyA,
    currencyB,
    feeAmount,
    tickSpacing,
  });

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      let leftRangeValue = Number(domain[0]);
      const rightRangeValue = Number(domain[1]);

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

  interactive = interactive && Boolean(formattedData?.length);

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const leftPrice = isSorted ? priceLower : priceUpper?.invert();
    const rightPrice = isSorted ? priceUpper : priceLower?.invert();

    return leftPrice && rightPrice
      ? [
          parseFloat(leftPrice?.toSignificant(6)),
          parseFloat(rightPrice?.toSignificant(6)),
        ]
      : undefined;
  }, [isSorted, priceLower, priceUpper]);

  const brushLabelValue = useCallback(
    (d: "w" | "e", x: number) => {
      if (!price) return "";

      if (d === "w" && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER])
        return "0";
      if (d === "e" && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER])
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

  const isUninitialized =
    !currencyA || !currencyB || (formattedData === undefined && !isLoading);
  //TODO
  //Add Icons and get colors from theme
  return (
    <>
      {isUninitialized ? (
        <InfoBox
          message={"Your position will appear here."}
          icon={<div>Inbox</div>}
        />
      ) : isLoading ? (
        <InfoBox icon={<Loader size="40px" stroke={"#fff"} />} />
      ) : error ? (
        <InfoBox
          message={"Liquidity data not available."}
          icon={<div>CloudOff</div>}
        />
      ) : !formattedData || formattedData.length === 0 || !price ? (
        <InfoBox
          message={"There is no liquidity data."}
          icon={<div>BarChart2</div>}
        />
      ) : (
        <ChartWrapper>
          <Chart
            data={{ series: formattedData, current: price }}
            dimensions={{ width: 560, height: 200 }}
            margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
            styles={{
              area: {
                selection: "#44FF9A",
              },
              brush: {
                handle: {
                  west: "#FF8A00",
                  east: "#FF8A00",
                },
              },
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
