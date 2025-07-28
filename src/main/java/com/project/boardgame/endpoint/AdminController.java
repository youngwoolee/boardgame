package com.project.boardgame.endpoint;

import com.project.boardgame.endpoint.request.GameUploadRequest;
import com.project.boardgame.endpoint.request.GenerateInfoRequest;
import com.project.boardgame.endpoint.response.admin.GeneratedGameInfoResponse;
import com.project.boardgame.endpoint.response.admin.UploadResponse;
import com.project.boardgame.service.AiService;
import com.project.boardgame.service.GameService;
import com.project.boardgame.service.GithubUploadService;
import com.project.boardgame.service.dto.GeneratedGameDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final GithubUploadService githubUploadService;
    private final GameService gameService;
    private final AiService aiService;

    @PostMapping("/generate-info")
    public ResponseEntity<? super GeneratedGameInfoResponse> generate(@RequestBody GenerateInfoRequest request) {

        GeneratedGameDto dto = aiService.generate(request.getBoardGameName());
        return GeneratedGameInfoResponse.success(dto);
    }

    @PostMapping("/upload")
    public ResponseEntity<? super UploadResponse> createGame(
            @RequestPart("image") MultipartFile image,
            @RequestPart("data") GameUploadRequest request
    ) {
        try {
            String imageUrl = githubUploadService.uploadImage(image);

            gameService.createGame(request, imageUrl);

            return UploadResponse.success(imageUrl);
        } catch (Exception e) {
            return UploadResponse.fail();
        }
    }

    @PostMapping("/upload-by-url")
    public ResponseEntity<? super UploadResponse> createGameByUrl(@RequestBody GameUploadRequest request) {
        try {
            MultipartFile downloadedImage = githubUploadService.downloadImageFromUrl(request.getImageUrl());

            String uploadedImageUrl = githubUploadService.uploadImage(downloadedImage);

            gameService.createGame(request, uploadedImageUrl);

            return UploadResponse.success(uploadedImageUrl);
        } catch (Exception e) {
            return UploadResponse.fail();
        }
    }
}
