import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Browse Dashboard",
  description: "Browse Dashboard",
});

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default BrowseLayout;
