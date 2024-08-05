import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Dashboard",
  description: "Dashboard",
});

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default DashboardLayout;
