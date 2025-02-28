import dynamic from "next/dynamic";

// Dynamically import the default export
const TokenTransferComponent = dynamic(() => import("../components/TokenTransferComponent"), {
  ssr: false, // Disable server-side rendering
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="container mx-auto p-4">
        <TokenTransferComponent />
      </div>
    </div>
  );
}