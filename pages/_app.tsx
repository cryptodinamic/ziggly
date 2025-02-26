import type { AppProps } from "next/app";
import "../styles/globals.css";
import Nav from "../components/Nav";
import { WalletProvider } from "../contexts/WalletContext"; // Adjust path as needed

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <div className="flex flex-col bg-[#0A0A0A] ">
        {/* Fixed Nav at the top */}
        <Nav />

        {/* Page content with margin to avoid overlapping Nav */}
        <main className="flex-1 mt-1 sm:mt-1 md:mt-1">
          <Component {...pageProps} />
        </main>
      </div>
    </WalletProvider>
  );
}