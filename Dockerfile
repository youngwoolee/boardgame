# --- 1. 빌드 단계: GraalVM 환경에서 네이티브 이미지 생성 ---
# GraalVM 공식 이미지를 빌드 환경으로 사용합니다. (Java 17 기준)
FROM ghcr.io/graalvm/graalvm-ce:ol7-java17-22.3.3 as builder

# 작업 디렉토리 설정
WORKDIR /app

# 빌드에 필요한 파일들만 먼저 복사하여 Gradle 캐시 활용
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

# 의존성 다운로드 (선택사항이지만 빌드 속도 향상에 도움)
RUN ./gradlew dependencies

# 전체 소스코드 복사
COPY src ./src

# 네이티브 이미지 빌드 실행
RUN ./gradlew nativeCompile


# --- 2. 실행 단계: 가벼운 환경에서 실행 파일만 실행 ---
# 매우 가벼운 리눅스 이미지로 변경하여 최종 이미지 크기를 줄입니다.
FROM cgr.dev/chainguard/static:latest

# 작업 디렉토리 설정
WORKDIR /app

# ✅ 빌드 단계에서 생성된 네이티브 실행 파일만 복사
# 'boardgame' 부분은 build.gradle.kts의 rootProject.name에 맞게 수정해야 할 수 있습니다.
COPY --from=builder /app/build/native/nativeCompile/boardgame .

# 애플리케이션이 사용하는 포트 노출 (기본 8080)
EXPOSE 8080

# 애플리케이션 실행 명령어
CMD ["./boardgame"]