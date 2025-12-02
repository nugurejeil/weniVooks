# 18. Context(ContextAPI)

# 1. props와 context

이번 시간에는 Context에 대해서 알아봅시다! 

![위니브](Untitled%2043.png)

위니브

보통 컴포넌트에게 데이터를 넘겨줄 때 props를 통하여 넘겨줍니다. 위의 그림을 살펴볼까요?

1. 부모 컴포넌트가 자식 컴포넌트에게 데이터를 전달해주려면 props로 값을 넘겨주고 자식 컴포넌트는 props를 통해 받은 데이터를 사용합니다.
2. 부모 컴포넌트가 자식의 자식 즉, ‘자손’ 컴포넌트에게 데이터를 전달해줄 때는 어떻게 전달할까요? 자식에게 전달해준 방법 그대로, 부모 컴포넌트가 자식 컴포넌트에게 props로 데이터를 넘겨주고, 자식 컴포넌트는 자신의 자식 컴포넌트에게 데이터를 넘겨줍니다.

부모 컴포넌트는 자식에게 props를 통해 데이터를 넘겨주고, 자식은 또 자식에게 props를 통해 데이터를 넘겨주게 되는 것이죠.

작은 프로젝트에서는 props 전달은 문제가 없습니다. 하지만 프로젝트가 커져서 부모가 n번째 자손에게 넘겨줘야 한다면 n-1개의 자손에게 props를 사용하여 전달하게 됩니다. 단지 전달을 위해서 말이죠! 계속해서 불필요한 props를 사용하게 되고 의미 없는 값들이 컴포넌트들을 스쳐가게 됩니다.

이때 사용하는 것이 바로 **context**입니다! context는 props를 사용하지 않고 데이터를 전달하도록 해줍니다. 

props를 사용하지 않고 **n번째 자손에게 직접 데이터를 건내줍니다.** n-1개의 자식을 통과하여 n번째 자식에게 데이터를 전달하지 않아도 부모에서 바로 n번째 자식에게 값을 전달할 수 있게 됩니다.

props에 대한 전역 데이터 저장소라고 생각하면 됩니다.

## 1.1 props로 전달

```jsx
const App = () => {
  return (
    <HelloLicat value={{ name: "gary", id: "garyIsFree" }} />
  );
};

const HelloLicat = (props) => {
  console.log(props)
  return (
    <div>
      <h2>{props.value.id}</h2>
      <strong>{props.value.name}</strong>
      <HelloLicatTwo value={{name:props.value.name, id: props.value.id}}/>
    </div>
  );
};

const HelloLicatTwo = (props) => {
  return (
    <div>
      <h2>Two : {props.value.id}</h2>
      <strong>Two : {props.value.name}</strong>
    </div>
  );
};

export default App;
```

## 1.2 props로 자손에게 데이터 전달

구조분해할당을 이용해 코드를 좀 더 세련되게 바꾸었습니다.

```jsx
// const App = () => {
//   return (
//     <HelloLicat value={{ name: "gary", id: "garyIsFree" }} />
//   );
// };

// const HelloLicat = (props) => {
//   console.log(props)
//   return (
//     <div>
//       <h2>{props.value.id}</h2>
//       <strong>{props.value.name}</strong>
//       <HelloLicatTwo value={{name:props.value.name, id: props.value.id}}/>
//     </div>
//   );
// };

// const HelloLicatTwo = (props) => {
//   return (
//     <div>
//       <h2>Two : {props.value.id}</h2>
//       <strong>Two : {props.value.name}</strong>
//     </div>
//   );
// };

// export default App;

const App = () => {
  return (
    <HelloLicat value={{ name: "gary", id: "garyIsFree" }} />
  );
};

const HelloLicat = ({value:{name, id}}) => {
  return (
    <div>
      <h2>{id}</h2>
      <strong>{name}</strong>
      <HelloLicatTwo value={{name, id}}/>
    </div>
  );
};

const HelloLicatTwo = ({value:{name, id}}) => {
  return (
    <div>
      <h2>Two : {id}</h2>
      <strong>Two : {name}</strong>
    </div>
  );
};

export default App;
```

# 2. contextAPI

### 2.1 context 사용해보기

**1) Context 생성**

`createContext`로 context를 생성합니다. 값을 전달해줄 컴포넌트에 `Context.Consumer` 형식으로 감싸주고 `UserInfo` 안에 있는 `Consumer`라는 컴포넌트를 통해 `value` 값을 가져옵니다.

```jsx
import React, { createContext } from "react";

const UserInfo = createContext({ name: "gary", id: "garyIsFree" });

const App = () => {
  return (
    <HelloLicat/>
  );
};

const HelloLicat = () => {
  return (
    <UserInfo.Consumer>
      {(value) => (
        <div>
          <h2>{value.name}</h2>
          <strong>{value.id}</strong>
        </div>
      )}
    </UserInfo.Consumer>
  );
};

export default App;
```

