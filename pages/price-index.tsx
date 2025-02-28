// pages/charts.tsx (ou onde quer que esteja ChartsPage)

import dynamic from "next/dynamic";

// Carrega o ZigglyPriceComponent apenas no lado do cliente, sem SSR
const ZigglyPriceComponent = dynamic(() => import("../components/ZigglyPriceComponent"), {
  ssr: false,
  loading: () => <p>Loading...</p>, // Mostra enquanto carrega
});

export default function ChartsPage() {
  return (
    <div>      
      <ZigglyPriceComponent />
    </div>
  );
}