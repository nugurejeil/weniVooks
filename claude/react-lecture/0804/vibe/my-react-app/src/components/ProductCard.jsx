// formatPrice 함수를 utils에서 가져옵니다
import { formatPrice } from '../utils/formatters';

// ProductCard 컴포넌트: 개별 상품 정보를 표시하는 카드 컴포넌트입니다
// props로 product 객체를 받아와서 상품 정보를 표시합니다
function ProductCard({ product }) {

  return (
    // 각 상품 카드의 컨테이너입니다
    <div className="product-card">
      {/* 상품 이미지를 감싸는 영역입니다 */}
      <div className="product-image-wrapper">
        {/* 상품 이미지를 표시합니다 */}
        <img 
          src={product.thumbnailImg || product.image}     // API에서 오는 thumbnailImg 또는 기존 image
          alt={product.productName || product.title}      // API에서 오는 productName 또는 기존 title
          className="product-image"                        // CSS 스타일을 위한 클래스
        />
      </div>
      
      {/* 상품 정보를 표시하는 영역입니다 */}
      <div className="product-info">
        {/* 할인율이 있으면 표시합니다 */}
        {product.discountRate > 0 && (
          <p className="product-discount">{product.discountRate}% 할인</p>
        )}
        
        {/* 상품 제목을 표시합니다 */}
        <h3 className="product-title">{product.productName || product.title}</h3>
        
        {/* 상품 가격을 표시합니다. formatPrice 함수로 콤마를 추가합니다 */}
        <p className="product-price">{formatPrice(product.price)}원</p>
        
        {/* 재고가 없으면 품절 표시 */}
        {product.stockCount === 0 && (
          <p className="product-soldout">품절</p>
        )}
      </div>
    </div>
  );
}

// 다른 파일에서 이 컴포넌트를 사용할 수 있도록 내보냅니다
export default ProductCard;