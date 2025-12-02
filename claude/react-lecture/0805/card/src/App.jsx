// Button 컴포넌트
// Button.jsx 파일로 만드세요.
function Button({ children }) {
  return (
    <button className="bg-[#1d4ed8] text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
      {children}
    </button>
  );
}

// Card 컴포넌트
// Card.jsx 파일로 만드세요.
function Card({ image, title, description, price, stock }) {
  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        className="w-full h-48 object-cover"
        src={image}
        alt={title}
      />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-700 mb-2">{description}</p>
        <p className="text-gray-700">가격: {price}</p>
        <p className="text-gray-700 mb-4">재고: {stock}</p>
        <Button>
          지금 바로 구매!
        </Button>
      </div>
    </div>
  );
}

// 메인 App 컴포넌트
function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card
        image="https://picsum.photos/400/300"
        title="라이캣의 Tailwind 노하우 책"
        description="Tailwind CSS를 사용하여 만든 간단한 카드 구성 요소입니다. 이미지, 제목 및 설명이 포함되어 있습니다."
        price="1000원"
        stock="10개"
      />
    </div>
  );
}

export default App;