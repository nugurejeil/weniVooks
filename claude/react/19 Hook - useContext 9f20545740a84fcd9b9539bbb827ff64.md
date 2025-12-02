# 19. Hook - useContext

Context API에서 `Context.consumer`로 전달하던 방식을 Hooks의 `useContext`를 사용해서 더 편하게 값을 전달할 수도 있습니다.

기존에 있었던 코드를 주석 처리하였으니 비교해 보세요.

# 1. useContext 적용하기

```jsx
import { useContext, createContext } from "react";

const UserInfo = createContext({ name: "gary", id: "garyIsFree" });

const App = () => {
  return (
    <HelloLicat/>
  );
};

// const HelloLicat = () => {
//   return (
//     <UserInfo.Consumer>
//       {(value) => (
//         <div>
//           <input type="text" />
//           <h2>{value.name}</h2>
//           <strong>{`@ ${value.id}`}</strong>
//         </div>
//       )}
//     </UserInfo.Consumer>
//   );
// };

const HelloLicat = () => {
  const { name, id } = useContext(UserInfo);
  return (
    <div>
      <h2>{name}</h2>
      <strong>{id}</strong>
    </div>
  );
};

export default App;
```

# 2. useContext 자손 컴포넌트에 적용하기

```jsx
import { useContext, createContext } from "react";

const UserInfo = createContext({ name: "gary", id: "garyIsFree" });

const App = () => {
  return (
    <HelloLicat/>
  );
};

// const HelloLicat = () => {
//   return (
//     <UserInfo.Consumer>
//       {(value) => (
//         <div>
//           <input type="text" />
//           <h2>{value.name}</h2>
//           <strong>{`@ ${value.id}`}</strong>
//         </div>
//       )}
//     </UserInfo.Consumer>
//   );
// };

const HelloLicat = () => {
  const { name, id } = useContext(UserInfo);
  return (
    <div>
      <h2>{name}</h2>
      <strong>{id}</strong>
      <HelloLicatTwo/>
    </div>
  );
};

const HelloLicatTwo = () => {
  const { name, id } = useContext(UserInfo);
  return (
    <div>
      <h2>{name}</h2>
      <strong>{id}</strong>
    </div>
  );
};

export default App;
```

Context는 props가 아닌 전역으로 전달하기 때문에 부모에서 자식으로(부모 → 자식) 흐름의 전달 없이도 편하게 값을 전달할 수 있습니다. 그래서 Context를 사용하는 이유는 프로젝트의 컴포넌트 구조가 복잡해지면서 props로 전달하는데 한계가 있기 때문입니다. 하지만 props로의 전달로 충분히 가능하다면 Context를 사용하여 전역으로 전달할 필요가 없습니다. 

<aside>
💡 리덕스를 사용하는 이유와 Context를 사용하는 이유가 비슷합니다. **[3. 참고할만한 자료]**에서 2개의 차이점에 대한 아티클이 있으니 참고바랍니다. (아직 리덕스를 배우지 않아서 차이점은 리덕스 파트에서 설명하도록 하겠습니다.)

</aside>

# 3. 파일이 분리되어 있을 경우

파일이 분리되었을 경우에는 별도의 `context.jsx`파일을 만들어 필요로 하는 곳에서 import 하게 합니다.

```jsx
import { createContext } from "react";

export const UserInfo = createContext({ name: "gary", id: "garyIsFree" });
```

```jsx
import { useContext } from "react";
import { UserInfo } from './context'

const HelloLicatTwo = () => {
    const { name, id } = useContext(UserInfo);
    return (
      <div>
        <h2>{name}</h2>
        <strong>{id}</strong>
      </div>
    );
  };

export default HelloLicatTwo
```

```jsx
import React, { createContext, useContext } from "react";
import HelloLicatTwo from './HelloLicatTwo'

const UserInfo = createContext({ name: "gary", id: "garyIsFree" });

const App = () => {
  return (
    <HelloLicat/>
  );
};

const HelloLicat = () => {
  const {name, id} = useContext(UserInfo)
  return (
        <>
          <h2>{id}</h2>
          <strong>{name}</strong>
          <HelloLicatTwo/>
        </>
  );
};

export default App;
```

실습1 :

간단한 장바구니 컴포넌트를 만들어 봅니다.

상품목록의 내용을 내 장바구니에 추가하거나,
장바구니의 항목을 삭제 할 수 있습니다.

```jsx
const products = [
    { id: 1, name: "노트북", price: 1000 },
    { id: 2, name: "스마트폰", price: 500 },
    { id: 3, name: "태블릿", price: 300 },
];
```

상품목록의 정보는 context에서 관리합니다.

제거 버튼을 누르면 수량에 관계없이 해당 품목 전체가 삭제됩니다.

![스크린샷 2024-08-27 오후 1.23.23.png](%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2024-08-27_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_1.23.23.png)

![스크린샷 2024-08-27 오후 1.23.39.png](%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2024-08-27_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_1.23.39.png)

실습2: 

```jsx
const languages = {
    en: {
        title: "Multi-language App",
        greeting: "Hello, welcome to our app!",
        description: "This app supports multiple languages.",
        languageSelector: "Select Language:"
    },
    ko: {
        title: "다국어 앱",
        greeting: "안녕하세요, 우리 앱에 오신 것을 환영합니다!",
        description: "이 앱은 여러 언어를 지원합니다.",
        languageSelector: "언어 선택:"
    },
    ja: {
        title: "多言語アプリ",
        greeting: "こんにちは、私たちのアプリへようこそ！",
        description: "このアプリは複数の言語をサポートしています。",
        languageSelector: "言語を選択："
    }
};
```

위와 같은 데이터를 이용해 다국어 앱을 만들어보겠습니다. 

언어 데이터와 현재 언어 상태는 context를 통해 관리해야 합니다.

작동 방식은 아래와 같습니다.

언어 선택 버튼을 누르면 해당 언어로 컨텐츠가 변경됩니다.

![스크린샷 2024-11-04 오전 9.58.22.png](%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2024-11-04_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_9.58.22.png)

![스크린샷 2024-11-04 오전 9.58.31.png](%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2024-11-04_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_9.58.31.png)

![스크린샷 2024-11-04 오전 9.58.27.png](%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2024-11-04_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_9.58.27.png)