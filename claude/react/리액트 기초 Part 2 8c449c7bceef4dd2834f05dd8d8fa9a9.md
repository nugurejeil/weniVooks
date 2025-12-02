# 리액트 기초 Part.2

# 이미지 검색 애플리케이션 만들기

이번에 만들어 볼것은 오픈 API를 이용한 이미지검색 애플리케이션입니다

이를 위해서

1. 검색바
2. 이미지 리스트
3. 이미지

세 가지 컴포넌트를 만들고 Ajax 통신과 컴포넌트간에 데이터를 주고받는 방법을 알아봅니다.

## 1. npx create-react-app imgsearch

```bash
npx create-react-app imgsearch
```

1. 리액트 프로젝트를 생성하고 src 폴더안의 내용을 모두 삭제합니다.
2. components 폴더를 만들고 ListImg.js, ItemImg.js, SearchBar.js 파일을 생성합니다.
3. App.js 파일을 만들고 아래의 코드를 작성합니다. 작성한 코드를 ListImg.js, ItemImg.js, SearchBar.js 파일에 붙여넣습니다. App 을 각각 파일의 이름으로 수정합니다.
    
    ```jsx
    function App() {
    	return <div>App</div>
    }
    
    export default App;
    ```
    
    ```jsx
    function ListImg() {
    	return <div>ListImg</div>
    }
    
    export default ListImg;
    ```
    
    ```jsx
    function ItemImg() {
    	return <div>ItemImg</div>
    }
    
    export default ItemImg;
    ```
    
    ```jsx
    function SearchBar() {
    	return <div>SearchBar</div>
    }
    
    export default SearchBar;
    ```
    
4. index.js 파일을 생성하고 코드를 추가합니다.
    
    ```jsx
    import React from 'react';
    import ReactDom from 'react-dom/client';
    import App from './App';
    
    const el = document.getElementById('root');
    const root = ReactDom.createRoot(el);
    
    root.render(<App />);
    ```
    

## 2. Unsplash API

