# 아임 더 보스 - 보드게임 대여 서비스

## 소셜 미디어 공유 최적화

이 프로젝트는 카카오톡, 페이스북 등 소셜 미디어에 공유할 때 최적화된 메타 정보를 포함하고 있습니다.

### Open Graph 메타 태그

- **제목**: "아임 더 보스 - 보드게임 대여 서비스"
- **설명**: "다양한 보드게임을 쉽고 편리하게 대여하세요. 전략게임부터 파티게임까지!"
- **이미지**: `logo-og.svg` (1200x630px) - 동적으로 절대 URL로 설정
- **타입**: website
- **URL**: 현재 도메인으로 동적 설정

### 카카오톡 공유 최적화

카카오톡에서 링크를 공유할 때 다음 정보가 표시됩니다:
- 대표 이미지: 아임 더 보스 로고
- 제목: 아임 더 보스 - 보드게임 대여 서비스
- 설명: 다양한 보드게임을 쉽고 편리하게 대여하세요

### 메타 태그 설정

- **정적 설정**: 빌드 시점에 절대 URL로 설정 (권장)
- **이미지 URL**: `https://boardgame-xi.vercel.app/logo-og.png` 형태로 직접 설정
- **페이지 URL**: `https://boardgame-xi.vercel.app/` 형태로 직접 설정
- **현재 도메인**: [https://boardgame-xi.vercel.app/](https://boardgame-xi.vercel.app/)

### 주의사항

- **도메인 설정 완료**: 실제 배포 도메인으로 설정 완료
- **JavaScript 제거**: 동적 경로 변환 스크립트 제거하여 SEO 최적화
- **정적 메타 태그**: 검색 엔진과 소셜 미디어 크롤러가 즉시 인식 가능

### 로고 파일

- `logo-og.svg`: 소셜 미디어 공유용 SVG 로고 (1200x630px)
  - #007bff 기반 파란색 그라데이션
  - 게임 보드 느낌의 격자 패턴
  - 중앙에 주사위 아이콘
  - 현대적이고 세련된 디자인
- `logo-og.png`: 소셜 미디어 공유용 PNG 로고 (1200x630px) - **권장**
  - 소셜 미디어 크롤러가 더 잘 인식
  - SVG 변환으로 자동 생성
- `logo-favicon.svg`: favicon용 SVG 로고 (64x64px)
  - 브라우저 탭과 북마크에 표시
  - 주사위 아이콘 포함
- `logo-favicon.png`: favicon용 PNG 로고 (64x64px)
  - SVG 변환으로 자동 생성
- `favicon.ico`: 브라우저 favicon용 ICO 파일 (32x32px)
  - Create React App 기본 아이콘을 우리 로고로 교체
  - SVG 변환으로 자동 생성
- `logo-icon-*.png`: 다양한 크기의 아이콘들 (16x16 ~ 512x512px)
  - PWA 설치, 홈 화면 추가 등에 사용
  - SVG 변환으로 자동 생성
  - 브라우저 탭, 북마크, 홈 화면 등 다양한 환경에서 최적화된 표시

### 로고 변환

SVG를 PNG로 변환하려면:

```bash
# sharp 패키지 설치 후 변환
npm run convert-logo:install

# 또는 단계별로 실행
npm install sharp
npm run convert-logo
```

**참고**: 
- PNG 파일은 소셜 미디어 공유에 더 적합하며, SVG 변환으로 자동 생성됩니다.
- 다양한 크기의 아이콘들이 자동으로 생성되어 PWA 기능에 최적화됩니다.

## 개발

```bash
npm start
npm run build
npm test
```

## 빌드

프로덕션 빌드를 위해:

```bash
npm run build
```

빌드된 파일은 `build` 폴더에 생성됩니다.
