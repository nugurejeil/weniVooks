# Wenivooks PDF Export Tool

마크다운으로 작성된 Wenivooks 책을 출판용 PDF로 변환하는 도구입니다.

## 요구 사항

- Python 3.8 이상
- WeasyPrint 및 의존성 패키지

### Windows 추가 요구 사항

WeasyPrint는 GTK를 필요로 합니다. Windows에서는 다음 방법 중 하나를 선택하세요:

**방법 1: MSYS2 사용 (권장)**
```bash
# MSYS2 설치 후 MSYS2 터미널에서:
pacman -S mingw-w64-x86_64-pango mingw-w64-x86_64-gtk3
```

**방법 2: GTK3 런타임 설치**
- https://github.com/nicholasrq/weasyprint/releases 에서 GTK3 런타임 다운로드

### macOS

```bash
brew install pango gdk-pixbuf libffi
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get install libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf2.0-0 libffi-dev shared-mime-info
```

## 설치

```bash
cd pdf_export
pip install -r requirements.txt
```

## 사용법

### 대화형 모드 (책 목록에서 선택)

```bash
python export_pdf.py
```

실행하면 사용 가능한 책 목록이 표시되고, 번호를 입력하여 변환할 책을 선택할 수 있습니다.

### 직접 지정 모드

```bash
python export_pdf.py [책_폴더_이름]
```

예시:
```bash
python export_pdf.py basecamp-python
python export_pdf.py essentials-javascript
```

## 출력

생성된 PDF는 `pdf_export/output/` 폴더에 저장됩니다.

예: `pdf_export/output/basecamp-python.pdf`

## 기능

- **표지 이미지 지원**: bookInfo.js의 COVER 이미지를 첫 페이지에 표시
- **자동 목차 생성**: 챕터와 페이지 구조를 자동으로 목차로 생성
- **코드 하이라이팅**: 프로그래밍 언어별 문법 강조
- **이미지 포함**: 마크다운의 이미지가 PDF에 포함 (URL 인코딩된 경로 지원)
- **커스텀 디렉티브 지원**: `::img`, `::a`, `:::div` 등 Wenivooks 전용 문법 지원
- **앵커 태그 변환**: `::a` 링크를 PDF에서 읽기 쉬운 "텍스트: URL" 형식으로 변환
- **Mermaid 다이어그램**: Mermaid 코드 블록을 이미지로 변환 (mermaid-cli 필요)
- **출판 품질 스타일링**: A4 크기, 적절한 여백, 페이지 번호

## PDF 스타일 커스터마이징

`export_pdf.py` 파일 내의 `get_book_css()` 함수에서 CSS를 수정하여 스타일을 변경할 수 있습니다.

### 주요 스타일 옵션

- **페이지 크기**: `@page { size: A4; }` → `B5`, `Letter` 등으로 변경 가능
- **여백**: `@page { margin: 2cm 2.5cm; }` 조정
- **폰트**: `body { font-family: ... }` 에서 변경
- **색상 테마**: 각 요소의 `color`, `background-color` 수정

## 구조

```
pdf_export/
├── README.md           # 이 파일
├── requirements.txt    # Python 의존성
├── export_pdf.py       # 메인 변환 스크립트
├── output/             # PDF 출력 폴더 (자동 생성)
└── .mermaid_cache/     # Mermaid 이미지 캐시 (자동 생성)
```

## Mermaid 다이어그램 지원

Mermaid 코드 블록을 이미지로 변환하려면 mermaid-cli를 설치해야 합니다:

```bash
npm install -g @mermaid-js/mermaid-cli
```

설치 후 `mmdc` 명령어가 사용 가능해야 합니다. mermaid-cli가 설치되지 않은 경우 Mermaid 블록은 코드 텍스트로 표시됩니다.

## 알려진 제한 사항

1. **인터랙티브 코드 블록**: CodeMirror 에디터는 정적 코드 블록으로 변환됩니다
2. **동영상/iframe**: PDF에 포함되지 않습니다
3. **일부 특수 마크다운 문법**: 지원되지 않을 수 있습니다

## 문제 해결

### WeasyPrint 설치 오류

GTK 의존성이 설치되지 않은 경우 발생합니다. 위의 OS별 요구 사항을 확인하세요.

### 한글 폰트 깨짐

시스템에 한글 폰트가 설치되어 있어야 합니다:
- Windows: 맑은 고딕 (기본 설치)
- macOS: Apple SD Gothic Neo (기본 설치)
- Linux: `sudo apt-get install fonts-noto-cjk`

### 이미지가 표시되지 않음

이미지 경로가 `public/images/` 폴더에 있는지 확인하세요.
