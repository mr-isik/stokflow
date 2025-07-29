"use client";

import { HeroUIProvider } from "@heroui/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return <HeroUIProvider>{children}</HeroUIProvider>;
};

export default Providers;
