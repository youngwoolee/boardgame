FROM alpine:latest

# 필요한 라이브러리 설치
RUN apk --no-cache add libstdc++ ca-certificates && update-ca-certificates

# 앱 실행 디렉토리 생성
WORKDIR /app

# 실행 파일 복사 (host 경로 확인 필수)
COPY build/native/nativeCompile/boardgame .

# 실행 권한 부여 (권한 없으면 Error)
RUN chmod +x ./boardgame

# 포트 개방
EXPOSE 8080

# 실행 명령
CMD ["./boardgame"]