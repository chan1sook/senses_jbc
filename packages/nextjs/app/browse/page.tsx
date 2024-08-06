"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BrowseDashboardForm } from "~~/components/BrowseDashboardForm";
import { Address } from "~~/components/scaffold-eth";

const BrowsePage: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex-grow bg-base-300 w-full px-8 py-12 flex justify-center items-center">
        <div className="flex-1 w-full max-w-screen-sm">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Browse Dashboard</span>
          </h1>
          <div className="flex justify-center mb-12 items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <BrowseDashboardForm />
        </div>
      </div>
    </>
  );
};

export default BrowsePage;
