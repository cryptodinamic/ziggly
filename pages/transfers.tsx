// pages/transfers.tsx
import dynamic from "next/dynamic";
import { ComponentType } from "react";

const TokenTransferComponent = dynamic<ComponentType<{}>>(
  () => import("../components/TokenTransferComponent").then((mod) => mod.TokenTransferComponent),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="container mx-auto p-4">
        <h1 className="text-white text-3xl mb-6 text-center">Transferir Tokens Supra</h1>
        <TokenTransferComponent />
      </div>
    </div>
  );
}