#!/usr/bin/env python3
"""
Wenivooks PDF Export Tool
마크다운 책을 출판용 PDF로 변환하는 도구

사용법:
    python export_pdf.py                    # 대화형 모드로 책 선택
    python export_pdf.py basecamp-python    # 특정 책 직접 지정
"""

import os
import re
import sys
import glob
import yaml
import base64
import hashlib
import subprocess
import markdown
from pathlib import Path
from urllib.parse import unquote
from bs4 import BeautifulSoup
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

# 프로젝트 루트 경로
PROJECT_ROOT = Path(__file__).parent.parent
MD_DIR = PROJECT_ROOT / "_md"
PUBLIC_DIR = PROJECT_ROOT / "public"
OUTPUT_DIR = Path(__file__).parent / "output"
MERMAID_CACHE_DIR = Path(__file__).parent / ".mermaid_cache"


def get_book_list():
    """_md 폴더에서 사용 가능한 책 목록 가져오기"""
    books = []
    for folder in MD_DIR.iterdir():
        if folder.is_dir() and not folder.name.startswith('.'):
            # chapter 폴더가 있는지 확인
            chapters = list(folder.glob("chapter*"))
            if chapters:
                books.append(folder.name)
    return sorted(books)


def get_book_info(book_name):
    """bookInfo.js에서 책 정보 가져오기"""
    book_info_path = PROJECT_ROOT / "src" / "app" / book_name / "bookInfo.js"
    info = {
        "title": book_name,
        "description": "",
        "cover": None
    }

    if book_info_path.exists():
        content = book_info_path.read_text(encoding="utf-8")

        # TITLE 추출
        title_match = re.search(r"export const TITLE\s*=\s*['\"](.+?)['\"]", content)
        if title_match:
            info["title"] = title_match.group(1)

        # DESCRIPTION 추출
        desc_match = re.search(r"export const DESCRIPTION\s*=\s*['\"](.+?)['\"]", content, re.DOTALL)
        if desc_match:
            info["description"] = desc_match.group(1)

        # COVER 추출
        cover_match = re.search(r"export const COVER\s*=\s*['\"`](.+?)['\"`]", content)
        if cover_match:
            cover_path = cover_match.group(1)
            # 템플릿 리터럴 처리
            cover_path = cover_path.replace("${DEFAULT_PATH}", book_name)
            cover_path = re.sub(r'\$\{[^}]+\}', book_name, cover_path)
            info["cover"] = cover_path

    return info


def parse_frontmatter(content):
    """마크다운 파일에서 frontmatter 파싱"""
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            try:
                frontmatter = yaml.safe_load(parts[1])
                markdown_content = parts[2]
                return frontmatter, markdown_content
            except yaml.YAMLError:
                pass
    return {}, content


