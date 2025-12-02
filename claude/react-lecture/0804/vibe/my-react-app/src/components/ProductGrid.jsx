// ProductCard 컴포넌트를 가져옵니다
import ProductCard from './ProductCard';

// ProductGrid 컴포넌트: 상품 목록을 그리드 형태로 표시하는 컴포넌트입니다
// props로 products 배열을 받아와서 각 상품을 ProductCard로 표시합니다
function ProductGrid({ products }) {
  return (
    // 상품들을 그리드 형태로 배치하는 컨테이너입니다
    <div className="product-grid">
      {/* products 배열을 map 함수로 순회하면서 각 상품마다 ProductCard를 만듭니다 */}
      {products.map((product) => (
        // ProductCard 컴포넌트를 렌더링합니다
        // key는 React가 각 요소를 구분하기 위해 필요한 고유값입니다
        // product prop으로 현재 상품 정보를 전달합니다
        <ProductCard 
          key={product.id}    // 각 상품의 고유 ID를 key로 사용
          product={product}   // 상품 정보 전체를 props로 전달
        />
      ))}
    </div>
  );
}

// 다른 파일에서 이 컴포넌트를 사용할 수 있도록 내보냅니다
export default ProductGrid;