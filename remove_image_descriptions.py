import re
import os
from pathlib import Path

def remove_image_descriptions(file_path):
    """이미지 아래의 불필요한 설명을 제거하는 함수"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 패턴: 이미지 마크다운 다음에 오는 빈 줄과 숫자-점-숫자 형식의 텍스트
    # 예: ![...](/images/...)
    #
    #     8.1-1
    pattern = r'(!\[.*?\]\(\/images\/.*?\))\n\n([0-9]+\.[0-9]+\.[0-9]+-[0-9]+|[0-9]+\.[0-9]+-[0-9]+)\n'

    # 이미지 뒤의 설명 제거
    new_content = re.sub(pattern, r'\1\n', content)

    # 변경사항이 있는지 확인
    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def process_chapter(chapter_dir):
    """Process all md files in chapter folder"""
    chapter_path = Path(chapter_dir)
    if not chapter_path.exists():
        print(f"Folder not found: {chapter_dir}")
        return

    md_files = list(chapter_path.glob('*.md'))
    if not md_files:
        print(f"No markdown files found: {chapter_dir}")
        return

    processed_count = 0
    for md_file in md_files:
        if remove_image_descriptions(md_file):
            print(f"[OK] {md_file.name}")
            processed_count += 1
        else:
            print(f"[SKIP] {md_file.name}")

    print(f"\n{chapter_path.name}: {processed_count}/{len(md_files)} files modified")

if __name__ == "__main__":
    base_path = Path("_md/essentials-vibecoding")

    # chapter07 처리
    print("=== Chapter 07 처리 중 ===")
    process_chapter(base_path / "chapter07")

    print("\n=== Chapter 08 처리 중 ===")
    process_chapter(base_path / "chapter08")
