import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiGlobe } from "react-icons/fi"; // Ícone de globo para o botão (via react-icons)

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation(); // Use i18n do useTranslation para garantir acesso seguro
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    if (i18n && i18n.changeLanguage) { // Verifica se i18n está definido e tem changeLanguage
      i18n.changeLanguage(lng);
      setIsOpen(false); // Fecha o dropdown após selecionar um idioma
    }
  };

  // Lista de idiomas suportados (exemplo; expanda para 118 idiomas)
  const languages = [
    { code: "pt", flag: "🇵🇹", name: "Portuguese" },  
  ];

  // Fechar o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white bg-purple-500 rounded-full hover:bg-purple-600 transition flex items-center"
      >
        <FiGlobe className="mr-2" />
        {t("language.default", { defaultValue: "English" })} {/* Tradução com fallback */}
      </button>
      {/* Dropdown com bandeiras */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-800/90 rounded-lg shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="w-full p-2 text-left text-gray-300 hover:text-white hover:bg-gray-700 transition flex items-center"
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}