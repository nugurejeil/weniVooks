# 2. React 사용 이유와 실용 예제

# 1. 페이지 구성요소의 컴포넌트화

앞서 컴포넌트라는 단어를 많이 사용하였습니다. 이번에도 역시 컴포넌트에 대한 얘기를 계속 할겁니다. 그만큼 리액트는 컴포넌트가 핵심이라고 할 수 있습니다. 좀 더 구체적으로 말하자면 리액트 라이브러리의 목적은 ***컴포넌트를 사용자 정의 요소로 표현하는것*** 이라고 할 수 있습니다.

## 1.1 실습

- 다음 코드를 타이핑 해봅시다. 앞으로 우리가 해야 할 가장 중요한 내용이 여기 담겨있습니다.
- JSX를 사용하지 않고 Template literal 문법과 innerHTML만을 사용하여 아래와 같은 코드로 표현할 수 있습니다.
    
    ```jsx
    <!DOCTYPE html>
    <html lang="ko">
    
    <head>
        <meta charset="UTF-8" />
    </head>
    
    <body>
        <div id="root"></div>
        <script>
            const root = document.querySelector('#root');
            const header = '<div>header</div>';
            const main = '<div>main</div>';
            const product = '<div>product</div>';
            const footer = '<div>footer</div>';
    
            root.innerHTML =
                `
                    ${header} 
                    ${main}
                    ${product}
                    ${footer}
                `;
        </script>
    </body>
    
    </html>
    ```
    
- JSX 문법을 사용해보도록 하겠습니다.
    
    ```jsx
    <!DOCTYPE html>
    <html lang="ko">
    
    <head>
        <meta charset="UTF-8" />
        <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
        <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    </head>
    
    <body>
        <div id="root"></div>
    
        <script type="text/babel">
    
            const header = <div>header</div>;
            const main = <div>main</div>;
            const product = <div>product</div>;
            const footer = <div>footer</div>;
    
            // JSX에서 코드의 개행이 필요할 경우 소괄호를 사용하여 묶습니다.
            const body = (
                <div>
                    {header}
                    {main}
                    {product}
                    {footer}
                </div>
            );
    
            const domContainer = document.querySelector('#root');
            const root = ReactDOM.createRoot(domContainer);
            root.render(body);
    
        </script>
    </body>
    
    </html>
    ```
    

- 조금 더 복잡한 구조의 컴포넌트를 표현해 보겠습니다. 아래 HTML코드 구조를 리액트 문법으로 직접 작성해 보시길 바랍니다.
    
    ```jsx
    <!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8" />
    </head>
    <body>
     <div id="root">
            <div>
                <header>
                    <h1>hello world shop</h1>
                    <nav>
                        <ul>
                            <li>링크1</li>
                            <li>링크2</li>
                            <li>링크3</li>
                            <li>링크4</li>
                            <li>링크5</li>
                        </ul>
                    </nav>
                </header>
    
                <main>
                    <h2>hello world!</h2>
                    <p>product list</p>
                    <ul>
                        <li>best seller 옷1</li>
                        <li>best seller 옷2</li>
                        <li>best seller 옷3</li>
                        <li>best seller 옷4</li>
                        <li>best seller 옷5</li>
                        <li>best seller 옷6</li>
                        <li>best seller 옷7</li>
                        <li>best seller 옷8</li>
                        <li>best seller 옷9</li>
                        <li>best seller 옷10</li>
                    </ul>
                </main>
    
                <footer>
                    <h2>hello footer!</h2>
                    <address>제주시 인다 1길</address>
                </footer>
            </div>
        </div>
    </body>
    </html>
    ```
    

**이제 리액트를 사용하는 이유, 어느 정도 감이 오시죠!?**

리액트는 페이지 구성 요소를 컴포넌트화 하기 위해 사용합니다. 다시 반복해서 말하자면 리액트 라이브러리의 목적은 ***컴포넌트를 사용자 정의 요소로 표현하는것*** 이라고 할 수 있습니다.

이는 대규모 프로젝트에서 **복잡도를 줄여 더 효율적인 관리와 유지보수가 가능**하게 해줍니다. 또 **일정 규모 이상으로 반복되는 UI 작업을 해야할 때 속도를 향상시킬 수 있습니다.**

이와 반대로 간단한 싱글 페이지나 다수의 정적 페이지만 필요한 경우라면 React를 도입하는 것이 좋지 않을 수 있습니다. 이럴 경우는 코드의 낭비와 다름이 없습니다.

