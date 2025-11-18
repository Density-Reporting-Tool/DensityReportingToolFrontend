import { ReactNode } from "react";
interface LayoutProps {
  children: ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl  pt-[100px]">{children}</div>
    </div>
  );
};

export default Layout;
