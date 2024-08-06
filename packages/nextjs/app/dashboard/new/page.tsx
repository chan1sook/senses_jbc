"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { DashboardSubpage } from "~~/components/senses-dashboard/DashboardSubpage";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const ErrorContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center flex-col flex-grow p-4 justify-center">
      <div className="bg-secondary px-8 py-4 rounded border-2 shadow text-lg">{children}</div>
    </div>
  );
};

const DashboardPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: dashboardLength } = useScaffoldReadContract({
    contractName: "SensesJBCDashboard",
    functionName: "dashboardLength",
    args: [connectedAddress],
  });

  if (typeof connectedAddress === "string" && typeof dashboardLength === "bigint") {
    return <DashboardSubpage address={connectedAddress} id={dashboardLength} isNew></DashboardSubpage>;
  } else if (typeof connectedAddress === "string") {
    return (
      <ErrorContainer>
        <div className="flex flex-row gap-x-4 items-center">
          <span className="loading loading-spinner loading-md"></span>
          <span>Loading...</span>
        </div>
      </ErrorContainer>
    );
  } else {
    return (
      <ErrorContainer>
        <span>Please connect Wallet</span>
      </ErrorContainer>
    );
  }
};

export default DashboardPage;
