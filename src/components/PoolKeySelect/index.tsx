import { styled, useTheme } from "styled-components";
import { PoolKey } from "state/v4/hooks";
import Row, { RowBetween } from "components/Row";
import { ThemedText } from "theme/components";
import { memo, useEffect, useState } from "react";
import Modal from "../Modal";
import Table from "../Table";
import { useCurrencyLogo } from "hooks/useCurrencyLogo";
import { Currency } from "@uniswap/sdk-core";
import { getExplorerLink } from "constants/chains";
import { useWeb3React } from "@web3-react/core";

const NO_HOOK_ADDRESS = "0x0000000000000000000000000000000000000000";

const CurrencyLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.borders.dividerBlank};
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const PoolTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const Badge = styled.a<{ $error?: boolean }>`
  pointer: cursor;
  width: fit-content;
  display: flex;
  flex-direction: row;
  padding: 4px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  gap: 2px;
  background-color: ${({ theme, $error: error }) =>
    error
      ? theme.components.badge.alertBackground
      : theme.components.badge.neutralBackground};
`;

const TitleBadge = styled.span<{ $error?: boolean }>`
  width: fit-content;
  display: flex;
  flex-direction: row;
  padding: 4px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  gap: 2px;
  background-color: ${({ theme, $error: error }) =>
    error
      ? theme.components.badge.alertBackground
      : theme.components.badge.neutralBackground};
`;

const ChangeButton = styled.button`
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 2px;
  border-radius: 1000px;
  border: ${({ theme }) =>
    `1px solid ${theme.components.button.secondary.border}`};
  background: ${({ theme }) => theme.components.button.secondary.background};
  cursor: pointer;
`;

const SelectButton = styled.button`
  display: flex;
  padding: 12px 16px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 1000px;
  background: ${({ theme }) => theme.components.button.primary.background};
`;

const BadgeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const CurrencyPair = styled.span`
  width: 100%;
  pointer: cursor;
  display: inline-flex;
  gap: 8px;
  align-items: center;
`;

const PoolComponent: React.FC<{
  pool: PoolKey;
  currencyIconMap: Record<string, string>;
  onClick: (poolKey: PoolKey) => void;
}> = ({ pool, currencyIconMap, onClick }) => (
  <CurrencyPair
    onClick={() => {
      onClick(pool);
    }}
  >
    <LogoWrapper>
      <CurrencyLogo
        src={useCurrencyLogo(pool?.currency0 ?? "C0", currencyIconMap)}
      />
      <CurrencyLogo
        style={{
          transform: "translateX(-6px)",
        }}
        src={useCurrencyLogo(pool?.currency1 ?? "C1", currencyIconMap)}
      />
    </LogoWrapper>
    <ThemedText.ParagraphExtraSmall textColor="text.primary">
      {pool?.currency0?.symbol} / {pool?.currency1?.symbol}
    </ThemedText.ParagraphExtraSmall>
  </CurrencyPair>
);

const BadgeIcon = styled.svg<{ $error?: boolean }>`
  fill: ${({ theme, $error: error }) =>
    error
      ? theme.components.badge.alertForeground
      : theme.components.badge.neutralForeground};
  color: ${({ theme, $error: error }) =>
    error
      ? theme.components.badge.alertForeground
      : theme.components.badge.neutralForeground};
  text-color: ${({ theme, $error: error }) =>
    error
      ? theme.components.badge.alertForeground
      : theme.components.badge.neutralForeground};
`;

