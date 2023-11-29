import { connectors, getConnectorName, Web3Connector } from "../connectors";
import { useCallback } from "react";

function Connector({ web3Connector }: { web3Connector: Web3Connector }) {
  const [connector, hooks] = web3Connector;
  const isActive = hooks.useIsActive();
  const onClick = useCallback(() => {
    if (isActive) {
      connector?.deactivate?.();
    } else {
      connectors.forEach(([connector]) => connector?.deactivate?.());
      connector.activate();
    }
  }, [connector, isActive]);

  return (
    <div
      style={{
        padding: "0.5rem 1rem",
        border: "1px solid #c3c5cb",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "flex-end",
        gridAutoFlow: "column",
        alignItems: "center",
        columnGap: "1rem",
      }}
    >
      <label>{getConnectorName(connector)}</label>
      <button onClick={onClick}>{isActive ? "Disconnect" : "Connect"}</button>
      <svg
        style={
          isActive
            ? {
                width: "1rem",
                fill: "green",
              }
            : {
                width: "1rem",
                fill: "red",
              }
        }
        viewBox="0 0 2 2"
      >
        <circle cx={1} cy={1} r={1} />
      </svg>
    </div>
  );
}

export default function Connectors() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        margin: "1rem",
      }}
    >
      {connectors.map((web3Connector, index) => (
        <Connector key={index} web3Connector={web3Connector} />
      ))}
    </div>
  );
}
