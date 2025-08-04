package com.project.boardgame.service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;
import java.util.UUID;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.boardgame.service.dto.UrlMultipartFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
@Slf4j
@RequiredArgsConstructor
public class ImageService {

    @Value("${github.token}")
    private String token;

    @Value("${github.owner}")
    private String owner;

    @Value("${github.repo}")
    private String repo;

    @Value("${github.branch}")
    private String branch;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String uploadImage(MultipartFile file) throws Exception {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String safeFilename = UUID.randomUUID() + extension;

        log.info("[log] uploadImage originalFilename: {}", originalFilename);
        log.info("[log] uploadImage extension: {}", extension);
        log.info("[log] uploadImage safeFilename: {}", safeFilename);
        // ✅ 2. 업로드 경로 설정
        String path = "images/" + safeFilename;
        String apiUrl = String.format("https://api.github.com/repos/%s/%s/contents/%s", owner, repo, path);

        log.info("[log] uploadImage apiUrl: {}", apiUrl);
        // ✅ 3. 파일 Base64 인코딩
        String base64Content = Base64.getEncoder().encodeToString(file.getBytes());
        // ✅ 4. 요청 JSON 구성
        String jsonPayload = objectMapper.createObjectNode()
                .put("message", "upload " + safeFilename)
                .put("content", base64Content)
                .put("branch", branch)
                .toString();

        // ✅ 5. GitHub API 요청 구성
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Authorization", "token " + token)
                .header("Accept", "application/vnd.github+json")
                .header("Content-Type", "application/json")
                .PUT(HttpRequest.BodyPublishers.ofString(jsonPayload))  // ✅ 여기를 PUT으로 변경
                .build();

        // ✅ 6. 요청 전송 및 응답 파싱
        HttpResponse<String> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 201) {
            log.error("[log] uploadImage GitHub 업로드 실패 code: {}", response.statusCode());
            throw new RuntimeException("GitHub 업로드 실패: " + response.body());
        }

        JsonNode jsonNode = objectMapper.readTree(response.body());
        return jsonNode.get("content").get("download_url").asText();
    }

    public MultipartFile downloadImageFromUrl(String imageUrl) throws Exception {
        URL url = new URL(imageUrl);
        URLConnection connection = url.openConnection();
        String contentType = connection.getContentType(); // ex. image/png, image/jpeg

        try (InputStream in = connection.getInputStream()) {
            // InputStream -> byte[]
            log.info("[log] downloadImageFromUrl : {}", url);
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            byte[] data = new byte[8192];
            int bytesRead;
            while ((bytesRead = in.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, bytesRead);
            }
            byte[] imageBytes = buffer.toByteArray();

            // 확장자 추출
            String extension = contentType != null && contentType.contains("/")
                    ? "." + contentType.substring(contentType.indexOf("/") + 1)
                    : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;
            log.info("[log] downloadImageFromUrl : {}.{}", filename, extension);
            return new UrlMultipartFile(
                    imageBytes,
                    "image",         // name
                    filename,        // originalFilename
                    contentType      // contentType
            );
        } catch (Exception e) {
            log.error("[log] downloadImageFromUrl : {}", e.getMessage());
            throw new RuntimeException("이미지 다운로드 실패: " + imageUrl, e);
        }
    }
}
