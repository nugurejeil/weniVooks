# 20. (참고) 라이프 사이클 - class component

<aside>
💡 함수형 컴포넌트로 수업을 진행하고 있으므로 해당 라이프 사이클은 **참고** 부탁드립니다. 우리 수업에서는 Hook Flow로 해당 cycle에 해당하는 내용을 다루고 있습니다.

</aside>

클래스 컴포넌트에서 확인하는 라이프 사이클입니다. 컴포넌트의 생애주기는 크게 세 가지로 나눌 수 있습니다.

1. 마운트(mount)
2. 업데이트(update)
3. 언마운트(unmount)

### 마운트(mount) - 처음 컴포넌트가 나타났을 때

처음 state와 props를 가지고 컴포넌트를 생성합니다.

- `constructor`
- `getDerivedStateFromProps`
- `render`
- `componentDidMount`

### 업데이트(update) - 컴포넌트 상태값이 바뀔 때

마운트가 완전히 완료된 후 상태값이나 prop의 변화가 생겼을 때, 리액트는 이를 감지하고 컴포넌트에 업데이트해줍니다.

- `getDerivedStateFromProps`
- `shouldComponentUpdate`
- `render`
- `componentWillUpdate`
- `componentDidUpdate`

### 언마운트(unmount) - 컴포넌트가 사라질 때

언마운트에서는 `componentWillUnmount`가 실행됩니다. 컴포넌트를 완전히 DOM에서 제거하는 시점입니다.

- `componentWillUnmount` : 컴포넌트가 사라지기 바로 직전에 호출됩니다.
    
    

![위니브](Frame_79.png)

위니브

```jsx
import React, { Component } from "react";

class ClassComp extends Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }

  componentWillMount() {
		//컴포넌트가 생성될 때 실행됩니다. (렌더링 되기 이전)
    console.log("componentWillMount");
  }

  componentDidMount() {
	//마운트가 완료되고 나서 실행됩니다. (렌더링 이후) 
    console.log("componentDidMount");
  }

  shouldComponentUpdate(nextProps, nextState) {
		//상태 업데이트가 되고 컴포넌트가 업데이트 되기 전(렌더되기 전) 실행됩니다.
		//초기 렌더링에서 발생하지 않습니다.
    console.log("shouldComponentUpdate");
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
		//UNSAFE_componentWillUpdate()로 변경됨, 17버전까지는 사용 가능합니다.
		//초기 렌더링에서 발생하지 않고, 그 이후 업데이트가 되고 나서 발생합니다.
    console.log("componetWillUpdate");
  }

  componentDidUpdate(nextProps, nextState) {
		//업데이트가 되고 나서 실행됩니다.
    console.log("componentDidUpdate");
  }

	componentWillUnmount() {
   //컴포넌트가 제거되기 바로 직전에 실행됩니다.
    console.log("componentWillUnmount");
  }
  

  handleClick = () => {
    this.setState((state) => {
      return {
        number: state.number + 1,
      };
    });
  };

  render() {
    console.log("render");
    return (
      <div>
        <button onClick={this.handleClick}>Click me!</button>
        <span>{this.state.number}</span>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return <ClassComp />;
  }
}

export default App
```

처음 페이지를 열었다면, 어떻게 출력될까요?

![Untitled](Untitled%2044.png)

위에서 설명한 생애주기 그대로 `componentWillMount` 되고 `render`된 후 `componentDidMount`로 마운트를 종료합니다.

이번에는 button을 클릭하여 출력을 확인해 봅시다. 

![Untitled](Untitled%2045.png)

기존 출력 상태에서 `shouldComponetUpdate`, `componentWillUpdate`, `render`, `componetDidUpdate` 이렇게 추가되었음을 확인할 수 있습니다.

다시 한 번 버튼을 눌러봅시다. 이번에는 어떻게 되었나요?

이번에도 이전에 버튼 눌렀을 때와 마찬가지로 `shouldComponetUpdate`, `componentWillUpdate`,  `render`, `componetDidUpdate` 이 출력됩니다. 

<aside>
🧐 리액트 17 버전부터`componetWillMount` ,`componentWillUpdate`, `componetDidMount` 이 함수들은 레거시로 분류되어 사용이 더 이상 권장되지 않습니다.

</aside>

정리해보겠습니다.

처음 페이지를 열었을 때, 마운트 단계이므로 컴포넌트가 생성되는 것을 확인할 수 있습니다. 그리고 더 이상 컴포넌트를 생성할 필요가 없기 때문에 마운트 단계는 종료되었고 더 이상 실행하지 않습니다. 

현재 버튼을 클릭하면 number 숫자가 1씩 증가하도록 미리 설정하였습니다. 

버튼을 클릭하면 상태가 바뀌게 되고 리액트는 업데이트 단계를 진행하게 됩니다. 컴포넌트 업데이트를 준비하고 바뀐 부분만 새로 렌더링을 하고 업데이트를 마치죠. 이것이 아까 위에서 보았던 상황들입니다.

---

[React class vs function style - 4.1. 클래스에서 라이프 사이클 구현 하기](https://youtu.be/VgbMW2f5laM)

[React class vs function style - 4.2.1. 함수에서 라이프 사이클 구현 하기 - 실습준비](https://youtu.be/cJFLZUV4iLs)