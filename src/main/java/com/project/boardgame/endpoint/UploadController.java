package com.project.boardgame.endpoint;

import com.project.boardgame.endpoint.request.GameUploadRequest;
import com.project.boardgame.endpoint.response.admin.UploadResponse;
import com.project.boardgame.service.GameService;
import com.project.boardgame.service.GithubUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class UploadController {

    private final GithubUploadService githubUploadService;
    private final GameService gameService;

    @PostMapping("/upload")
    public ResponseEntity<? super UploadResponse> createGame(
            @RequestPart("image") MultipartFile image,
            @RequestPart("data") GameUploadRequest request
    ) {
        try {
            // ✅ 1. 이미지 GitHub 업로드
            String imageUrl = githubUploadService.uploadImage(image);

            // ✅ 2. 게임 정보 저장
            gameService.createGame(request, imageUrl);

            return UploadResponse.success(imageUrl);
        } catch (Exception e) {
            return UploadResponse.fail();
        }
    }
}