def render_mermaid_to_image(mermaid_code):
    """Mermaid 코드를 이미지로 변환 (mmdc CLI 사용)"""
    # 캐시 디렉토리 생성
    MERMAID_CACHE_DIR.mkdir(exist_ok=True)

    # 코드 해시로 캐시 파일명 생성
    code_hash = hashlib.md5(mermaid_code.encode()).hexdigest()
    cache_file = MERMAID_CACHE_DIR / f"{code_hash}.png"

    # 캐시에 있으면 바로 반환
    if cache_file.exists():
        return str(cache_file)

    # 임시 mmd 파일 생성
    temp_mmd = MERMAID_CACHE_DIR / f"{code_hash}.mmd"
    temp_mmd.write_text(mermaid_code, encoding="utf-8")

    try:
        # mmdc (mermaid-cli) 실행
        result = subprocess.run(
            ["mmdc", "-i", str(temp_mmd), "-o", str(cache_file), "-b", "transparent"],
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode == 0 and cache_file.exists():
            return str(cache_file)
        else:
            print(f"   Mermaid 렌더링 실패: {result.stderr}")
            return None
    except FileNotFoundError:
        print("   경고: mermaid-cli(mmdc)가 설치되지 않았습니다. 'npm install -g @mermaid-js/mermaid-cli'로 설치하세요.")
        return None
    except subprocess.TimeoutExpired:
        print("   경고: Mermaid 렌더링 시간 초과")
        return None
    finally:
        # 임시 파일 삭제
        if temp_mmd.exists():
            temp_mmd.unlink()


def process_custom_directives(content):
    """커스텀 디렉티브 처리 (::img, ::a, :::div 등)"""

    # ::a 앵커 태그 처리 - PDF용 텍스트+링크 형식으로 변환
    # 예: ::a[노션 요금제]{class='btn-link' href="https://..." target="_blank"}
    # -> 노션 요금제: https://...
    def replace_anchor(match):
        text = match.group(1)
        attrs = match.group(2) if match.group(2) else ""
        href = re.search(r'href=["\']?([^"\'}\s]+)["\']?', attrs)

        if href:
            url = href.group(1)
            return f'**{text}**: {url}'
        return text

    content = re.sub(r'::a\[([^\]]+)\]\{([^}]*)\}', replace_anchor, content)

    # ::img 처리
    def replace_img(match):
        attrs = match.group(1) if match.group(1) else ""
        width = re.search(r'width=["\']?(\d+)["\']?', attrs)
        src = re.search(r'src=["\']?([^"\'}\s]+)["\']?', attrs)
        alt = re.search(r'alt=["\']?([^"\'}\s]+)["\']?', attrs)

        width_attr = f'width="{width.group(1)}"' if width else ""
        src_attr = src.group(1) if src else ""
        alt_text = alt.group(1) if alt else ""

        return f'<img {width_attr} src="{src_attr}" alt="{alt_text}" />'

    content = re.sub(r'::img\{([^}]*)\}', replace_img, content)

    # :::div{.class} ... ::: 블록 처리
    def replace_div_block(match):
        attrs = match.group(1)
        inner = match.group(2)
        class_match = re.search(r'\.([a-zA-Z0-9_-]+)', attrs)
        class_name = class_match.group(1) if class_match else ""
        return f'<div class="{class_name}">\n{inner}\n</div>'

    content = re.sub(r':::div\{([^}]*)\}\s*\n(.*?)\n:::', replace_div_block, content, flags=re.DOTALL)

    # :::info, :::warning 등 처리
    content = re.sub(r':::(\w+)\s*\n(.*?)\n:::', r'<div class="\1">\n\2\n</div>', content, flags=re.DOTALL)

    return content


def process_mermaid_blocks(content):
    """Mermaid 코드 블록을 이미지로 변환"""

    def replace_mermaid(match):
        mermaid_code = match.group(1).strip()
        image_path = render_mermaid_to_image(mermaid_code)

        if image_path:
            return f'<img src="file:///{image_path.replace(chr(92), "/")}" class="mermaid-diagram" alt="Mermaid Diagram" />'
        else:
            # 렌더링 실패 시 코드 블록으로 표시
            return f'<pre class="mermaid-fallback"><code>{mermaid_code}</code></pre>'

    # ```mermaid ... ``` 블록 찾아서 변환
    content = re.sub(r'```mermaid\s*\n(.*?)\n```', replace_mermaid, content, flags=re.DOTALL)

    return content


def get_chapters_and_pages(book_path):
    """책의 챕터와 페이지 구조 가져오기"""
    chapters = {}

    for chapter_dir in sorted(book_path.glob("chapter*")):
        if chapter_dir.is_dir():
            chapter_name = chapter_dir.name
            pages = []

            # 마크다운 파일들을 정렬하여 가져오기
            md_files = sorted(chapter_dir.glob("*.md"), key=lambda x: x.stem)

            for md_file in md_files:
                content = md_file.read_text(encoding="utf-8")
                frontmatter, _ = parse_frontmatter(content)
                pages.append({
                    "file": md_file,
                    "chapter": frontmatter.get("chapter", ""),
                    "title": frontmatter.get("title", md_file.stem)
                })

            if pages:
                chapters[chapter_name] = pages

    return chapters


def convert_markdown_to_html(md_content, book_name):
    """마크다운을 HTML로 변환"""
    # 커스텀 디렉티브 처리
    md_content = process_custom_directives(md_content)

    # Mermaid 블록을 이미지로 변환
    md_content = process_mermaid_blocks(md_content)

    # 마크다운 변환
    md = markdown.Markdown(extensions=[
        'fenced_code',
        'tables',
        'codehilite',
        'toc',
        'attr_list',
        'md_in_html'
    ], extension_configs={
        'codehilite': {
            'css_class': 'highlight',
            'guess_lang': False
        }
    })

    html = md.convert(md_content)

    # 이미지 경로 처리
    soup = BeautifulSoup(html, 'html.parser')
    for img in soup.find_all('img'):
        src = img.get('src', '')
        if src.startswith('/images/'):
            # URL 인코딩된 경로 디코딩 (예: %20 -> 공백, %202 -> 2 등)
            decoded_src = unquote(src)

            # public 폴더의 절대 경로로 변환
            local_path = PUBLIC_DIR / decoded_src.lstrip('/')
            if local_path.exists():
                img['src'] = f'file:///{local_path.as_posix()}'
            else:
                # 디코딩된 경로로도 찾기 시도
                print(f"   경고: 이미지를 찾을 수 없습니다: {local_path}")

    return str(soup)


def generate_pdf(book_name, output_filename=None):
    """책을 PDF로 변환"""
    book_path = MD_DIR / book_name

    if not book_path.exists():
        print(f"오류: '{book_name}' 책을 찾을 수 없습니다.")
        return None

    book_info = get_book_info(book_name)
    chapters = get_chapters_and_pages(book_path)

    if not chapters:
        print(f"오류: '{book_name}'에서 챕터를 찾을 수 없습니다.")
        return None

    print(f"\n📚 '{book_info['title']}' PDF 생성 중...")
    print(f"   챕터 수: {len(chapters)}")

    # HTML 문서 생성
    html_parts = []

    # 표지 페이지 - 표지 이미지가 있으면 이미지로, 없으면 텍스트로
    cover_image_path = None
    if book_info.get('cover'):
        cover_rel_path = book_info['cover'].lstrip('/')
        cover_full_path = PUBLIC_DIR / cover_rel_path
        if cover_full_path.exists():
            cover_image_path = f'file:///{cover_full_path.as_posix()}'
            print(f"   표지 이미지: {cover_full_path}")

    if cover_image_path:
        # 표지 이미지가 있는 경우 - 이미지로 표지 페이지 구성
        cover_html = f"""
        <div class="cover-page cover-image-page">
            <img src="{cover_image_path}" class="cover-image" alt="{book_info['title']} 표지" />
        </div>
        """
    else:
        # 표지 이미지가 없는 경우 - 텍스트로 표지 페이지 구성
        cover_html = f"""
        <div class="cover-page">
            <h1 class="book-title">{book_info['title']}</h1>
            <p class="book-description">{book_info['description']}</p>
            <p class="publisher">Wenivooks</p>
        </div>
        """
    html_parts.append(cover_html)

    # 목차 페이지
    toc_html = '<div class="toc-page"><h2>목차</h2><ul class="toc">'
    for chapter_name, pages in chapters.items():
        if pages:
            chapter_title = pages[0].get('chapter', chapter_name)
            toc_html += f'<li class="toc-chapter">{chapter_title}<ul>'
            for page in pages:
                toc_html += f'<li class="toc-page-item">{page["title"]}</li>'
            toc_html += '</ul></li>'
    toc_html += '</ul></div>'
    html_parts.append(toc_html)

    # 각 챕터 및 페이지 내용
    total_pages = sum(len(pages) for pages in chapters.values())
    processed = 0

    for chapter_name, pages in chapters.items():
        for page in pages:
            content = page['file'].read_text(encoding="utf-8")
            frontmatter, md_content = parse_frontmatter(content)

            chapter_title = frontmatter.get('chapter', '')
            page_title = frontmatter.get('title', '')

            html_content = convert_markdown_to_html(md_content, book_name)

            page_html = f"""
            <div class="page-content">
                <div class="page-header">
                    <span class="chapter-name">{chapter_title}</span>
                    <span class="page-title">{page_title}</span>
                </div>
                <article>
                    <h1>{page_title}</h1>
                    {html_content}
                </article>
            </div>
            """
            html_parts.append(page_html)

            processed += 1
            print(f"   처리 중: {processed}/{total_pages} - {page_title}")

    # 전체 HTML 문서 조합
    full_html = f"""
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <title>{book_info['title']}</title>
    </head>
    <body>
        {''.join(html_parts)}
    </body>
    </html>
    """

    # CSS 스타일
    css = CSS(string=get_book_css())

    # 출력 폴더 생성
    OUTPUT_DIR.mkdir(exist_ok=True)

    # 출력 파일명
    if not output_filename:
        output_filename = f"{book_name}.pdf"

    output_path = OUTPUT_DIR / output_filename

    # PDF 생성
    font_config = FontConfiguration()
    HTML(string=full_html, base_url=str(PROJECT_ROOT)).write_pdf(
        output_path,
        stylesheets=[css],
        font_config=font_config
    )

    print(f"\n✅ PDF 생성 완료: {output_path}")
    return output_path


def get_book_css():
    """책 스타일링을 위한 CSS"""
    return """
    @page {
        size: A4;
        margin: 2cm 2.5cm;

        @top-center {
            content: string(chapter-name);
            font-size: 10pt;
            color: #666;
        }

        @bottom-center {
            content: counter(page);
            font-size: 10pt;
            color: #666;
        }
    }

    @page :first {
        @top-center { content: none; }
        @bottom-center { content: none; }
    }

    /* 기본 폰트 설정 */
    body {
        font-family: "Pretendard", "Noto Sans KR", "Malgun Gothic", sans-serif;
        font-size: 11pt;
        line-height: 1.8;
        color: #333;
    }

    /* 표지 페이지 */
    .cover-page {
        page-break-after: always;
        text-align: center;
        padding-top: 30%;
    }

    /* 표지 이미지가 있는 경우 */
    .cover-image-page {
        padding: 0;
        margin: -2cm -2.5cm;
        width: calc(100% + 5cm);
        height: calc(100vh + 4cm);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .cover-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        max-width: none;
    }

    .book-title {
        font-size: 32pt;
        font-weight: 700;
        color: #2563eb;
        margin-bottom: 20pt;
    }

    .book-description {
        font-size: 14pt;
        color: #666;
        margin-bottom: 40pt;
    }

    .publisher {
        font-size: 12pt;
        color: #999;
        position: absolute;
        bottom: 10%;
        width: 100%;
        text-align: center;
    }

    /* 목차 페이지 */
    .toc-page {
        page-break-after: always;
    }

    .toc-page h2 {
        font-size: 24pt;
        margin-bottom: 30pt;
        color: #2563eb;
    }

    .toc {
        list-style: none;
        padding: 0;
    }

    .toc-chapter {
        font-size: 13pt;
        font-weight: 600;
        margin-top: 15pt;
        color: #333;
    }

    .toc-chapter ul {
        list-style: none;
        padding-left: 20pt;
    }

    .toc-page-item {
        font-size: 11pt;
        font-weight: 400;
        margin-top: 5pt;
        color: #666;
    }

    /* 페이지 콘텐츠 */
    .page-content {
        page-break-before: always;
    }

    .page-header {
        string-set: chapter-name content(text);
        display: none;
    }

    /* 제목 스타일 */
    h1 {
        font-size: 22pt;
        font-weight: 700;
        color: #1e40af;
        margin-top: 0;
        margin-bottom: 20pt;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 10pt;
    }

    h2 {
        font-size: 16pt;
        font-weight: 600;
        color: #1e40af;
        margin-top: 25pt;
        margin-bottom: 12pt;
    }

    h3 {
        font-size: 13pt;
        font-weight: 600;
        color: #374151;
        margin-top: 20pt;
        margin-bottom: 10pt;
    }

    h4, h5, h6 {
        font-size: 12pt;
        font-weight: 600;
        color: #4b5563;
        margin-top: 15pt;
        margin-bottom: 8pt;
    }

    /* 단락 */
    p {
        margin-top: 0;
        margin-bottom: 12pt;
        text-align: justify;
    }

    /* 코드 블록 */
    pre {
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 6pt;
        padding: 12pt;
        font-family: "JetBrains Mono", "D2Coding", "Consolas", monospace;
        font-size: 9pt;
        line-height: 1.5;
        overflow-x: auto;
        margin: 15pt 0;
    }

    code {
        font-family: "JetBrains Mono", "D2Coding", "Consolas", monospace;
        font-size: 9pt;
        background-color: #f1f3f4;
        padding: 2pt 4pt;
        border-radius: 3pt;
    }

    pre code {
        background-color: transparent;
        padding: 0;
    }

    /* 인용문 */
    blockquote {
        border-left: 4pt solid #2563eb;
        margin: 15pt 0;
        padding: 10pt 20pt;
        background-color: #f8fafc;
        font-style: italic;
        color: #64748b;
    }

    blockquote p {
        margin: 0;
    }

    /* 리스트 */
    ul, ol {
        margin: 12pt 0;
        padding-left: 25pt;
    }

    li {
        margin-bottom: 6pt;
    }

    /* 테이블 */
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 15pt 0;
        font-size: 10pt;
    }

    th, td {
        border: 1px solid #e5e7eb;
        padding: 8pt 12pt;
        text-align: left;
    }

    th {
        background-color: #f8fafc;
        font-weight: 600;
        color: #374151;
    }

    tr:nth-child(even) {
        background-color: #fafafa;
    }

    /* 이미지 */
    img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 15pt auto;
    }

    /* 커스텀 박스 스타일 */
    .box {
        background-color: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 6pt;
        padding: 15pt;
        margin: 15pt 0;
    }

    .info {
        background-color: #eff6ff;
        border-left: 4pt solid #3b82f6;
        padding: 12pt 15pt;
        margin: 15pt 0;
    }

    .warning {
        background-color: #fffbeb;
        border-left: 4pt solid #f59e0b;
        padding: 12pt 15pt;
        margin: 15pt 0;
    }

    .danger {
        background-color: #fef2f2;
        border-left: 4pt solid #ef4444;
        padding: 12pt 15pt;
        margin: 15pt 0;
    }

    .success {
        background-color: #f0fdf4;
        border-left: 4pt solid #22c55e;
        padding: 12pt 15pt;
        margin: 15pt 0;
    }

    /* 링크 */
    a {
        color: #2563eb;
        text-decoration: none;
    }

    /* 구분선 */
    hr {
        border: none;
        border-top: 1px solid #e5e7eb;
        margin: 20pt 0;
    }

    /* 코드 하이라이팅 */
    .highlight {
        background-color: #f8f9fa;
    }

    .highlight .hll { background-color: #ffffcc }
    .highlight .c { color: #6a737d } /* Comment */
    .highlight .k { color: #d73a49 } /* Keyword */
    .highlight .o { color: #d73a49 } /* Operator */
    .highlight .cm { color: #6a737d } /* Comment.Multiline */
    .highlight .cp { color: #d73a49 } /* Comment.Preproc */
    .highlight .c1 { color: #6a737d } /* Comment.Single */
    .highlight .cs { color: #6a737d } /* Comment.Special */
    .highlight .gd { color: #b31d28; background-color: #ffeef0 } /* Generic.Deleted */
    .highlight .ge { font-style: italic } /* Generic.Emph */
    .highlight .gi { color: #22863a; background-color: #f0fff4 } /* Generic.Inserted */
    .highlight .gs { font-weight: bold } /* Generic.Strong */
    .highlight .gu { color: #6f42c1 } /* Generic.Subheading */
    .highlight .kc { color: #d73a49 } /* Keyword.Constant */
    .highlight .kd { color: #d73a49 } /* Keyword.Declaration */
    .highlight .kn { color: #d73a49 } /* Keyword.Namespace */
    .highlight .kp { color: #d73a49 } /* Keyword.Pseudo */
    .highlight .kr { color: #d73a49 } /* Keyword.Reserved */
    .highlight .kt { color: #d73a49 } /* Keyword.Type */
    .highlight .m { color: #005cc5 } /* Literal.Number */
    .highlight .s { color: #032f62 } /* Literal.String */
    .highlight .na { color: #005cc5 } /* Name.Attribute */
    .highlight .nb { color: #005cc5 } /* Name.Builtin */
    .highlight .nc { color: #6f42c1 } /* Name.Class */
    .highlight .no { color: #005cc5 } /* Name.Constant */
    .highlight .nd { color: #6f42c1 } /* Name.Decorator */
    .highlight .ni { color: #005cc5 } /* Name.Entity */
    .highlight .ne { color: #6f42c1 } /* Name.Exception */
    .highlight .nf { color: #6f42c1 } /* Name.Function */
    .highlight .nl { color: #005cc5 } /* Name.Label */
    .highlight .nn { color: #6f42c1 } /* Name.Namespace */
    .highlight .nt { color: #22863a } /* Name.Tag */
    .highlight .nv { color: #e36209 } /* Name.Variable */
    .highlight .ow { color: #d73a49 } /* Operator.Word */
    .highlight .w { color: #bbbbbb } /* Text.Whitespace */
    .highlight .mf { color: #005cc5 } /* Literal.Number.Float */
    .highlight .mh { color: #005cc5 } /* Literal.Number.Hex */
    .highlight .mi { color: #005cc5 } /* Literal.Number.Integer */
    .highlight .mo { color: #005cc5 } /* Literal.Number.Oct */
    .highlight .sb { color: #032f62 } /* Literal.String.Backtick */
    .highlight .sc { color: #032f62 } /* Literal.String.Char */
    .highlight .sd { color: #032f62 } /* Literal.String.Doc */
    .highlight .s2 { color: #032f62 } /* Literal.String.Double */
    .highlight .se { color: #032f62 } /* Literal.String.Escape */
    .highlight .sh { color: #032f62 } /* Literal.String.Heredoc */
    .highlight .si { color: #032f62 } /* Literal.String.Interpol */
    .highlight .sx { color: #032f62 } /* Literal.String.Other */
    .highlight .sr { color: #032f62 } /* Literal.String.Regex */
    .highlight .s1 { color: #032f62 } /* Literal.String.Single */
    .highlight .ss { color: #005cc5 } /* Literal.String.Symbol */
    .highlight .bp { color: #005cc5 } /* Name.Builtin.Pseudo */
    .highlight .vc { color: #e36209 } /* Name.Variable.Class */
    .highlight .vg { color: #e36209 } /* Name.Variable.Global */
    .highlight .vi { color: #e36209 } /* Name.Variable.Instance */
    .highlight .il { color: #005cc5 } /* Literal.Number.Integer.Long */

    /* Mermaid 다이어그램 */
    .mermaid-diagram {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 20pt auto;
    }

    .mermaid-fallback {
        background-color: #f5f5f5;
        border: 1px dashed #ccc;
        padding: 15pt;
        font-size: 9pt;
        color: #666;
    }

    /* 외부 링크 스타일 (PDF용) */
    .external-link {
        display: block;
        background-color: #f8fafc;
        border-left: 3pt solid #3b82f6;
        padding: 8pt 12pt;
        margin: 10pt 0;
        font-size: 10pt;
    }

    .external-link strong {
        color: #1e40af;
    }
    """


def select_book_interactive():
    """대화형 모드로 책 선택"""
    books = get_book_list()

    if not books:
        print("오류: _md 폴더에서 책을 찾을 수 없습니다.")
        return None

    print("\n📚 사용 가능한 책 목록:")
    print("-" * 50)

    for i, book in enumerate(books, 1):
        info = get_book_info(book)
        print(f"  {i:2}. {info['title']}")
        print(f"      ({book})")

    print("-" * 50)

    while True:
        try:
            choice = input("\n변환할 책 번호를 입력하세요 (0: 취소): ").strip()

            if choice == '0':
                print("취소되었습니다.")
                return None

            idx = int(choice) - 1
            if 0 <= idx < len(books):
                return books[idx]
            else:
                print("잘못된 번호입니다. 다시 입력해주세요.")
        except ValueError:
            # 책 이름으로 직접 입력한 경우
            if choice in books:
                return choice
            print("숫자 또는 책 이름을 입력해주세요.")


def main():
    """메인 함수"""
    print("=" * 50)
    print("  Wenivooks PDF Export Tool")
    print("  마크다운 책을 출판용 PDF로 변환")
    print("=" * 50)

    # 명령행 인자로 책 이름이 주어진 경우
    if len(sys.argv) > 1:
        book_name = sys.argv[1]
    else:
        book_name = select_book_interactive()

    if book_name:
        generate_pdf(book_name)


if __name__ == "__main__":
    main()
