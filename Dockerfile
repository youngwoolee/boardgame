FROM alpine:latest

# 필수 패키지 설치
RUN apk --no-cache add libstdc++

# 앱 실행 디렉토리
WORKDIR /app

# Native Binary 복사 (로컬에서 빌드한 것)
COPY build/native/nativeCompile/boardgame .

# 실행 포트
EXPOSE 8080

# 실행 명령
CMD ["./boardgame"]