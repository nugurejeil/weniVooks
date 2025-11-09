# 5.3.1.2 Figma Dev Mode MCP를 Claude Code에 활용하기

# 1. Figma 디자인이 있다면

Figma MCP를 활용하면 내 디자인을 빠르게 HTML, CSS 코드로 변환할 수 있습니다. (Figma 유료 구독 필요)

[Dev Mode MCP 서버 안내서](https://help.figma.com/hc/ko/articles/32132100833559-Dev-Mode-MCP-%EC%84%9C%EB%B2%84-%EC%95%88%EB%82%B4%EC%84%9C)

## **1.1 MCP란 무엇인가**

MCP는 쉽게 말해 AI에게 실제 작업을 시킬 수 있게 해주는 통로입니다. 

요즘 AI는 정말 똑똑합니다. 글도 잘 쓰고 요약도 잘합니다. 그런데 **현실의 작업**은 못합니다. 예를 들어서

- **"내 휴가 일정 등록해줘"**
- **"내 컴퓨터에서 OO파일 열어봐"**
- **"내 이번달 매출을 엑셀로 정리해줘"**

이런 것들은 할 수 없습니다. AI가 실제 컴퓨터나 프로그램을 조작할 수 없기 때문입니다.

그러나 MCP가 나오면서 이런 것들이 가능해졌습니다.

> *사람: “오늘 누구 휴가야?”*
> 
> 
> *AI: (휴가 관리 시스템에 직접 접속해서 확인하고 알려줌)*
> 

> *사람: “이 자료 PDF로 바꿔줘!”*
> 
> 
> *AI: (파일을 불러오고 변환해서 저장까지 함)*
> 

![5.3.1.2-1](5%203%201%202%20Figma%20Dev%20Mode%20MCP%EB%A5%BC%20Claude%20Code%EC%97%90%20%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0/ChatGPT_Image_2025%EB%85%84_4%EC%9B%94_8%EC%9D%BC_%EC%98%A4%ED%9B%84_02_14_30.png)

5.3.1.2-1

개발자 입장에서 보면, 기존에는 AI에게 명령을 시키려면 복잡한 과정이 필요했습니다. 자연어를 분석하고 코드와 매핑하고 API를 만들고 연결하고... MCP는 이 연결 과정을 표준화합니다. 개발자는 "무슨 일을 시킬지"에만 집중하면 됩니다.

## 1.2 Figma MCP란

Figma MCP는 Figma와 AI가 직접 대화할 수 있게 해주는 다리입니다.

**"이 화면 전체를 React로 만들어줘"**

→ AI가 Figma 화면을 보고 완성된 React 코드 생성

**"우리 회사 디자인 시스템 컴포넌트 써서 만들어줘"**

→ 기존 컴포넌트를 재활용해서 일관성 있는 코드 생성

**"이 디자인에 쓰인 색깔이랑 폰트 정보 다 뽑아줘"**

→ 디자인 토큰을 자동으로 정리해서 제공

**"모바일 버전으로도 만들어줘"**

→ 반응형 코드까지 자동 생성

# 2. MCP 연결 방법

## 2.1 Figma app 설정

Figma Dev Mode MCP 기능을 활용하려면 Figma 데스크톱 앱이 필요합니다. (최신 버전으로 업데이트 필수)

1. Figma 앱을 실행합니다
2. 디자인 파일 내에서 '개발자 모드'를 실행합니다
3. `Main menu > Preferences > Enable Dev Mode MCP server` 체크하여 MCP를 활성화합니다
    
    ![5.3.1.2-2](5%203%201%202%20Figma%20Dev%20Mode%20MCP%EB%A5%BC%20Claude%20Code%EC%97%90%20%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0/image.png)
    
    5.3.1.2-2
    

## 2.2 Claude Code 설정

Figma Dev Mode 확장 프로그램을 사용하려면 코드 편집기가 필요합니다. (VS Code, Cursor, Windsurf, Claude Code 중 선택) 우리는 Claude Code와 Figma MCP를 연결할 것입니다.

터미널에서 다음 명령어를 입력합니다.

```jsx
claude mcp add --transport sse figma-dev-mode-mcp-server http://127.0.0.1:3845/sse
```

설치 확인을 위해 다음 명령어를 입력합니다.

```jsx
claude mcp list
```

`figma-dev-mode-mcp`가 나타나면 성공적으로 추가된 것입니다.

![5.3.1.2-3](5%203%201%202%20Figma%20Dev%20Mode%20MCP%EB%A5%BC%20Claude%20Code%EC%97%90%20%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0/image%201.png)

5.3.1.2-3

# 3. Figma 디자인 변환 요청하기

## 3.1 기본 변환 과정

- Figma '개발자 모드'에서 변환하고 싶은 프레임을 선택합니다
    
    ![5.3.1.2-4 개발자 모드에서 프레임 요소 선택](5%203%201%202%20Figma%20Dev%20Mode%20MCP%EB%A5%BC%20Claude%20Code%EC%97%90%20%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0/image%202.png)
    
    5.3.1.2-4 개발자 모드에서 프레임 요소 선택
    
- Claude Code에서 명령어를 입력합니다:
    
    ```jsx
    내 Figma 선택 항목을 일반 HTML + CSS로 생성해줘
    ```
    
    ![5.3.1.2-5 Claude Code에서 명령어 작성](5%203%201%202%20Figma%20Dev%20Mode%20MCP%EB%A5%BC%20Claude%20Code%EC%97%90%20%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0/image%203.png)
    
    5.3.1.2-5 Claude Code에서 명령어 작성
    
- Claude Code가 선택한 디자인을 HTML, CSS로 변환해줍니다.
    
    ![5.3.1.2-6 선택한 Figma 디자인 요소](5%203%201%202%20Figma%20Dev%20Mode%20MCP%EB%A5%BC%20Claude%20Code%EC%97%90%20%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0/image%204.png)
    
    5.3.1.2-6 선택한 Figma 디자인 요소
    

![5.3.1.2-7 Claude Code가 변환한 결과물](5%203%201%202%20Figma%20Dev%20Mode%20MCP%EB%A5%BC%20Claude%20Code%EC%97%90%20%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0/image%205.png)

5.3.1.2-7 Claude Code가 변환한 결과물

## **3.2 추가 작업 요청**

변환된 코드에 추가 작업을 요청할 수 있습니다.

```jsx
변환한 디자인 유지하고 반응형 적용해줘
```

```jsx
각 버튼 요소에 호버 애니메이션 자연스럽게 추가해줘
```

# **4. 팁과 주의사항**

- **아이콘과 로고 처리**
    
    아이콘이나 로고를 SVG로 저장하는 기능은 아직 불안정합니다. 직접 저장하는 것을 권장합니다.
    
- **복잡한 디자인 처리**
    
    선택한 프레임에 디자인 요소가 너무 많으면 변환이 제대로 되지 않습니다. 긴 랜딩페이지나 복잡한 디자인은 섹션별로 분할해서 작업하는 것이 효과적입니다.
    
- **권장 작업 방식**
    1. 한 번에 하나의 섹션만 선택
    2. 간단한 컴포넌트부터 시작
    3. 점진적으로 복잡한 요소 추가

<aside>
📕

### 추천도서

MCP 활용법을 더 자세히 알고 싶다면?

「10분 만에 따라 하는 Claude MCP 업무 자동화 혁신 가이드」 - 이호준

[10분 만에 따라 하는 Claude MCP 업무 자동화 혁신 가이드 - 예스24](https://www.yes24.com/product/goods/148173979)

</aside>