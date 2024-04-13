"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react"; // react element for children types

const queryClient = new QueryClient();

const Providers = ({ children }: PropsWithChildren<{}>) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;
