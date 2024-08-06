"use client";

import type { NextPage } from "next";
import { getAddress, isAddress } from "viem";
import { DashboardSubpage } from "~~/components/senses-dashboard/DashboardSubpage";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

type PageProps = {
  params: { id: string; address: string };
};

const ErrorContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center flex-col flex-grow p-4 justify-center">
      <div className="bg-secondary px-8 py-4 rounded border-2 shadow text-lg">{children}</div>
    </div>
  );
};

const DashboardPage: NextPage<PageProps> = ({ params: { address, id } }: PageProps) => {
  const connectedAddress = isAddress(address) ? getAddress(address) : undefined;

  const { data: dashboardLength } = useScaffoldReadContract({
    contractName: "SensesJBCDashboard",
    functionName: "dashboardLength",
    args: [connectedAddress],
  });

  try {
    const dashboardId = BigInt(id);

    if (typeof connectedAddress === "string" && typeof dashboardLength === "bigint") {
      if (dashboardId < dashboardLength) {
        return <DashboardSubpage address={connectedAddress} id={dashboardId}></DashboardSubpage>;
      } else {
        return (
          <ErrorContainer>
            <span>{"Can't Load Dashboard"}</span>
          </ErrorContainer>
        );
      }
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
  } catch (err) {
    return (
      <ErrorContainer>
        <span>Invalid Dashboard ID</span>
      </ErrorContainer>
    );
  }
};

export default DashboardPage;
