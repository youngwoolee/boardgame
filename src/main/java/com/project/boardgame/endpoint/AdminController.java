package com.project.boardgame.endpoint;

import com.project.boardgame.endpoint.request.GameUploadRequest;
import com.project.boardgame.endpoint.request.GenerateInfoRequest;
import com.project.boardgame.endpoint.response.ResponseDto;
import com.project.boardgame.endpoint.response.admin.GeneratedGameInfoResponse;
import com.project.boardgame.endpoint.response.admin.UploadResponse;
import com.project.boardgame.service.AiService;
import com.project.boardgame.service.GameService;
import com.project.boardgame.service.GithubUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final GithubUploadService githubUploadService;
    private final GameService gameService;
    private final AiService aiService;

    @PostMapping("/generate-info")
    public Mono<ResponseEntity<?>> generateGameInfo(@RequestBody GenerateInfoRequest request) {

        Mono<ResponseEntity<?>> successMono = aiService.generateGameInfo(request.getBoardGameName())
                .map(ResponseEntity::ok);

        return successMono
                .onErrorResume(error -> {
                    error.printStackTrace();
                    return Mono.just(ResponseDto.databaseError());
                })
                .defaultIfEmpty(ResponseDto.databaseError());
    }

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
