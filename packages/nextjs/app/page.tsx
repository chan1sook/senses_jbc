"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { FolderIcon, TvIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">SensesIoT JBC</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-y-4 flex-col">
            <Link href="/dashboard/new">
              <button className="btn btn-primary rounded-md min-w-36 flex flex-row gap-3 items-center">
                <TvIcon className="w-8 h-8" /> <span>New Dashboard</span>
              </button>
            </Link>
            <div>OR</div>
            <Link href="/browse">
              <button className="btn btn-accent rounded-md min-w-36 flex flex-row gap-3 items-center">
                <FolderIcon className="w-8 h-8" />
                <span>Browse Dashboard</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
