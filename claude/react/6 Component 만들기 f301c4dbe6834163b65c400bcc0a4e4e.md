# 6. Component 만들기

`JSX` 챕터에서 실습했던 코드를 한 번 살펴보겠습니다.

```jsx

function App() {
	const name = '라이캣!';
  const someStyle = {backgroundColor:"black", color:"white"};
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth()+1;
  const date = today.getDate();
  const hour = today.getHours();
  const min = today.getMinutes();
  const sec = today.getSeconds();

  return (
    <div>
      <div>
        <h1 style={someStyle}>안녕, {name} 1호</h1>
        <h1>안녕, 라이캣 2호!</h1>
        <div className="newClass"/>
      </div>
      <div style={{backgroundColor:"black", color:"white"}}>
        <h1 style={{color:'red'}}>년 : {year}</h1>
        <h1>월/일 : {month}/{date}</h1>
        <h1>시간 : {hour}시 {min}분 {sec}초</h1>
      </div>
    </div>
  );
}

export default App;
```

처음에 작성했던 코드와 비교하면 태그들이 많이 늘어났네요! 하지만 우리가 실제로 페이지를 만들게 된다면 `return()` 안에 있는 코드가 정말 많이 길어질 것입니다. 

코드가 길어질수록 가독성도 떨어지겠죠? 지금부터 가독성을 높이고 유지보수를 쉽게 할 수 있는 방법을 소개하겠습니다.

<aside>
💡 h1이 문서에 5개입니다. h1은 문서 내 1개만 작성해야 하기 때문에 컴포넌트를 나눌 때에도 이러한 시맨틱 구조에 신경을 써야 합니다.

</aside>

# 1. 컴포넌트 만들기

```jsx
return (
	<div>
		<Licat />{/* 라이켓 모음 */}
		<Time />{/* 시간보여주기 */}
	</div>
)
```

이렇게 묶은 것을 컴포넌트라고 합니다. 각 기능 또는 목적에 따라 분리하여 사용하면 매우 편리하겠죠?

먼저 어떻게 분리할지 살펴본 후 분리해 보도록 하겠습니다. 분리할 부분은 주석으로 표시하였습니다.

```jsx
function App() {
	const name = '라이캣!';
  const someStyle = {backgroundColor:"black", color:"white"};
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth()+1;
  const date = today.getDate();
  const hour = today.getHours();
  const min = today.getMinutes();
  const sec = today.getSeconds();

  return (
    <div>
			{/* 여기부터 */}
      <div> 
        <h1 style={someStyle}>안녕, {name} 1호</h1>{/* 이렇게하면 나옵니다. */}
        <h1>안녕, 라이캣 2호!</h1>
        <div className="newClass"/> {/* class대신 className=""로 진행! */}
      </div>
			{/* 여기까지 라이켓 */}

			{/* 여기부터 */}
      <div style={{backgroundColor:"black", color:"white"}}>
        <h1 style={{color:'red'}}>년 : {year}</h1>
        <h1>월/일 : {month}/{date}</h1>
        <h1>시간 : {hour}시 {min}분 {sec}초</h1>
      </div>
			{/* 여기까지 시간! */}
    </div>
  );
}

export default App;
```

자, 아래와 같이 수정하였습니다. 실행시켜보면 이전과 동일한 화면이 표시됩니다.

```jsx
function Licat(props) {
	const name = '라이캣!';
  const someStyle = {backgroundColor:"black", color:"white"};
  return(
    <div>
      <h1 style={someStyle}>안녕, {name} 1호</h1>{/* 이렇게하면 나옵니다. */}
      <h1>안녕, 라이캣 2호!</h1>
      <div className="newClass"/> {/* class대신 className=""로 진행! */}
    </div>
  )
}

function Time(props) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth()+1;
  const date = today.getDate();
  const hour = today.getHours();
  const min = today.getMinutes();
  const sec = today.getSeconds();
  return(
    <div style={{backgroundColor:"black", color:"white"}}>
      <h1 style={{color:'red'}}>년 : {year}</h1>
      <h1>월/일 : {month}/{date}</h1>
      <h1>시간 : {hour}시 {min}분 {sec}초</h1>
    </div>
  ) 
}

function App() {
  return (
    <div>
      <Licat />
      <Time />
    </div>
  );
}
```

그런데 완성된 코드는 오히려 길어진 것을 볼 수 있습니다. 하지만 최상위 `App()`에서 바라보면 소스코드가 보다 보기 편하게 정리된 것을 볼 수 있습니다.

