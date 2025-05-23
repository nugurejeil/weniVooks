#!/usr/bin/env python3
"""
Next.js 프로젝트 이미지 최적화 스크립트
이미지 크기를 줄이고 최적화하여 웹 성능을 향상시킵니다.

사용법:
python img_opt.py .

# 나중에 이 접두사로 시작하는 모든 파일을 삭제합니다.
# Windows (PowerShell)
Get-ChildItem -Recurse -Name "ORIGINAL_BACKUP_IMG_*" | Remove-Item

# Linux/Mac
find . -name "ORIGINAL_BACKUP_IMG_*" -delete

# 주의사항: 최적화를 여러번 돌리면 이미지가 계속 줄어들 수 있습니다. 따라서 3 ~ 4개월에 한 번, 이미 최적화를 수행한 이미지에 대해서는 수행하지 않도록 합니다.
# 이 문제를 해결하기 위해 코드를 수정했습니다.(2025/5/22) => 실행해보지는 않았으므로 문제가 생기면 롤백하세요.
"""

import os
import sys
from pathlib import Path
import unicodedata
from PIL import Image
import argparse
from typing import List, Tuple
import logging
from datetime import datetime

# 설정
CONFIG = {
    "max_width": 1920,  # 최대 너비 (px)
    "max_height": 1080,  # 최대 높이 (px)
    "quality": 85,  # JPEG 품질 (1-100)
    "webp_quality": 80,  # WebP 품질 (1-100)
    "png_optimize": True,  # PNG 최적화 여부
    "convert_to_webp": False,  # WebP 변환 여부 (확장자 변경 방지)
    "backup_original": True,  # 원본 백업 여부
    "backup_prefix": "ORIGINAL_BACKUP_IMG_",  # 백업 파일 접두사
}

# 지원하는 이미지 확장자
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}

# Next.js 프로젝트에서 이미지가 주로 위치하는 디렉토리
DEFAULT_IMAGE_DIRS = [
    "public",
    "public/images",
    "public/assets",
    "assets",
    "src/assets",
    "images",
    "static",
]


