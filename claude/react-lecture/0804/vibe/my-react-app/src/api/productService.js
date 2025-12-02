// productService.js: 상품 데이터를 가져오는 API 서비스입니다
// 나중에 다른 API 엔드포인트가 추가되어도 쉽게 관리할 수 있도록 분리했습니다

// API 기본 URL을 상수로 정의합니다
const API_BASE_URL = 'https://dev.wenivops.co.kr/services/fastapi-crud/1';

// 상품 목록을 가져오는 함수입니다
export const fetchProducts = async () => {
  try {
    // fetch를 사용해서 API에서 데이터를 가져옵니다
    const response = await fetch(`${API_BASE_URL}/product`);
    
    // 응답이 성공적이지 않으면 에러를 발생시킵니다
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // JSON 형태로 데이터를 파싱합니다
    const data = await response.json();
    
    // API 응답이 배열인지 확인합니다
    // 때로는 API가 { items: [...] } 형태로 반환할 수도 있으므로 체크합니다
    if (Array.isArray(data)) {
      return data;
    } else if (data.items && Array.isArray(data.items)) {
      return data.items;
    } else {
      console.warn('Unexpected API response format:', data);
      return [];
    }
  } catch (error) {
    // 에러가 발생하면 콘솔에 출력하고 다시 throw합니다
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

// 나중에 추가할 수 있는 다른 API 함수들의 예시입니다
// export const fetchProductById = async (id) => { ... }
// export const createProduct = async (productData) => { ... }
// export const updateProduct = async (id, productData) => { ... }
// export const deleteProduct = async (id) => { ... }