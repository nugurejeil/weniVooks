// CSS 스타일을 가져옵니다
import './App.css'

// 만들어둔 컴포넌트들을 가져옵니다
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import CartButton from './components/CartButton'

// App 컴포넌트: 전체 애플리케이션의 최상위 컴포넌트입니다
function App() {
  // 상품 데이터 배열입니다
  // 실제 프로젝트에서는 이 데이터를 서버에서 가져올 수 있습니다
  const products = [
    {
      id: 1,
      title: "개구리 & 베어브릭 캐릭터 베어벅 키링 세트",
      price: 12500,
      image: "https://picsum.photos/300/300?random=1",
      category: "액세서리"
    },
    {
      id: 2,
      title: "유후라이크 아이앵무 실험실 스티커 팩",
      price: 3500,
      image: "https://picsum.photos/300/300?random=2",
      category: "문구류"
    },
    {
      id: 3,
      title: "너부니 캐릭터 무릎 담요",
      price: 17500,
      image: "https://picsum.photos/300/300?random=3",
      category: "생활용품"
    },
    {
      id: 4,
      title: "프로앤틸리더 페르자이아 고속 케이블",
      price: 13500,
      image: "https://picsum.photos/300/300?random=4",
      category: "전자제품"
    },
    {
      id: 5,
      title: "Black Swan Ulie 샤프펜 노트북 핑크색",
      price: 36000,
      image: "https://picsum.photos/300/300?random=5",
      category: "문구류"
    },
    {
      id: 6,
      title: "[NK ENTY] 복간니큐언 엔트리 재밌픈 스티커",
      price: 5500,
      image: "https://picsum.photos/300/300?random=6",
      category: "문구류"
    }
  ];

  return (
    // 전체 앱을 감싸는 최상위 div입니다
    <div className="app">
      {/* 메인 콘텐츠를 중앙에 정렬하기 위한 컨테이너입니다 */}
      <div className="container">
        {/* Header 컴포넌트를 사용해서 상단 제목을 표시합니다 */}
        <Header />
        
        {/* 메인 콘텐츠 영역입니다 */}
        <main className="main-content">
          {/* ProductGrid 컴포넌트에 상품 데이터를 전달해서 상품 목록을 표시합니다 */}
          <ProductGrid products={products} />
        </main>
      </div>
      
      {/* CartButton 컴포넌트로 장바구니 버튼을 표시합니다 */}
      <CartButton />
    </div>
  )
}

// 다른 파일에서 이 컴포넌트를 사용할 수 있도록 내보냅니다
export default App