<aside>
💡 아래와 같은 코드는 error가 납니다. Consumer는 자식으로 태그를 가질 수 없습니다. 하나의 함수로 감싸주세요.

```jsx
<Value.Consumer>
  <p>hello</p>
  {(value) => (<p>{value.price}</p>)}
</Value.Consumer>
```

</aside>

### 2.2 context로 자손에게 데이터 전달

```jsx
import React, { createContext } from "react";

const UserInfo = createContext({ name: "gary", id: "garyIsFree" });

const App = () => {
  return (
    <HelloLicat/>
  );
};

const HelloLicat = () => {
  return (
    <UserInfo.Consumer>
      {(value) => (
        <div>
          <h2>{value.name}</h2>
          <strong>{value.id}</strong>
          <HelloLicatTwo/>
        </div>
      )}
    </UserInfo.Consumer>
  );
};

const HelloLicatTwo = () => {
  return (
    <UserInfo.Consumer>
      {(value) => (
        <div>
          <h2>{value.name}</h2>
          <strong>{value.id}</strong>
        </div>
      )}
    </UserInfo.Consumer>
  );
};

export default App;
```

아래처럼 별도로 분리된 파일에게 데이터를 전달할 수 있습니다.

```jsx
import { createContext } from "react";

export const UserInfo = createContext({ name: "gary", id: "garyIsFree" });
```

```jsx
import React from "react";
import { HelloLicat } from "./HelloLicat";

const App = () => {
    return (
        <HelloLicat />
    );
};

export default App;
```

```jsx
import { UserInfo } from "./UserContext";

const HelloLicat = () => {
    return (

        <UserInfo.Consumer>

            {(value) => (
                <div>
                    <h2>{value.name}</h2>
                    <strong>{value.id}</strong>
                    <HelloLicatTwo />
                </div>
            )}

        </UserInfo.Consumer>
    );
};

const HelloLicatTwo = () => {
    return (
        <UserInfo.Consumer>
            {(value) => (
                <div>
                    <h2>{value.name}</h2>
                    <strong>{value.id}</strong>
                </div>
            )}
        </UserInfo.Consumer>
    );
};

export { HelloLicat, HelloLicatTwo };

```

**2) Context.Provider로 값 변경하기**

```jsx
import React, { createContext } from "react";

const UserInfo = createContext({ name: "gary", id: "garyIsFree" });

const App = () => {
  return (
    <UserInfo.Provider value={{ name: "Licat", id: "ImLion" }}>
      <HelloLicat />
    </UserInfo.Provider>
  );
};

const HelloLicat = () => {
  return (
    <UserInfo.Consumer>
      {(value) => (
        <div>
          <h2>{value.name}</h2>
          <strong>{value.id}</strong>
          <HelloLicatTwo/>
        </div>
      )}
    </UserInfo.Consumer>
  );
};

const HelloLicatTwo = () => {
  return (
    <UserInfo.Consumer>
      {(value) => (
        <div>
          <h2>{value.name}</h2>
          <strong>{value.id}</strong>
        </div>
      )}
    </UserInfo.Consumer>
  );
};

export default App;
```

`HelloLicat`에 `UserInfoContext.Provider`로 감싸서 값을 전달하면 consumer로 전달되는 `value` 값이 바뀝니다.

다른 값들도 넣어보세요!

```jsx
<UserInfo.Provider value={{ name: "ali", id: "nodeMaster" }}>
```

이때, Context의 Provider는 **반드시 `value` 속성**을 사용해야 합니다!  꼭 `value`를 넣어야 합니다.

```jsx
const App = () => {
  return (
    <UserInfoContext.Provider>
      <HelloLicat />
    </UserInfoContext.Provider>
  );
};

// ERROR 발생
```

정리해보겠습니다!

1. Context.Provider는 컴포넌트 계층 구조에서 Context 객체를 전달하는 역할을 합니다. Provider를 사용하여 Context를 구독하는 모든 하위 컴포넌트들이 Provider가 제공하는 값을 사용할 수 있게 됩니다.
2. Context.Consumer는 Context를 구독하는 컴포넌트입니다. Consumer를 사용하여 Provider에서 전달받은 Context 값을 사용할 수 있습니다. Consumer는 Provider로부터 값을 받아올 때 콜백 함수를 사용합니다. 이 콜백 함수의 인자로 전달되는 값은 Provider에서 전달한 Context 값이 됩니다.

Provider는 Context 값을 제공하고 Consumer는 해당 값을 사용하는 역할을 하며, 이 둘을 결합하여 props를 사용하지 않고도 컴포넌트 트리의 어디에서든 Context 값을 사용할 수 있습니다.

단, 이는 전역 공간을 사용하는것이기 때문에 반드시 필요한 데이터가 아니라면 사용을 최소화 하는것이 좋습니다!

props drilling 이 세 단계를 초과하지 않는다면 꼭 사용할 필요는 없습니다. 보통 네단계까지 넘어가면 가독성과 유지보수성이 떨어진다고 판단합니다.