import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en/translation.json";
import koTranslation from "./locales/ko/translation.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      ko: {
        translation: koTranslation,
      },
    },
    fallbackLng: "en", // 기본 언어 설정
    detection: {
      order: ["localStorage", "navigator"], // 로컬 스토리지 우선, 그 다음 브라우저 언어 감지
      caches: ["localStorage"], // 변경된 언어를 로컬 스토리지에 저장
    },
    debug: true,
    interpolation: {
      escapeValue: false, // XSS 공격 방지
    },
  });

export default i18n;
