// ## 문제 1: 테마 전환 앱

// ### 문제
// 다크모드/라이트모드를 전환할 수 있는 앱을 만들어보세요.

// ```jsx
// const themes = {
//     light: {
//         name: "라이트 모드",
//         container: "bg-white text-gray-900",
//         card: "bg-gray-100 border-gray-300",
//         button: "bg-blue-500 hover:bg-blue-600 text-white",
//         header: "bg-gray-200 text-gray-900",
//         footer: "border-gray-300"
//     },
//     dark: {
//         name: "다크 모드",
//         container: "bg-gray-900 text-white",
//         card: "bg-gray-800 border-gray-700",
//         button: "bg-green-500 hover:bg-green-600 text-white",
//         header: "bg-gray-800 text-white",
//         footer: "border-gray-700"
//     }
// };
// ```

// 요구사항
// - 테마 데이터와 현재 테마 상태는 context로 관리
// - 버튼을 클릭하면 테마가 전환됨
// - Header, Main, Footer 컴포넌트에서 테마 스타일 적용
// 

import { useState, useContext, createContext } from 'react';

const ThemeContext = createContext();

const themes = {
    light: {
        name: "라이트 모드",
        container: "bg-white text-gray-900",
        card: "bg-gray-100 border-gray-300",
        button: "bg-blue-500 hover:bg-blue-600 text-white",
        header: "bg-gray-200 text-gray-900",
        footer: "border-gray-300"
    },
    dark: {
        name: "다크 모드",
        container: "bg-gray-900 text-white",
        card: "bg-gray-800 border-gray-700",
        button: "bg-green-500 hover:bg-green-600 text-white",
        header: "bg-gray-800 text-white",
        footer: "border-gray-700"
    }
};

function App() {
  const [currentTheme, setCurrentTheme] = useState('light');
  const theme = themes[currentTheme];
  
  return (
    <ThemeContext.Provider value ={{ theme, currentTheme, setCurrentTheme }}>
      <Header />
      <Main />
      <Footer />
    </ThemeContext.Provider>
  )
}

function Header() {
  return <div>Header</div>;
}

function Main() {
  return <div>Main</div>;
}

function Footer() {
  return <div>Footer</div>;
}

export default App