const FeatureComponent: React.FC<{
  feature: { address: string; abbr: string };
}> = ({ feature }) => {
  const { chainId } = useWeb3React();
  return feature.address != NO_HOOK_ADDRESS ? (
    <Badge
      style={{
        padding: "2px 4px",
        gap: "8px",
      }}
      $error={feature.abbr === "Unknown"}
      href={`${getExplorerLink(chainId)}/address/${feature.address}`}
      target="_blank"
      rel="noreferrer"
    >
      <BadgeIcon
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        $error={feature.abbr === "Unknown"}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.95957 2.62493C7.41596 2.3149 7.98314 2.3146 8.39683 2.58628C8.48364 2.64328 8.58393 2.73863 8.92283 3.07754C9.26173 3.41644 9.35708 3.51673 9.41409 3.60354C9.68577 4.01722 9.68547 4.58441 9.37543 5.0408C9.3093 5.13815 9.20242 5.24926 8.85212 5.59955L8.35715 6.09453C8.0968 6.35488 8.0968 6.77699 8.35714 7.03733C8.61749 7.29768 9.0396 7.29768 9.29995 7.03734L9.79493 6.54236L9.84256 6.49476L9.84256 6.49475C10.1249 6.21267 10.3316 6.0061 10.4783 5.79003C11.0761 4.91016 11.1108 3.75825 10.5286 2.87162C10.3862 2.65476 10.1822 2.45098 9.91437 2.18343L9.91436 2.18342L9.86564 2.13473L9.81694 2.086C9.54938 1.81818 9.34561 1.61421 9.12874 1.47179L8.77072 2.01696L9.12874 1.47179C8.24212 0.889518 7.09021 0.924298 6.21033 1.52202C6.10415 1.59415 6.00026 1.68076 5.88857 1.78371M6.95957 2.62493C6.86222 2.69107 6.75111 2.79795 6.40082 3.14825ZM6.40082 3.14825L5.90584 3.64322ZM5.90584 3.64322C5.64549 3.90357 5.22338 3.90357 4.96303 3.64322ZM4.96303 3.64322C4.70268 3.38287 4.70268 2.96076 4.96303 2.70041ZM4.96303 2.70041L5.45801 2.20544ZM5.45801 2.20544L5.50562 2.15781ZM5.50562 2.15781C5.64907 2.01425 5.77299 1.89023 5.88857 1.78371ZM3.6431 4.96316C3.90345 5.2235 3.90345 5.64561 3.6431 5.90596L3.14813 6.40094C2.79783 6.75123 2.69095 6.86234 2.62481 6.95969C2.31478 7.41608 2.31447 7.98327 2.58615 8.39695C2.64316 8.48376 2.73851 8.58405 3.07741 8.92295C3.41632 9.26186 3.51661 9.35721 3.60341 9.41421C4.0171 9.68589 4.58429 9.68559 5.04068 9.37555C5.13803 9.30942 5.24913 9.20254 5.59943 8.85224L6.0944 8.35727C6.35475 8.09692 6.77686 8.09692 7.03721 8.35727C7.29756 8.61762 7.29756 9.03973 7.03721 9.30008L6.54224 9.79505L6.49463 9.84268C6.21255 10.125 6.00598 10.3317 5.78991 10.4785C4.91003 11.0762 3.75813 11.111 2.8715 10.5287C2.65464 10.3863 2.45086 10.1823 2.18331 9.9145L2.13461 9.86576L2.08588 9.81707L2.08586 9.81705C1.81805 9.5495 1.61408 9.34573 1.47167 9.12887C0.889396 8.24224 0.924176 7.09033 1.5219 6.21046C1.66868 5.99439 1.87539 5.78782 2.15768 5.50574L2.20532 5.45813L2.70029 4.96316C2.96064 4.70281 3.38275 4.70281 3.6431 4.96316ZM5.88857 1.78371L8.76279 2.02903ZM7.76826 4.9392C7.96352 4.74394 7.96352 4.42736 7.76826 4.23209C7.573 4.03683 7.25642 4.03683 7.06115 4.23209L4.23273 7.06052C4.03746 7.25578 4.03746 7.57237 4.23273 7.76763C4.42799 7.96289 4.74457 7.96289 4.93983 7.76763L7.76826 4.9392Z"
          fill="currentColor"
        />
      </BadgeIcon>
      <ThemedText.ParagraphExtraSmall
        textColor={
          feature.abbr === "Unknown"
            ? "components.badge.alertForeground"
            : "components.badge.neutralForeground"
        }
      >
        {feature.abbr}
      </ThemedText.ParagraphExtraSmall>
    </Badge>
  ) : (
    <ThemedText.ParagraphExtraSmall textColor="text.tertiary">
      None
    </ThemedText.ParagraphExtraSmall>
  );
};

