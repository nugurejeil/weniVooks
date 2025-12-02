// 4. tailwindcss 적용 - 설치형
// npm install @tailwindcss/vite

// 1. npm install @tailwindcss/vite

// 2. vite.config.js에 tailwindcss 추가
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
//
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(), // 이것만 추가하면 됨!
//   ],
// })

// 3. index.css 추가
// @import "tailwindcss";

function App() {
  return (
    <>
      <h2 className="text-3xl font-bold">안녕하세요</h2>
    </>
  )
}

export default App;