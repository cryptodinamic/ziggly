import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import pt from "./locales/pt.json";


const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Inglês fixo como idioma padrão
    fallbackLng: "en", // Fallback para inglês
    interpolation: {
      escapeValue: false, // Não escapa HTML
    },
    supportedLngs: Object.keys(resources), // Suporta apenas os idiomas definidos
    // Adicione estas opções para SSR/SSG
    react: {
      useSuspense: false, // Desativa suspense para evitar problemas em SSR
    },
  });

export default i18n;