class ImageOptimizer:
    def __init__(self, project_path: str, config: dict = None):
        self.project_path = Path(project_path)
        self.config = {**CONFIG, **(config or {})}
        self.stats = {
            "processed": 0,
            "skipped": 0,
            "errors": 0,
            "total_size_before": 0,
            "total_size_after": 0,
        }

        # 로깅 설정
        log_filename = (
            f'image_optimization_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'
        )
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler(
                    log_filename, encoding="utf-8"
                ),  # UTF-8 인코딩 명시
                logging.StreamHandler(sys.stdout),
            ],
        )
        self.logger = logging.getLogger(__name__)

    def find_image_files(self, custom_dirs: List[str] = None) -> List[Path]:
        """프로젝트에서 이미지 파일들을 찾습니다."""
        image_files = []
        search_dirs = custom_dirs or DEFAULT_IMAGE_DIRS

        for dir_name in search_dirs:
            dir_path = self.project_path / dir_name
            if dir_path.exists():
                self.logger.info(f"'{dir_path}' 디렉토리에서 이미지 검색 중...")
                for file_path in dir_path.rglob("*"):
                    file_name = self.file_path_to_normalized(file_path)
                    if (
                        file_path.is_file()
                        and file_path.suffix.lower() in SUPPORTED_EXTENSIONS
                        and not file_name.startswith(self.config["backup_prefix"])
                    ):  # 백업 파일 제외
                        image_files.append(file_path)

        self.logger.info(f"총 {len(image_files)}개의 이미지 파일을 발견했습니다.")
        return image_files

    def get_file_size(self, file_path: Path) -> int:
        """파일 크기를 바이트 단위로 반환합니다."""
        return file_path.stat().st_size

    def format_size(self, size_bytes: int) -> str:
        """바이트를 읽기 쉬운 형태로 변환합니다."""
        for unit in ["B", "KB", "MB", "GB"]:
            if size_bytes < 1024.0:
                return f"{size_bytes:.1f}{unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.1f}TB"

    def backup_original(self, file_path: Path) -> Path:
        """원본 파일을 백업합니다."""
        if not self.config["backup_original"]:
            return None

        file_name = self.file_path_to_normalized(file_path)

        # 같은 디렉토리에 백업 접두사를 붙여서 백업 파일 생성
        backup_path = file_path.parent / f"{self.config['backup_prefix']}{file_name}"

        # 백업 파일이 이미 존재하면 백업하지 않음 (이미 최적화된 상태)
        if backup_path.exists():
            self.logger.debug(f"백업 파일 이미 존재: {backup_path}")
            return backup_path

        import shutil

        shutil.copy2(file_path, backup_path)
        self.logger.debug(f"원본 백업: {backup_path}")

        return backup_path

    def resize_image(self, image: Image.Image) -> Image.Image:
        """이미지 크기를 조정합니다."""
        width, height = image.size
        max_width = self.config["max_width"]
        max_height = self.config["max_height"]

        if width <= max_width and height <= max_height:
            return image

        # 비율을 유지하며 크기 조정
        ratio = min(max_width / width, max_height / height)
        new_width = int(width * ratio)
        new_height = int(height * ratio)

        return image.resize((new_width, new_height), Image.Resampling.LANCZOS)

    def optimize_image(self, file_path: Path) -> bool:
        """단일 이미지를 최적화합니다."""
        try:
            # 이미 백업이 있는지 확인 (이미 최적화된 파일)
            file_name = self.file_path_to_normalized(file_path)
            backup_path = (
                file_path.parent / f"{self.config['backup_prefix']}{file_name}"
            )
            if backup_path.exists():
                self.logger.info(
                    f"건너뛰기 {file_name}: 이미 최적화됨 (백업 파일 존재)"
                )
                self.stats["skipped"] += 1
                return True

            original_size = self.get_file_size(file_path)
            self.stats["total_size_before"] += original_size

            # 원본 백업
            backup_path = self.backup_original(file_path)

            # 이미지 열기
            with Image.open(file_path) as image:
                # 파일 확장자에 따른 처리
                file_extension = file_path.suffix.lower()

                # PNG 파일의 경우 투명도 유지
                if file_extension == ".png":
                    # PNG는 RGBA 모드 유지 (투명도 보존)
                    if image.mode not in ("RGBA", "LA", "P"):
                        if image.mode == "RGB":
                            # RGB를 RGBA로 변환 (알파 채널 추가)
                            image = image.convert("RGBA")
                        elif image.mode in ("1", "L"):
                            # 흑백 이미지를 RGBA로 변환
                            image = image.convert("RGBA")
                else:
                    # JPEG, WebP 등 다른 형식의 경우 RGB로 변환
                    if image.mode in ("RGBA", "LA"):
                        background = Image.new("RGB", image.size, (255, 255, 255))
                        background.paste(
                            image,
                            mask=image.split()[-1] if image.mode == "RGBA" else None,
                        )
                        image = background
                    elif image.mode not in ("RGB", "L"):
                        image = image.convert("RGB")

                # 크기 조정
                original_dimensions = image.size
                image = self.resize_image(image)
                new_dimensions = image.size

                # 파일 확장자에 따른 최적화 (확장자 유지)
                if file_extension in [".jpg", ".jpeg"]:
                    image.save(
                        file_path,
                        "JPEG",
                        quality=self.config["quality"],
                        optimize=True,
                        progressive=True,
                    )
                elif file_extension == ".png":
                    image.save(
                        file_path,
                        "PNG",
                        optimize=self.config["png_optimize"],
                        compress_level=9,
                    )
                elif file_extension == ".webp":
                    image.save(
                        file_path,
                        "WebP",
                        quality=self.config["webp_quality"],
                        optimize=True,
                    )
                else:
                    # 기타 형식은 JPEG로 저장하되 확장자는 유지
                    image.save(
                        file_path,
                        "JPEG",
                        quality=self.config["quality"],
                        optimize=True,
                        progressive=True,
                    )

            new_size = self.get_file_size(file_path)

            # 크기가 커진 경우 원본으로 복원
            if new_size > original_size:
                self.logger.warning(
                    f"경고 {file_name}: 최적화 후 크기가 증가함. 원본으로 복원합니다."
                )
                # 백업에서 원본 복원
                if backup_path and backup_path.exists():
                    import shutil

                    shutil.copy2(backup_path, file_path)
                    new_size = original_size
                    self.stats["skipped"] += 1
                    return True
                else:
                    self.logger.error(
                        f"오류 {file_name}: 백업이 없어 복원할 수 없습니다."
                    )
                    self.stats["errors"] += 1
                    return False

            self.stats["total_size_after"] += new_size

            # 결과 로깅
            size_reduction = ((original_size - new_size) / original_size) * 100
            dimension_changed = original_dimensions != new_dimensions

            status_icon = "완료" if size_reduction >= 0 else "경고"
            reduction_text = (
                f"{size_reduction:.1f}% 감소"
                if size_reduction >= 0
                else f"{abs(size_reduction):.1f}% 증가"
            )

            self.logger.info(
                f"{status_icon} {file_name}: "
                f"{self.format_size(original_size)} -> {self.format_size(new_size)} "
                f"({reduction_text})"
                f"{' | 크기조정: ' + str(original_dimensions) + ' -> ' + str(new_dimensions) if dimension_changed else ''}"
            )

            self.stats["processed"] += 1
            return True

        except Exception as e:
            self.logger.error(f"오류 {file_name} 처리 실패: {str(e)}")
            self.stats["errors"] += 1
            return False

    def optimize_all(self, custom_dirs: List[str] = None) -> None:
        """모든 이미지를 최적화합니다."""
        self.logger.info("이미지 최적화를 시작합니다...")

        image_files = self.find_image_files(custom_dirs)

        if not image_files:
            self.logger.warning("최적화할 이미지를 찾을 수 없습니다.")
            return

        # 이미 백업이 있는 파일들 확인
        already_optimized = []
        for file_path in image_files:
            file_name = self.file_path_to_normalized(file_path)
            backup_path = (
                file_path.parent / f"{self.config['backup_prefix']}{file_name}"
            )
            if backup_path.exists():
                already_optimized.append(file_name)

        if already_optimized:
            self.logger.info(
                f"이미 최적화된 파일 {len(already_optimized)}개를 발견했습니다."
            )
            self.logger.info("중복 최적화를 방지하기 위해 이 파일들은 건너뜁니다.")

        for i, file_path in enumerate(image_files, 1):
            self.logger.info(f"[{i}/{len(image_files)}] 처리 중: {file_name}")

            # 이미 충분히 작은 파일은 건너뛰기
            file_size = self.get_file_size(file_path)
            if file_size < 50 * 1024:  # 50KB 미만
                self.logger.info(
                    f"건너뛰기 {file_name}: 이미 충분히 작음 ({self.format_size(file_size)})"
                )
                self.stats["skipped"] += 1
                continue

            self.optimize_image(file_path)

        self.print_summary()

    def print_summary(self) -> None:
        """최적화 결과 요약을 출력합니다."""
        total_reduction = (
            self.stats["total_size_before"] - self.stats["total_size_after"]
        )
        reduction_percentage = (
            (total_reduction / self.stats["total_size_before"] * 100)
            if self.stats["total_size_before"] > 0
            else 0
        )

        print("\n" + "=" * 60)
        print("이미지 최적화 완료!")
        print("=" * 60)
        print(f"처리된 파일: {self.stats['processed']}개")
        print(f"건너뛴 파일: {self.stats['skipped']}개")
        print(f"오류 파일: {self.stats['errors']}개")
        print(
            f"용량 절약: {self.format_size(total_reduction)} ({reduction_percentage:.1f}%)"
        )
        print(
            f"전체 용량: {self.format_size(self.stats['total_size_before'])} -> {self.format_size(self.stats['total_size_after'])}"
        )
        print("=" * 60)

    def file_path_to_normalized(self, file_path: Path) -> str:
        """파일 경로를 정규화합니다."""
        if file_path.name == unicodedata.normalize("NFC", file_path.name):
            return unicodedata.normalize("NFC", file_path.name)
        elif file_path.name == unicodedata.normalize("NFD", file_path.name):
            return unicodedata.normalize("NFD", file_path.name)


def main():
    parser = argparse.ArgumentParser(description="Next.js 프로젝트 이미지 최적화")
    parser.add_argument("project_path", help="Next.js 프로젝트 경로")

    args = parser.parse_args()

    # 기본 설정 사용
    config = CONFIG.copy()

    # 프로젝트 경로 확인
    project_path = Path(args.project_path)
    if not project_path.exists():
        print(f"프로젝트 경로를 찾을 수 없습니다: {project_path}")
        sys.exit(1)

    # 최적화 실행
    optimizer = ImageOptimizer(project_path, config)
    optimizer.optimize_all()


if __name__ == "__main__":
    main()
