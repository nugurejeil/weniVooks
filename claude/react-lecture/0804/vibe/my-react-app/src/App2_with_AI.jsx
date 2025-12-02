import './App.css'

function App() {
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

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>VIBE SHOP</h1>
        </header>
        
        <main className="main-content">
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="product-image"
                  />
                </div>
                <div className="product-info">
                  <p className="product-category">{product.category}</p>
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">{formatPrice(product.price)}원</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      
      <button className="cart-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="white"/>
          <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="white"/>
          <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

export default App
