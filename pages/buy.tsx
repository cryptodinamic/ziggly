// app/page.tsx
"use client";
import { BuyZigglyButton } from "../components/BuyZigglyButton";

export default function Home() {
  return (

      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="container mx-auto p-4">
          <h1 className="text-white text-3xl mb-6 text-center">Buy Ziggly Tokens</h1>
          <BuyZigglyButton />
        </div>
      </div>

  );
}