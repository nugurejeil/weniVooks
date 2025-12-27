# 24. React 19 업데이트 가이드

---

리액트 18 버전이 2022/3/29 부터 본격적으로 지원을 시작했고 이제 2024/12/5부터 리액트 19버전이 정식으로 사용될 수 있음이 발표되었습니다. 기존 버전에서 어떠한 점들이 변화되었는지 살펴봅시다.

# Part 1: React 19의 소소한 변화들

## 🔄 Context Provider 문법 개선

### 🤔 무엇이 바뀌었나요?

React 19에서는 Context를 사용할 때 `.Provider`를 붙이지 않아도 됩니다. Context 자체를 컴포넌트처럼 직접 사용할 수 있게 되었습니다.

### 📝 코드 비교

**이전 (React 18)**

```jsx
import { ThemeContext } from './ThemeContext';

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Component />
    </ThemeContext.Provider>
  );
}

```

**현재 (React 19)**

```jsx
import { ThemeContext } from './ThemeContext';

function App() {
  return (
    <ThemeContext value="dark">
      <Component />
    </ThemeContext>
  );
}

```

### ✨ 왜 좋은가요?

- **코드가 더 간결해집니다** - 불필요한 `.Provider` 제거
- **일관성 있는 API** - 다른 React 컴포넌트와 동일한 방식으로 사용
- **타이핑 감소** - 특히 여러 Context를 중첩해서 사용할 때 효과적

---

## 🏷️ Document Metadata 지원

### 🤔 이게 뭔가요?

이제 React 컴포넌트 내에서 `<title>`, `<link>`, `<meta>` 태그를 직접 사용할 수 있습니다. 이전에는 react-helmet 같은 외부 라이브러리가 필요했지만, 이제 React가 기본으로 지원합니다.

```tsx
// ❌ 이렇게 하면 작동하지 않았습니다 (React 18 이전)
function BlogPost({ title, description }) {
  return (
    <div>
      <title>{title}</title>  {/* 이게 head에 들어가지 않음! */}
      <meta name="description" content={description} />  {/* 이것도 안됨! */}
      
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
```

### react-helmet 사용법

문서 head에 들어가는 정보를 관리해주는 라이브러리입니다.

[npm: react-helmet](https://www.npmjs.com/package/react-helmet)

```tsx
import { Helmet } from 'react-helmet';

function BlogPost({ title, description, image }) {
  return (
    <div>
      <Helmet>
        {/* 페이지 제목 */}
        <title>{title} | 내 블로그</title>
        
        {/* SEO 메타 태그 */}
        <meta name="description" content={description} />
        
        {/* Open Graph 태그 (SNS 공유) */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        
        {/* 기타 head 태그들 */}
        <link rel="canonical" href={`https://myblog.com/posts/${id}`} />
      </Helmet>
      
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
```

### 📝 실제 사용 예시

```jsx
function BlogPost({ post }) {
  return (
    <>
      {/* 페이지 제목 설정 */}
      <title>{post.title} | 내 블로그</title>

      {/* SEO를 위한 메타 태그 */}
      <meta name="description" content={post.excerpt} />
      <meta name="keywords" content={post.tags.join(', ')} />

      {/* Open Graph 태그 (SNS 공유 시 미리보기) */}
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:image" content={post.thumbnail} />

      {/* 정규 URL 설정 */}
      <link rel="canonical" href={`https://myblog.com/posts/${post.id}`} />

      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </>
  );
}

```

### ✨ 왜 좋은가요?

- **외부 라이브러리 불필요** - react-helmet 등이 필요 없음
- **컴포넌트별 SEO 최적화** - 각 페이지/컴포넌트마다 고유한 메타데이터 설정 가능 ([https://www.notion.so/paullabworkspace/SEO-196ebf76ee8a819f8f49cb55b3d56b32](https://www.notion.so/SEO-196ebf76ee8a819f8f49cb55b3d56b32?pvs=21))
- **동적 메타데이터 관리 용이** - props나 state에 따라 동적으로 변경 가능

### 💡 실무 팁

```jsx
// 재사용 가능한 SEO 컴포넌트 만들기
function SEO({ title, description, image }) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
    </>
  );
}

