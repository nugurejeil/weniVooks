// React의 Hook들을 가져옵니다
import { useState, useEffect } from 'react'

// CSS 스타일을 가져옵니다
import './App.css'

// 만들어둔 컴포넌트들을 가져옵니다
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import CartButton from './components/CartButton'
import Loading from './components/Loading'
import Error from './components/Error'

// API 서비스를 가져옵니다
import { fetchProducts } from './api/productService'

// App 컴포넌트: 전체 애플리케이션의 최상위 컴포넌트입니다
function App() {
  // useState Hook을 사용해서 상품 데이터를 관리합니다
  // 초기값은 빈 배열입니다
  const [products, setProducts] = useState([]);
  
  // 로딩 상태를 관리합니다
  const [loading, setLoading] = useState(true);
  
  // 에러 상태를 관리합니다
  const [error, setError] = useState(null);

  // useEffect Hook을 사용해서 컴포넌트가 처음 렌더링될 때 데이터를 가져옵니다
  useEffect(() => {
    // 비동기 함수를 정의합니다
    const loadProducts = async () => {
      try {
        // 로딩을 시작합니다
        setLoading(true);
        setError(null);
        
        // API에서 상품 데이터를 가져옵니다
        const data = await fetchProducts();
        
        // 가져온 데이터를 state에 저장합니다
        setProducts(data);
      } catch (err) {
        // 에러가 발생하면 에러 메시지를 저장합니다
        setError('상품을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        console.error('Error loading products:', err);
      } finally {
        // 성공하든 실패하든 로딩은 끝났으므로 false로 설정합니다
        setLoading(false);
      }
    };

    // 위에서 정의한 함수를 실행합니다
    loadProducts();
  }, []); // 빈 배열을 전달해서 컴포넌트가 처음 마운트될 때만 실행되도록 합니다

  // 로딩 중일 때 보여줄 화면입니다
  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <Header />
          <main className="main-content">
            <Loading />
          </main>
        </div>
      </div>
    );
  }

  // 에러가 발생했을 때 보여줄 화면입니다
  if (error) {
    return (
      <div className="app">
        <div className="container">
          <Header />
          <main className="main-content">
            <Error 
              message={error} 
              onRetry={() => window.location.reload()} 
            />
          </main>
        </div>
      </div>
    );
  }

  // 정상적으로 데이터를 가져왔을 때 보여줄 화면입니다
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