```jsx
function App() {
  return (
    <div>
      <Licat />
      <Time />
    </div>
  );
}
```

이렇게 만든 `<Licat/>`과 `<Time/>` 을 **컴포넌트**라고 부릅니다. 그리고 `App()` 도 하나의 컴포넌트임을 알게 되었습니다. 이때 주의할 점은 **컴포넌트의 이름을 지을 때는 첫 글자를 대문자**로 작성해야 컴포넌트로 해석됩니다.

# 2. Props 파라미터

여기서 우리가 만든 **컴포넌트**에서 뭔가 이상한 걸 눈치챈 분이 있을 것 같네요. 이전 코드와 달리 `props`라는 파라미터가 생겼습니다. props는 컴포넌트를 만들 때 넣어줄 수 있는 속성의 집합입니다. 

리액트 컴포넌트는 JS 함수와 유사합니다. 컴포넌트는 props라는 임의의 입력을 받아 리액트 엘리먼트들을 화면에 어떻게 표시할지 설정할 수 있습니다. 바로 사용해 볼까요?

`Licat`컴포넌트에  name이라는 속성을 넣어줬습니다. 이제 props를 통해 입력받은 속성을 사용하기만 하면 됩니다.

```jsx
 function App() {
  return (
    <div>
      <Licat name="gary" />
      <Time />
    </div>
  );
}
```

name 속성을 넣어준 후 아래와 같이 `Licat`컴포넌트를 수정해보도록 하겠습니다. props 객체의 name 프로퍼티에 접근하는 JS 문법이기 때문에 사용하실 때에는 꼭 중괄호로 묶어줘야 한다는 것을 잊지 마세요.

```jsx
function Licat(props) {
  const someStyle = {backgroundColor:"black", color:"white"};
  return(
    <div>
      <h1 style={someStyle}>안녕, {props.name} 1호</h1>
      <h1>안녕, {name} 2호!</h1>
      <div className="newClass"/> 
    </div>
  )
}
```

이제 '라이캣'과 같이 직접 문자열로 넣어준 부분을 `props.name`을 통해 조금 더 동적으로 사용할 수 있게 되었습니다. 그 아래도 `{name}` 대신 `props.name`으로 바꿔주겠습니다. 

이제 Licat 컴포넌트는 name을 입력받아 인사를 하는 컴포넌트가 되었습니다. 라이캣뿐만 아니라 다른 친구들에게도 인사를 할 수 있게 되었네요.

여기서 컴포넌트 이름을 **'Hello'**라고 수정하면 사용할 때 의미가 조금 더 명확해 지겠죠? 이제 Hello 컴포넌트의 이름만 봐도 인사를 하기 위한 컴포넌트인 것을 쉽게 알 수 있습니다.

```jsx
import './App.css';

function Hello(props) {
  const someStyle = {backgroundColor:"black", color:"white"}
  return(
    <div>
      <h1 style={someStyle}>안녕, {props.name} 1호</h1>{/* 이렇게하면 나옵니다. */}
      <h1>안녕, {props.name} 2호!</h1>
      <div className="newClass"/> {/* class대신 className=""로 진행! */}
    </div>
  )
}
function Time(props) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()+1
  const date = today.getDate()
  const hour = today.getHours()
  const min = today.getMinutes()
  const sec = today.getSeconds()
  return(
    <div style={{backgroundColor:"black", color:"white"}}>
      <h1 style={{color:'red'}}>년 : {year}</h1>
      <h1>월/일 : {month}/{date}</h1>
      <h1>시간 : {hour}시 {min}분 {sec}초</h1>
    </div>
  )
  
}
function App() {
  return (
    <div>
      <Hello name="개리"/>
      <Time />
    </div>
  );
}

export default App;
```

props로 넘길수 있는 데이터는 다양합니다. 문자열, 숫자형 등등 심지어 JSX 까지 데이터를 넘길 수 있습니다.

```jsx
function HelloProps(props) {
  return (
    <div>
      <p>my name is {props.name} and age is {props.age}</p>
      <strong>you are {props.someFunc()}</strong>
      <p>this is someArr {[...props.someArr]}</p>
      <p>this is someObj {props.someObj.one}</p>
      {props.someJSX}
    </div>
  )
}

function App() {
  return (
			<HelloProps 
				name="jaehyun" 
				age={25} 
				someFunc={() => 'awesome!!!'} 
				someJSX={<img src="https://picsum.photos/id/237/200/300" />} 
				someArr={[1, 2, 3]} 
				someObj={{ one: 1 }} />
  );
}
```

