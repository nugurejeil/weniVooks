// useContext를 사용하고 구현

import { createContext, useState } from "react";

const LanguageContext = createContext();

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

function LanguageSelector() {
  // 이렇게 파라미터가 없어진다는 것은 무엇을 의미하나요?
  // 복잡도가 매우 낮아진다는 것을 의미합니다.
  // 왜요? 이 아래 컴포넌트가 또 있으면 또 전달해줘야 하잖아요?
  // 그런데 컴포넌트가 아무리 연속되어도 전달해줄 필요가 없는 것입니다.
  return (
    <>
      <div>{currentLanguageSelector}</div>
      <button onClick={() => setLanguage('en')}>영어</button>
      <button onClick={() => setLanguage('ko')}>한국어</button>
      <button onClick={() => setLanguage('ja')}>日本語</button>
    </>
  )
}

function Header() {
  return (
    <h2>{title}</h2>
  )
}

function Content() {
  return (
    <div>
      <p>{greeting}</p>
      <p>{description}</p>
    </div>
  )
}

function App() {
  const [language, setLanguage] = useState('ko');
  const currentLanguage = languages[language];
  
  function changeLanguage(lang) {
    setLanguage(lang);
  }

  return (
    // useContext를 사용할 것이라서 매우 깔끔해진 것을 볼 수 있습니다.
    <LanguageContext.Provider value={{ currentLanguage, language, changeLanguage }}>
      <LanguageSelector />
      <Header />
      <Content />
    </LanguageContext.Provider>
  )
}

export default App
