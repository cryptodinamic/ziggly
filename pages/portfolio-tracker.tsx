import dynamic from "next/dynamic";

// Carrega o PortfolioTracker apenas no lado do cliente, sem SSR ou SSG
const PortfolioTracker = dynamic(() => import("../components/PortofolioTracker"), {
  ssr: false,
});

// Página wrapper que apenas renderiza o componente dinâmico
export default function PortfolioTrackerPage() {
  return <PortfolioTracker />;
}