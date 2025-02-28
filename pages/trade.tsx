import dynamic from "next/dynamic";

// Carrega o componente Charts apenas no lado do cliente, sem SSR ou SSG
const Dex = dynamic(() => import("../components/Dex"), {
  ssr: false,
});

export default function ChartsPage() {
  return <Dex />;
}