**컴포넌트는 재사용성을 극대화합니다.** 재사용성을 조금 더 체감하기 위해 파일을 분리해보도록 하겠습니다.

먼저 src 폴더에 Components라는 폴더를 만들어 주세요. 그리고 Components 폴더 안에 `Hello.js`, `Time.js` 파일을 만든 후 각 코드를 옮겨보겠습니다.

# 3. 컴포넌트 파일 분리

파일을 분리할 땐 가장 아랫줄에 `export` 구문을 입력해 줍니다. 밖으로 빼낼 모듈을 설정할 수 있습니다. 

```jsx
import React from 'react';
import '../App.css'; //파일의 위치가 달라졌으니 css의 주소도 바꿔줍니다.

function Hello(props) {
  const someStyle = {backgroundColor:"black", color:"white"};
  return(
    <div>
      <h1 style={someStyle}>안녕, {props.name} 1호</h1>
      <h1>안녕, {props.name} 2호!</h1>
      <div className="newClass"/>
    </div>
  )
}

export default Hello; //밖에서 사용할 수 있도록 해줍니다!
```

```jsx
import React from 'react';

function Time(props) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth()+1;
  const date = today.getDate();
  const hour = today.getHours();
  const min = today.getMinutes();
  const sec = today.getSeconds();
  return(
    <div style={{backgroundColor:"black", color:"white"}}>
      <h1 style={{color:'red'}}>년 : {year}</h1>
      <h1>월/일 : {month}/{date}</h1>
      <h1>시간 : {hour}시 {min}분 {sec}초</h1>
    </div>
  );
}

export default Time;
```

```jsx
// 각 컴포넌트들을 가지고 옵니다!
import Hello from './Components/Hello';
import Time from './Components/Time';

function App() {
  return (
    <div>
      <Hello name="개리"/>
      <Time />
    </div>
  );
}

export default App;
```

# 4. Quiz

분리가 잘 되었습니다. 컴포넌트에서 스타일을 정의한 오브젝트에 "black"이나 "white"같은 문자열 대신 속성을 참조하게 한다면 스타일도 바꿀 수 있습니다.

다음은 퀴즈입니다. 

1. 아래 코드와 결과 화면을 참고하여 `Resume` 컴포넌트를 만들어 보세요!

```jsx
// 각 컴포넌트들을 가지고 옵니다!
import Hello from './Components/Hello';
import Time from './Components/Time';

function App() {
  return (
    <div>
      <Hello name="개리"/>
      <Time />
			<Resume hello="안녕하세요" name="개리" hobby="게임" food="고기" color="blue"/>
    </div>
  );
}

export default App;
```

![Untitled](Untitled%2014.png)

- 정답
    
    ```jsx
    function Resume(props) {
        return(
            <div style={{border:"solid 1px", width:"500px"}}>
                <h1>{props.name} 자기소개서</h1>
                <h1>{props.hello}</h1>
                <h2>취미 : {props.hobby}</h2>
                <h2>좋아하는 음식 : {props.food}</h2>
                <h2>좋아하는 색 : <span style={{color:props.color}}>{props.color}</span></h2>
            </div>
        )
    }
    export default Resume;
    ```
    
    ### ++ props 구조분해할당 (`props.` 생략하기)
    
    ```jsx
    function Resume({ hello, name, hobby, food, color }) { // 구조분해할당
      return (
        <div style={{ border: "solid 1px", width: "500px" }}>
          <h1>{name} 자기소개서</h1>
          <h1>{hello}</h1>
          <h2>취미 : {hobby}</h2>
          <h2>좋아하는 음식 : {food}</h2>
          <h2>
            좋아하는 색 : <span style={{ color }}>{color}</span>
          </h2>
        </div>
      );
    }
    export default Resume;
    ```
    

1. 아래 코드와 결과 화면을 참고하여 ColorText 컴포넌트를 만들어 보세요!

```jsx
function App() {
    return (
        <div>
          <ColorText color="red"/>
          <ColorText color="green"/>
          <ColorText color="blue"/>
        </div>
    );
}
```

![스크린샷 2023-05-03 오전 3.06.42.png](%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-05-03_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_3.06.42.png)

---