import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-7xl flex flex-col gap-12 items-start">{children}</div>
  );
};

export default Layout;
