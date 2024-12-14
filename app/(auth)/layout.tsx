import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return <div className="container mx-auto py-6 space-y-6">{children}</div>;
};

export default Layout;
