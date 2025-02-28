"use client";
import { PumpContractData } from "../components/PumpContractData";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="container mx-auto p-4">        
        <PumpContractData />
      </div>
    </div>
  );
}