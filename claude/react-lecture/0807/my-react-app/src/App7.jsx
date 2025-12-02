// 의존성과 의존성 주입
// 이 2개는 다른 개념입니다.
// 의존성: 어떤 함수가 다른 값에 의존하는 것
// 의존성 주입: 어떤 함수가 다른 값을 의존성으로 받는 것

import { useCallback, useState } from "react";

function App() {
    const [price, setPrice] = useState(1000);
    const [quantity, setQuantity] = useState(1);

    // 잘못된 예제
    const totalPrice1 = useCallback(() => {
        // 이 함수는 처음 만들어질 때 price와 quantity의 값을 기억(캡처) 합니다.
        // price == 1000, quantity == 1 로 고정이 됩니다.
        return price * quantity;
    }, []); // price와 quantity가 변경될 때마다 totalPrice1

    // 잘된 예제
    const totalPrice2 = useCallback(() => {
        // 이 함수는 price와 quantity의 현재 값을 사용합니다.
        // price와 quantity가 변경될 때마다 totalPrice2가 새로 만들어집니다.
        return price * quantity;
    }, [price, quantity]); // price와 quantity가 변경될 때마다 totalPrice2

    return (
        <>
            <div>
                <h1>가격 계산기</h1>
                <p>가격: {price}</p>
                <p>수량: {quantity}</p>
                <p>총 가격1: {totalPrice1()}</p>
                <p>총 가격2: {totalPrice2()}</p>
                <button onClick={() => setPrice(price + 100)}>가격 증가</button>
                <button onClick={() => setQuantity(quantity + 1)}>수량 증가</button>
            </div>
        </>
    )
}

export default App
