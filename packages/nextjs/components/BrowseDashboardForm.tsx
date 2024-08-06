import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddressInput, IntegerInput } from "./scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const BrowseDashboardForm = () => {
  const router = useRouter();

  const { address: connectedAddress } = useAccount();
  const { data: dashboardLength } = useScaffoldReadContract({
    contractName: "SensesJBCDashboard",
    functionName: "dashboardLength",
    args: [connectedAddress],
  });

  const [addressUpdated, setAddressUpdated] = useState(false);
  const [address, setAddress] = useState(connectedAddress || "");
  const [slot, setSlot] = useState("0");

  const slotBigInt = BigInt(slot);
  const isSlotNonExists =
    slotBigInt < BigInt(0) || (typeof dashboardLength === "bigint" && slotBigInt >= dashboardLength);

  useEffect(() => {
    const id = setInterval(() => {
      if (!addressUpdated && typeof connectedAddress === "string") {
        if (!address) {
          setAddress(connectedAddress);
        }
        setAddressUpdated(true);
      }
    }, 50);
    return () => clearInterval(id);
  }, [addressUpdated, address, connectedAddress]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <div className="flex-[3]">
          <AddressInput placeholder="Address" value={address} onChange={setAddress}></AddressInput>
        </div>
        <div className="flex-1 flex flex-row gap-2 items-center">
          <span>#</span>
          <div className="flex-1">
            <IntegerInput
              placeholder="Slot"
              value={slot}
              onChange={v => setSlot(`${v}`)}
              disableMultiplyBy1e18
            ></IntegerInput>
          </div>
        </div>
      </div>
      <button
        className="mt-4 btn btn-primary rounded-md min-w-36"
        disabled={!address || isSlotNonExists}
        onClick={() => router.push(`/dashboard/${address}/${slot.toString()}`)}
      >
        {isSlotNonExists ? "Not Exists" : "Browse"}
      </button>
    </div>
  );
};