프로젝트의 크기와 앞으로 확장성을 고려하여 React를 도입하시길 바랍니다.

# 2. 나아가기

위의 예제에서 조금 더 나아가보도록 하겠습니다.

- 함수형 컴포넌트와 바닐라 JS를 혼용해 보도록 하겠습니다. 함수로 선언된 컴포넌트는 태그처럼 꺽쇠(`<>`)로 묶이고, 변수로 선언된 것들은 중괄호(`{}`)로 묶입니다. 중괄호 안에는 JavaScript 표현식(expression)이 그대로 들어갈 수 있습니다.

```jsx
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
</head>

<body>

    <div id="root"></div>

    <script type="text/babel">

        function Header(menuOne, menuTwo) {
            return (
                <div>header
                    <div>menu</div>
                    <div>{menuOne}</div>
                    <div>{menuTwo}</div>
                </div>
            )
        }

        function Main({ name, age }) {
            console.log(name, age)
            return (
                <div>main
                    <h1>hello {name}</h1>
                    <p>hello {age}</p>
                </div>
            )
        }

        function Product() {
            return (
                <div>product
                    <div>best seller 옷1</div>
                    <div>best seller 옷2</div>
                    <div>best seller 옷3</div>
                    <div>best seller 옷4</div>
                    <div>best seller 옷5</div>
                    <div>best seller 옷6</div>
                    <div>best seller 옷7</div>
                </div>
            )
        }

        function Footer() {
            return <div>footer</div>
        }

        function f() {
            return 100
        }

        function 로그아웃() {
            return <button>로그아웃</button>
        }

        function 로그인() {
            return (
                <div>
                    <input type="text" />
                    <input type="password" />
                    <button>로그인</button>
                </div>
            )
        }

        function Test(props) {
            console.log(props)
            return null
        }

        const login = false

        const body = (
            <div>
                {/*JSX의 주석은 이렇게 표현합니다. */}
                {/*이렇게 값을 전달할 수 있습니다.*/}
                {Header('about', 'product')}
                <Main name='hojun' age='10' />

                {/*여러가지 표현식 사용이 가능합니다.*/}
                {console.log('hello')}
                {1 + 1}
                {'hello' + 'world'}
                {'<br>'}
                {f()}
                {login ? 'one' : 'two'}
                {login ? <로그아웃 /> : <로그인 />}

                <Test>
                    hello world 1
                    <h1>hello world 2</h1>
                    <h2>hello world 3</h2>
                    <Footer />
                </Test>
            </div>
        )

        const domContainer = document.querySelector('#root');
        const root = ReactDOM.createRoot(domContainer);
        root.render(body);
    </script>
</body>

</html>
```

# 3. 실용 예제(쇼핑몰 만들기)

아래와 같은 페이지를 만들어보며 리액트가 어떻게 사용되는지 살펴보도록 하겠습니다.

![Untitled](Untitled%204.png)

- 참고용 피그마 링크
    
    [파이널코딩테스트_API(공개용)](https://www.figma.com/file/KdWIgQ5VBQYPPlMB2ER6TX/%ED%8C%8C%EC%9D%B4%EB%84%90%EC%BD%94%EB%94%A9%ED%85%8C%EC%8A%A4%ED%8A%B8_API(%EA%B3%B5%EA%B0%9C%EC%9A%A9)?node-id=0%3A1)
    

- 필요한 데이터
(fetch와 같은 AJAX 프로그래밍이 가능하신 분은 비동기 통신으로 구현해보시길 권해드립니다. 단, 리액트 생애주기와 useEffect 훅에 대한 이해가 반드시 필요합니다.)
    
    ```jsx
    https://dev.wenivops.co.kr/services/fastapi-crud/1/product
    
    /* 주로 사용해볼 데이터 */
    productName
    thumbnailImg
    price
    ```
    

- 기본 골격. 위의 데이터를 사용하여 아래 완성된 화면을 참고해 상품 카드 컴포넌트를 구현해 보시길 바랍니다.
    
    ```jsx
    <!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8" />
        <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
        <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
        <title>위니브 샵</title>
    </head>
    
    <body>
    
        <div id="root"></div>
    
        <script type="text/babel"></script>
    </body>
    
    </html>
    ```
    

- 완성된 화면
    
    ![Untitled](Untitled%205.png)
    

- 스타일링 파일을 적용시켜 보도록 하겠습니다.
    
    [src.zip](src.zip)
    
- 완성된 코드
    
    [final.zip](final.zip)