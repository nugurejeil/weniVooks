// 지금은 useContext를 사용하는 것이 더 복잡성을 올립니다.
// 다만 복잡도가 증가했을 때에는 useContext를 사용하는 것이 좋습니다.

// Q: 아니, 너무 어렵잖아요? addToCart를 Cart 컴포넌트에 위치해주면 안되나요? 뭐하러 전달하죠?
// A: 맞습니다. 다만 그러면 addToCart를 통해서 카트안에 상품을 추가할 때, Cart 컴포넌트만 업데이트가 됩니다.
// 예를 들어, 재고가 반영이 되어야 한다던지, 있는 현금이 반영이 되어야 한다던지 하면
// 반영을 못시키게 됩니다.

import { useContext, useState, useEffect, createContext } from "react";

const MyContext = createContext();

const products = [
    { id: 1, name: "노트북", price: 1000 },
    { id: 2, name: "스마트폰", price: 500 },
    { id: 3, name: "태블릿", price: 300 },
];

function App() {
    const [cart, setCart] = useState([]);

    function addToCart(product) {
        const existingProduct = cart.find((item) => item.id === product.id);
        // 이미 장바구니에 있는 상품이라면 수량을 증가시킵니다.
        if (existingProduct) {
            setCart(
                cart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        }
        // 장바구니에 없는 상품이라면 새로 추가합니다.
        else {
            setCart([...cart, { ...product, quantity: 1 }]);
            // 실제 담기는 데이터: [{ id: 1, name: "노트북", price: 1000, quantity: 1 }]
        }
    }

    function removeFromCart(productId) {
        const newCart = cart.filter((item) => item.id !== productId);
        setCart(newCart);
    }

    return (
        <MyContext.Provider value={{ products, cart, addToCart, removeFromCart }}>
            <h1>나의 리액트 앱</h1>
            <ProductList />
            <Cart />
        </MyContext.Provider>
    );
}

function ProductList() {
    const { products, addToCart } = useContext(MyContext);
    return (
        <div>
            {products.map((product) => (
                <div key={product.id}>
                    <h2>{product.name}</h2>
                    <p>금액: {product.price}원</p>
                    <button onClick={() => addToCart(product)}>장바구니에 추가</button>
                </div>
            ))}
            <h2>상품 목록</h2>
        </div>
    );
}

function Cart() {
    const { cart, removeFromCart } = useContext(MyContext);

    // [{id: 1, name: "노트북", price: 1000, quantity: 1}]
    return (
        <div>
            <h2>장바구니</h2>
            <ul>
                {cart.map((item)=>{
                    return (
                        <li key={item.id}>
                            {item.name} - {item.quantity}개
                            <button onClick={() => removeFromCart(item.id)}>삭제</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default App;