function PoolKeySelect({
  poolKeys,
  hookAddressToAbbr,
  selectedPoolKey,
  currencyIconMap,
  onSelect,
}: {
  poolKeys?: PoolKey[];
  selectedPoolKey?: PoolKey;
  hookAddressToAbbr?: Record<string, string>;
  currencyIconMap?: Record<string, string>;
  onSelect?: (poolKey: PoolKey) => void;
}) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const unifiedData = poolKeys?.map((poolKey) => ({
    Pool: poolKey,
    Fee: parseFloat(poolKey.fee.toString()) / 10_000 + "%",
    Feature: {
      address: poolKey.hooks,
      abbr: hookAddressToAbbr?.[poolKey.hooks] || "Unknown",
    },
  }));

  const poolFilterMethod = (item: any, searchTerm: string) => {
    const poolText = `${item?.Pool?.currency0?.symbol} / ${item?.Pool?.currency1?.symbol} ${item?.Pool?.currency0?.address} ${item?.Pool?.currency1?.address} ${item?.Pool?.address}`;
    return poolText.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const featureFilterMethod = (item: any, searchTerm: string) => {
    const featureText = item?.Feature?.abbr;
    return featureText.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const columns = [
    { key: "Pool", filterMethod: poolFilterMethod },
    { key: "Fee" },
    { key: "Feature", filterMethod: featureFilterMethod },
  ];

  useEffect(() => {
    console.log("columns", columns);
    console.log("unifiedData", unifiedData);
  }, [columns, unifiedData]);

  return (
    <RowBetween
      $padding="20px 32px"
      style={{
        justifyContent: selectedPoolKey ? "space-between" : "flex-start",
      }}
    >
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Find a pool"
        //breakpoint is min media query width
        breakpoints={[
          {
            breakpoint: "768px",
            width: "600px",
          },
          {
            breakpoint: "1024px",
            width: "1000px",
          },
        ]}
      >
        <Table
          columns={columns}
          data={unifiedData || []}
          pageSize={6}
          renderers={{
            Pool: (poolData) => (
              <PoolComponent
                pool={poolData}
                currencyIconMap={currencyIconMap || {}}
                onClick={(poolKey) => {
                  console.log("onSelect", poolKey);
                  if (onSelect) {
                    onSelect(poolKey);
                  }
                  setIsOpen(false);
                }}
              />
            ),
            Feature: (featureData) => (
              <FeatureComponent feature={featureData} />
            ),
          }}
          searchPlaceholder="Search by token, pool address, or feature"
        />
      </Modal>
      {!selectedPoolKey && (
        <Row $gap="md">
          <SelectButton
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <ThemedText.ParagraphRegular
              textColor="components.button.primary.foreground"
              fontWeight={600}
            >
              Select a pool
            </ThemedText.ParagraphRegular>
          </SelectButton>
          <ThemedText.ParagraphRegular textColor="text.primary">
            to begin
          </ThemedText.ParagraphRegular>
        </Row>
      )}
      {selectedPoolKey && (
        <Row $gap="md">
          <LogoWrapper>
            <CurrencyLogo
              src={useCurrencyLogo(
                selectedPoolKey?.currency0 ?? "C0",
                currencyIconMap ?? {}
              )}
              alt={selectedPoolKey?.currency0?.symbol ?? "C0"}
            />
            <CurrencyLogo
              src={useCurrencyLogo(
                selectedPoolKey?.currency1 ?? "C1",
                currencyIconMap ?? {}
              )}
              alt={selectedPoolKey?.currency1?.symbol ?? "C1"}
              style={{
                transform: "translateX(-6px)",
              }}
            />
          </LogoWrapper>
          <PoolTitle>
            <ThemedText.ParagraphRegular textColor="text.primary">
              {`To ${selectedPoolKey?.currency0.symbol}/${selectedPoolKey?.currency1.symbol} Pool`}
            </ThemedText.ParagraphRegular>
            <BadgeWrapper>
              <TitleBadge>
                <ThemedText.ParagraphExtraSmall textColor="components.badge.neutralForeground">{`${
                  parseFloat(selectedPoolKey?.fee.toString() ?? "3000") / 10_000
                }% fee tier`}</ThemedText.ParagraphExtraSmall>
              </TitleBadge>
              {selectedPoolKey.hooks !== NO_HOOK_ADDRESS &&
                hookAddressToAbbr && (
                  <Badge
                    $error={
                      !hookAddressToAbbr[selectedPoolKey.hooks] ||
                      hookAddressToAbbr[selectedPoolKey.hooks] === "Unknown"
                    }
                    href={`${getExplorerLink(
                      selectedPoolKey.currency0.chainId
                    )}/address/${selectedPoolKey.hooks}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ThemedText.ParagraphExtraSmall textColor="components.badge.neutralForeground">
                      {hookAddressToAbbr[selectedPoolKey.hooks] || "Unknown"}
                    </ThemedText.ParagraphExtraSmall>
                  </Badge>
                )}
              {/* Other Badges */}
            </BadgeWrapper>
          </PoolTitle>
        </Row>
      )}
      {/* Change Button */}
      {selectedPoolKey && (
        <ChangeButton
          disabled={false}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{
              pointerEvents: "none",
            }}
          >
            <path
              d="M11.2001 2.1333L13.8667 4.79997M13.8667 4.79997L11.2001 7.46663M13.8667 4.79997H2.1333"
              stroke={theme.components.icon.icon}
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.1333 11.2001L4.79997 8.53345M2.1333 11.2001L4.79997 13.8668M2.1333 11.2001H13.8666"
              stroke={theme.components.icon.icon}
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <ThemedText.ParagraphExtraSmall textColor="components.button.secondary.foreground">
            Change
          </ThemedText.ParagraphExtraSmall>
        </ChangeButton>
      )}
    </RowBetween>
  );
}

export default memo(PoolKeySelect);