```

---

# Part 2: 새롭게 추가된 훅

## 📋 useActionState

`useActionState`는 폼 제출이나 비동기 액션의 상태를 관리하는 훅입니다. 로딩 상태, 에러 처리, 성공/실패 메시지를 쉽게 관리할 수 있습니다.

사용 예시를 보기 전에 우선 로그인 컴포넌트를 하나 만들어봅니다.

실습:

아래와 같은 컴포넌트를 만들어주세요. 그리고 로그인 버튼을 누르면 서밋 이벤트가 호출되며 사용자가 아이디와 비밀번호를 모두 작성하였는지 예외처리를 해야합니다.
초기화 버튼을 누르면 input 안의 내용이 모두 지워집니다.

![스크린샷 2025-05-30 오전 12.19.26.png](%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2025-05-30_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_12.19.26.png)

### 📝 `useActionState`사용 예시

```jsx
import { useActionState } from 'react';

function ContactForm() {
  // useActionState 사용
  // state - 현재 상태, formAction - 폼 액션 함수, isPending - 로딩 상태 (boolean)
  const [state, formAction, isPending] = useActionState(
    
    // previousState: 이전 상태값 
    // formData: 폼에서 제출된 데이터 (FormData 객체)
    async (previousState, formData) => {

      // 1. formData에서 값 추출
      // formAction 함수를 사용하면 자동으로 formData객체를 통해 form에서 입력받은 데이터에 접근이 가능합니다.
      // preventDefault 불필요
      const email = formData.get('email');
      const message = formData.get('message');

      try {
        // 2. API 호출
        const response = await fetch('/api/contact', {
          method: 'POST',
          body: JSON.stringify({ email, message }),
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('전송 실패');

        // 3. 성공 시 새로운 상태(state) 반환
        return { success: true, message: '메시지가 전송되었습니다!' };
      } catch (error) {
        // 4. 실패 시 에러 상태(state) 반환
        return { success: false, message: error.message };
      }
    },
    { success: false, message: '' } // 초기 상태
  );

  return (
    // formAction 함수 연결
    // isPending 값은 비동기 상태에 따라 true 혹은 false로 자동 관리됩니다.
    <form action={formAction} className="contact-form">
      <div className="form-group">
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={isPending}
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">메시지</label>
        <textarea
          id="message"
          name="message"
          required
          disabled={isPending}
        />
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? '전송 중...' : '전송하기'}
      </button>

      {/* 상태 메시지 표시 */}
      {state.message && (
        <div className={`message ${state.success ? 'success' : 'error'}`}>
          {state.message}
        </div>
      )}
    </form>
  );
}
```

### ✨ 왜 좋은가요?

- useState, useEffect 등 여러 훅을 조합할 필요 없음
- **자동 로딩 상태 관리** - isPending으로 로딩 상태 자동 추적
- **폼과의 자연스러운 통합** - HTML 폼의 action 속성과 함께 사용

실습 : 

위에서 만들었던 컴포넌트를 `useActionState`를 이용하여 개선해 주세요.

---

## 🔗 use

`use`는 Promise나 Context를 읽을 수 있는 특별한 훅입니다. 다른 훅들과 달리 조건문 안에서도 사용할 수 있다는 것이 특징입니다.

### 📝 실제 사용 예시

```jsx
import { use, Suspense, useState } from 'react';

// 가짜 API 함수 (실제 동작)
function fetchUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = {
        1: { id: 1, name: '김철수', age: 25, job: '개발자' },
        2: { id: 2, name: '이영희', age: 30, job: '디자이너' },
        3: { id: 3, name: '박민수', age: 28, job: '기획자' }
      };
      resolve(users[userId] || { id: userId, name: '알 수 없음', age: 0, job: '없음' });
    }, 1000); // 1초 지연
  });
}

