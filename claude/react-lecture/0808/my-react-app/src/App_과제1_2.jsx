// useContext를 사용하지 않고 구현

import { useState } from "react";

const languages = {
    en: {
        title: "Multi-language App",
        greeting: "Hello, welcome to our app!",
        description: "This app supports multiple languages.",
        languageSelector: "Select Language:"
    },
    ko: {
        title: "다국어 앱",
        greeting: "안녕하세요, 우리 앱에 오신 것을 환영합니다!",
        description: "이 앱은 여러 언어를 지원합니다.",
        languageSelector: "언어 선택:"
    },
    ja: {
        title: "多言語アプリ",
        greeting: "こんにちは、私たちのアプリへようこそ！",
        description: "このアプリは複数の言語をサポートしています。",
        languageSelector: "言語を選択："
    }
};

function LanguageSelector(){
  return (
    <div>language selector</div>
  )
}

function Header() {
  return (
    <div>header</div>
  )
}

function Content() {
  return (
    <div>Content</div>
  )
}

function App() {
  const [language, setLanguage] = useState('ko');
  const currentLanguage = languages[language];

  return (
    <>
      <LanguageSelector
        currentLanguageSelector={currentLanguage.languageSelector}
        language={language}
        setLanguage={setLanguage}
      />
      <Header />
      <Content />
    </>
  )
}

export default App