우리가 사용할 API는 Unsplash API 입니다.(https://unsplash.com/)

사진작가들이 직접 촬영한 수백만개의 사진을 무료로 다운로드 받을 수 있는 사이트입니다. 단, 다운받은 사진을 상업적 용도로 판매할 수는 없습니다.

https://unsplash.com/developers 사이트에 접속해서 가입하면 API를 이용할 수 있습니다.

1. 회원가입을 합니다.
2. 새로운 application을 생성합니다.
3. 생성하고 아래로 스크롤을 내리면 access key 가 보입니다. access key는 언스플레쉬에 요청을 보낼때 항상 사용해야하며 요청하는 대상이 누군지 증명해주는 역할을 합니다.
4. Documentation 메뉴로 가서 여러 내용을 확인합니다.
    1. Schema 의 Location 정보 : 루트 api 주소를 알 수 있습니다.
    2. Authorization 의 public authentication : 요청할 헤더에 담아야할 정보를 확인합니다.
    3. Search 의 Search photos : 사진을 요청하는데 사용할 쿼리를 확인합니다.

## 3. Axios

Axios는 서버와 클라이언트 사이의 통신을 좀 더 쉽게 할 수 있도록 도와주는 라이브러리입니다. (https://axios-http.com/kr/docs/intro)

1. Axios 를 사용하기 위해 설치합니다. 

```bash
npm i axios
```

<aside>
💡 **http 통신 메서드**

Get : 서버에 데이터를 요청합니다.

Post : 서버에 새로운 데이터를 생성할 것을 요청합니다.

Put : 기존의 데이터를 전부 업데이트 합니다.

Patch : 기존의 데이터를 부분적으로 업데이트 합니다.

Del : 데이터를 삭제합니다.

</aside>

1. imgApi.js 파일을 생성해서 통신을 해보도록 합니다. 코드를 작성합니다.

```jsx
import axios from 'axios';

const searchImg = async () => {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
        headers: {
            Authorization: 'Client-ID {사용자의 access 키}'
        },
        params: {
            query: 'flowers'
        }
    });
    console.log(response);

    return response
}

export default searchImg;
```

1. App.js 안에 searchImg를 import 시켜 데이터가 잘 들어오는지 확인합니다.

```jsx
import searchImg from './imgApi';

searchImg();

function App() {
    return <div>App</div>
}

export default App;
```

1. 확인이 끝났으면 searchImg 함수를 수정합니다.
    1. keyword 매개변수를 추가합니다.
    2. response 의 결과물로 이미지의 배열만 담도록 합니다.

```jsx
const searchImg = async (**keyword**) => {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
        headers: {
            Authorization: 'Client-ID {사용자의 access 키}'
        },
        params: {
            query: **keyword**
        }
    });

    return response.**data.results**
}
```

## 4. Props 응용

<aside>
💡 생각해봅시다. searchImg 함수는 어떤 컴포넌트에서 사용해야 할까요?

1. SearchBar컴포넌트는 우리가 찾을 이미지의 키워드를 가지고 있을겁니다.
2. ListImg 컴포넌트는 ItemImg 컴포넌트들을 자식으로 하기 때문에 이미지들의 정보가 필요합니다.
3. 그렇다면 SearchBar에서 키워드 값을 이용해 searchImg을 실행시키고 그 값을 ListImg로 전달하면 될까요?
4. 하지만 리엑트에서 형제 컴포넌트끼리의 직접적인 엑세스는 불가능합니다.
5. 때문에 형제 컴포넌트의 상위 컴포넌트인 App 컴포넌트를 이용할겁니다. App 컴포넌트에서 searchImg함수를 실행하고 결과값을 얻으면 자식인 ListImg에 Props를 통해 데이터를 전달하면 됩니다. 그렇다면 SearchBar에서 사용한 키워드 값은 어떻게 App으로 이동할 수 있을까요? Props 는 부모에서 자식의 방향으로만 작동한다고 배웠습니다.
6. 그것은 완전히 맞는 말은 아닙니다. 우리가 다뤘던 코드를 생각해보겠습니다. 여기서 input 태그도 사실 하나의 컴포넌트로 사용되며 InputTest 의 자식 컴포넌트지만 onChange 함수를 통해 setInp 함수를 호출함으로서 부모의 inp 값에 영향을 주고 있습니다
    
    ```jsx
    function InputTest() {
    	const [inp, setInp] = useState('write some text');
    
     	return (
    	<>
    		<p>{inp}</p>
    		<input type=“text” value={inp} onChange={(e) => {
    			setInp(e.target.value)
    		}}/>
    	</>
    	);
    }
    
    export default InputTest;
    ```
    
7. 이러한 성질은 우리가 앞서 state 끌어올리기 시간에 배운적이 있습니다.(https://www.notion.so/paullabworkspace/state-lifting-state-up-a0dc79c680db4a29a973cd0316ce040b) state 끌어올리기는 컴포넌트간 공통적으로 관리하는 데이터를 만들기위해 사용하는 기술이라고 볼 수 있습니다. 여기서는 그 테크닉 중에 부모 컴포넌트로 데이터를 보내는 부분만 사용한 것입니다.
</aside>

1. App.js 에 SearchBar 를 import 하여 자식 컴포넌트로 설정하고 함수를 전달하겠습니다.

```jsx
import SearchBar from "./components/SearchBar";

function App() {
    const handleKeyword = (keyword) => {
        // api 실행!
        console.log('keyword : ', keyword);
    }

    return <div>
        App
        <SearchBar searching={handleKeyword} />
    </div>
}

export default App;
```

1. SearchBar.js 의 코드를 수정해서 부모로부터 전달받은 handleKeyword  함수를 사용하도록 만듭니다. 그리고 버튼을 클릭했을 때 함수가 잘 호출되는지 확인해 봅니다.

```jsx
function SearchBar( { searching } ) {

    const handleSubmit = () => {
        searching();
    }

    return (
		<nav>
				<label htmlFor="keyword">검색어를 입력하세요 : </label>
        <input type="text" id="keyword" />
        <button onClick={handleSubmit}>검색</button>
    </nav> 
	)
}

export default SearchBar;
```

1. 사용자 편의성을 위해 엔터키를 눌렀을 때도 handleSubmit 함수가 호출되도록 만들어 봅니다. 그리고 input의 값을 전달할 수 있도록 state 시스템을 사용합니다.

```jsx
function SearchBar({ searching }) {

    const [keyword, setKeyword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        searching(keyword);
    }

    return <nav>
        <form onSubmit={handleSubmit}>
            <label htmlFor="keyword">검색어를 입력하세요 : </label>
            <input type="text" id="keyword" value={keyword} onChange={handleInp} />
            <button>검색</button>
        </form>
    </nav>
}

export default SearchBar;
```

1. App.js 의 handleKeyword 함수를 수정해서 api 에 검색어가 전달되도록 하고 네트워크 탭에서 결과를 확인합니다.

```jsx
import SearchBar from "./components/SearchBar";
import searchImg from "./imgApi";

function App() {

    const handleKeyword = (keyword) => {
        // api 실행!
        console.log('keyword : ', keyword);

        const result = searchImg(keyword);
        console.log(result);
    }

    return <div>
        App
        <SearchBar searching={handleKeyword} />
    </div>
}

export default App;
```

1. 개발자 화면의 네트워크 탭을 열고 Fetch/XHR 탭을 선택 => Preview 탭을 선택하여 데이터가 들어오고 있는지 확인해봅시다.
    
    ![Untitled](Untitled%2082.png)
    
    데이터가 잘 들어오는것을 확인했습니다. 하지만 console.log(result); 코드를 통해 확인한 결과는 아래 이미지와 같습니다.
    
    ![Untitled](Untitled%2083.png)
    
    콘솔을 통해 Pending 상태의 프로미스 객체가 반환된것을 확인할 수 있습니다. pending 은 아직 통신이 시작되지 않은 상태를 의미합니다. ([https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise#설명](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise#%EC%84%A4%EB%AA%85))
    그 이유는 우리가 searchImg 함수가 완전히 끝날 때 까지 기다려 주지 않았기 때문입니다. 따라서 여기서도 async, await 문법을 사용합니다.
    
    ```jsx
    ...
    const handleKeyword = **async** (keyword) => {
        // api 실행!
        console.log('keyword : ', keyword);
    
        const result = **await** searchImg(keyword);
        console.log(result);
    }
    ...
    ```
    
    이제 제대로된 결과 값이 출력되는것을 확인할 수 있습니다.
    

1. 이제 API를 통해 전달 받은 값을 ListImg.js 로 보내면 됩니다. 그리고 만약 또 다른 이미지를 검색했을 때 새로운 이미지들로 화면을 업데이트 하기 위해서 state 시스템을 이용할것 입니다. state 가 업데이트 되면 해당 값을 이용하는 컴포넌트가 업데이트 되기 때문입니다.
    
    ```jsx
    function App() {
        **const [images, setImages] = useState([]);**
    
        const handleKeyword = async (keyword) => {
    
            const result = await searchImg(keyword);
    
            **setImages(result);**
        }
    
        return <div>
            App
            <SearchBar searching={handleKeyword} />
            <ListImg images={images} />
        </div>
    }
    ```
    

1. 이제 ListImg.js 파일도 수정하겠습니다. App.js로부터 전달받은 배열을 map 메소드를 이용해 새로운 배열로 반환합니다.
    
    ```jsx
    import ItemImg from "./ItemImg";
    
    function ListImg({ images }) {
        const renderImages = images.map((image) => {
            return <ItemImg image={image} />
        });
    
        return <ul>{renderImages}</ul>
    }
    
    export default ListImg;
    ```
    

1. ItemImg.js 에 전달받는 데이터의 id 값을 확인해 데이터가 잘 들어오는지 확인하겠습니다.
    
    ```jsx
    function ItemImg({ image }) {
        return <li>{image.id}</li>
    }
    
    export default ItemImg;
    ```
    
    데이터가 잘 들어오는 것을 확인한 후, 콘솔창을 열어보면 아래와 같은 에러를 보여줍니다.
    
    ![Untitled](Untitled%2084.png)
    
    왜 이런 에러가 뜨는지 리마인드 해봅시다. 생각나시나요?
    
    요소를 업데이트 할때 사용할 수 있는 방법은 뭐가 있을까요?
    
    1. 존재하던 요소를 모두 삭제하고 새롭게 모두 만드는 것 입니다. 개발자 입장에서는 이 편이 하기 쉽지만 컴퓨터 입장에서는 자원이 많이 소모되는 일입니다.
    2. 기존의 요소들을 기억하고 새로운 변경 사항만 적용합니다.
    
    리액트는 컴포넌트가 업데이트되어 다시 랜더링 될때 컴포넌트의 키 값을 기준으로 랜더링 로직을 최적화 합니다. 키 값이 없다면 업데이트 되는 모든 컴포넌트를 전부 삭제하고 다시 랜더링 하는 수 밖에 없기 때문에 처리 비용이 매우 높습니다.
    

<aside>
💡 **키 props 사용시 유의사항**

1. 키의 값은 반드시 문자열 혹은 숫자형 데이터를 사용해야합니다.
2. 한 리스트 안에서만 유니크 하면 됩니다. 한 페이지 안에 여러 리스트 컴포넌트가 존재한다고 해도 각각의 리스트 안에서 유니크 하다면, 다른 리스트의 아이디와 겹쳐도 괜찮습니다.
3. 아이디 값은 항상 불변해야합니다. 만약 매번 새로운 아이디 값을 맵핑한다면 리액트는 아이디 값이 바뀔때마다 새로 컴포넌트를 랜더링 하게됩니다. 
    
    ```jsx
    key={Math.random()}
    ```
    
4. 인덱스 값을 넣어도 에러를 제거할 수 있지만, 리스트의 위치라 바뀌거나 새로운 리스트 아이템이 추가되면 인덱스 순서가 바뀌기 때문에 권장되지 않습니다. 사실 여러분이 key 값을 설정하지 않는다면 리액트가 자동으로 이런 작업을 합니다.(https://beta.reactjs.org/learn/rendering-lists)
    
    ```jsx
    const renderImages = images.map((image, index) => {
        return <ItemImg key={index} image={image} />
    });
    ```
    

결론 : 사실 다이나믹하게 추가되거나 제거되는 컴포넌트는 대부분 서버로부터 데이터를 받아 랜더링 되는것이기 때문에 전달 받는 데이터에 기반한 ID 값을 사용하도록합시다. 정 필요하다면 반복문의 index 값으로 처리하도록 합니다. 리액트의 기본 동작이기 때문입니다.

</aside>

1. ListImg.js 에서 반환하는 ItemImg 컴포넌트에 전달받는 ID 값을 key로 설정합니다. 그리고 마지막 ItemImg.js 에 이미지 관련한 정보를 추가합니다.
    
    ```jsx
    function ListImg({ images }) {
        const renderImages = images.map((image) => {
            return <ItemImg **key={image.id}** image={image} />
        });
    
        return <ul>{renderImages}</ul>
    }
    ```
    
    ```jsx
    function ItemImg({ image }) {
        return <li><img src={image.urls.small} alt={image.alt_description} /></li>
    }
    
    export default ItemImg;
    ```