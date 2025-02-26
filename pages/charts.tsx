import dynamic from "next/dynamic";

// Carrega o componente Charts apenas no lado do cliente, sem SSR ou SSG
const Charts = dynamic(() => import("../components/Charts"), {
  ssr: false,
});

export default function ChartsPage() {
  return <Charts />;
}