// 사용자 프로필 컴포넌트
function UserProfile({ userPromise }) {
  // use 훅으로 Promise 처리
  const user = use(userPromise);

  return (
    <div>
      <h3>👤 사용자 정보</h3>
      <p><strong>이름:</strong> {user.name}</p>
      <p><strong>나이:</strong> {user.age}세</p>
      <p><strong>직업:</strong> {user.job}</p>
    </div>
  );
}

// 메인 앱 컴포넌트
function App() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userPromise, setUserPromise] = useState(null);

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    // Promise 생성
    setUserPromise(fetchUser(userId));
  };

  const handleReset = () => {
    setSelectedUserId(null);
    setUserPromise(null);
  };

  return (
    <div>
      <h2>🔥 React use 훅 데모</h2>
      
      {/* 사용자 선택 버튼들 */}
      <div>
        <h3>사용자를 선택하세요:</h3>
        <button onClick={() => handleUserSelect(1)}>
          김철수 (ID: 1)
        </button>
        <button onClick={() => handleUserSelect(2)}>
          이영희 (ID: 2)
        </button>
        <button onClick={() => handleUserSelect(3)}>
          박민수 (ID: 3)
        </button>
        <button onClick={handleReset}>
          초기화
        </button>
      </div>

      {/* 선택된 사용자 ID 표시 */}
      <div>
        <p>선택된 사용자 ID: {selectedUserId || '없음'}</p>
      </div>

      {/* 사용자 프로필 표시 */}
      {userPromise ? (
        <Suspense fallback={<div>⏳ 사용자 정보 로딩 중...</div>}>
          <UserProfile userPromise={userPromise} />
        </Suspense>
      ) : (
        <div>
          <p>👆 위에서 사용자를 선택해주세요!</p>
        </div>
      )}
    </div>
  );
}

export default App;
```

### ✨ 왜 좋은가요?

- **조건부 사용 가능** - 다른 훅과 달리 if문 안에서 사용 가능
    
    [Rules of Hooks – React](https://react.dev/reference/rules/rules-of-hooks)
    
- **Promise 직접 처리** - async/await 없이 Promise 값을 직접 읽음
- **Suspense와 자연스러운 통합** - 로딩 상태를 Suspense가 처리
    - **Suspense**는 React에서 **로딩 상태를 처리하는 특별한 컴포넌트**입니다. 컴포넌트가 뭔가 기다리고 있으면 이를 자동으로 감지하여 기다리는 동안 fallback UI 를 랜더링합니다.
- **더 유연한 데이터 페칭** - 조건에 따라 다른 데이터 소스 사용 가능

### 💡 실습:

아래 코드를 Use 를 통해 개선해 보세요

```jsx
import { useState, useEffect } from 'react';

function fetchTodo(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const todos = {
        1: { id: 1, title: '리액트 공부하기', done: false },
        2: { id: 2, title: '운동하기', done: true },
        3: { id: 3, title: '책 읽기', done: false }
      };
      resolve(todos[id]);
    }, 1000);
  });
}

function TodoApp() {
  const [selectedId, setSelectedId] = useState(null);
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    
    setLoading(true);
    fetchTodo(selectedId)
      .then(data => {
        setTodo(data);
        setLoading(false);
      });
  }, [selectedId]);

  return (
    <div>
      <h2>할 일 앱</h2>
      <button onClick={() => setSelectedId(1)}>할 일 1</button>
      <button onClick={() => setSelectedId(2)}>할 일 2</button>
      <button onClick={() => setSelectedId(3)}>할 일 3</button>
      
      {loading && <p>로딩 중...</p>}
      {todo && !loading && (
        <div>
          <h3>{todo.title}</h3>
          <p>상태: {todo.done ? '완료' : '미완료'}</p>
        </div>
      )}
    </div>
  );
}
```

---