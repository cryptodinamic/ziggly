// components/PumpContractData.tsx
"use client";

import { useState, useEffect } from "react";

interface ConfigData {
  fee_wallet: string;
  decimals: number;
  supply: string;
  locked_percentage: string;
  virtual_aptos_reserves: string;
  fee: number;
  graduate_fee: string;
  create_fee: string;
  creator_fee: number;
}

interface PoolData {
  real_aptos_reserves: string;
  real_token_reserves: string;
  virtual_aptos_reserves: string;
  virtual_token_reserves: string;
  remain_token_reserves: string;
  is_completed: boolean;
}

export const PumpContractData = () => {
  const [configData, setConfigData] = useState<ConfigData | null>(null);
  const [poolData, setPoolData] = useState<PoolData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const response = await fetch("/api/pump-data");
        if (!response.ok) throw new Error("Failed to fetch data");
        const { configData, poolData } = await response.json();
        setConfigData(configData);
        setPoolData(poolData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch contract data: " + (err as Error).message);
        setLoading(false);
      }
    };

    fetchContractData();
  }, []);

  if (loading) return <div className="text-center mt-10 text-white">Loading contract data...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
      <h1 className="text-2xl font-bold mb-5 text-center">Pump Contract Data (Supra Network)</h1>

      <section>
        <h2 className="text-xl font-semibold mt-5">Config</h2>
        {configData && (
          <ul className="list-none">
            <li className="my-2">Fee Wallet: {configData.fee_wallet}</li>
            <li className="my-2">Decimals: {configData.decimals}</li>
            <li className="my-2">Supply: {configData.supply}</li>
            <li className="my-2">Locked Percentage: {configData.locked_percentage}</li>
            <li className="my-2">Virtual Reserves: {configData.virtual_aptos_reserves}</li>
            <li className="my-2">Fee: {configData.fee}</li>
            <li className="my-2">Graduate Fee: {configData.graduate_fee}</li>
            <li className="my-2">Create Fee: {configData.create_fee}</li>
            <li className="my-2">Creator Fee: {configData.creator_fee}</li>
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-5">Pool</h2>
        {poolData && (
          <ul className="list-none">
            <li className="my-2">Real Reserves: {poolData.real_aptos_reserves}</li>
            <li className="my-2">Real Token Reserves: {poolData.real_token_reserves}</li>
            <li className="my-2">Virtual Reserves: {poolData.virtual_aptos_reserves}</li>
            <li className="my-2">Virtual Token Reserves: {poolData.virtual_token_reserves}</li>
            <li className="my-2">Remaining Token Reserves: {poolData.remain_token_reserves}</li>
            <li className="my-2">Is Completed: {poolData.is_completed ? "Yes" : "No"}</li>
          </ul>
        )}
      </section>
    </div>
  );
};