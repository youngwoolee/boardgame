package com.project.boardgame.endpoint;

import java.util.List;

import com.project.boardgame.endpoint.request.GameUploadRequest;
import com.project.boardgame.endpoint.request.GenerateInfoRequest;
import com.project.boardgame.endpoint.response.admin.AdminGameResponse;
import com.project.boardgame.endpoint.response.admin.AdminUserResponse;
import com.project.boardgame.endpoint.response.admin.GeneratedGameInfoResponse;
import com.project.boardgame.endpoint.response.admin.UploadResponse;
import com.project.boardgame.endpoint.response.admin.AdminUserListResponse;
import com.project.boardgame.service.AiService;
import com.project.boardgame.service.GameService;
import com.project.boardgame.service.ImageService;
import com.project.boardgame.service.UserService;
import com.project.boardgame.service.dto.GeneratedGameDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.project.boardgame.endpoint.response.ResponseDto;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
@Slf4j
public class AdminController {

    private final ImageService imageService;
    private final GameService gameService;
    private final UserService userService;
    private final AiService aiService;
    private final CacheManager cacheManager;

    @PostMapping("/generate-info")
    public ResponseEntity<? super GeneratedGameInfoResponse> generate(@RequestBody GenerateInfoRequest request) {
        try {
            log.info("[log] generate : {}", request.toString());
            GeneratedGameDto dto = aiService.getGameData(request.getBoardGameName());
            return GeneratedGameInfoResponse.success(dto);
        } catch (Exception e) {
            log.error("Error generating game info for '{}': {}", request.getBoardGameName(), e.getMessage());
            return GeneratedGameInfoResponse.fail("게임 정보 생성에 실패했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<? super UploadResponse> createGame(
            @RequestPart("image") MultipartFile image,
            @RequestPart("data") GameUploadRequest request
    ) {
        try {
            log.info("[log] createGame : {}", request.toString());
            String imageUrl = imageService.uploadImage(image);

            gameService.createGame(request, imageUrl);

            return UploadResponse.success(imageUrl);
        } catch (Exception e) {
            return UploadResponse.fail();
        }
    }

    @PostMapping("/upload-by-url")
    public ResponseEntity<? super UploadResponse> createGameByUrl(@RequestBody GameUploadRequest request) {
        try {
            log.info("[log] createGameByUrl : {}", request.toString());
            MultipartFile downloadedImage = imageService.downloadImageFromUrl(request.getImageUrl());

            String uploadedImageUrl = imageService.uploadImage(downloadedImage);

            gameService.createGame(request, uploadedImageUrl);

            return UploadResponse.success(uploadedImageUrl);
        } catch (Exception e) {
            return UploadResponse.fail();
        }
    }

    @PostMapping("/cache/evict-all")
    public ResponseEntity<?> evictAllCaches() {
        cacheManager.getCacheNames().forEach(name -> {
            if (cacheManager.getCache(name) != null) {
                cacheManager.getCache(name).clear();
                log.info("[log] evictAllCaches");
            }
        });
        return ResponseEntity.ok("모든 캐시 초기화 완료");
    }

    @GetMapping("/by-barcode/{barcode}")
    public ResponseEntity<? super AdminGameResponse> getGameByBarcode(@PathVariable("barcode") String barcode) {
        return gameService.getGameByBarcode(barcode);
    }

    @PutMapping("/games/{barcode}")
    public ResponseEntity<? super UploadResponse> updateGame(
            @PathVariable("barcode") String barcode,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart("data") GameUploadRequest request
    ) {
        try {
            String imageUrl = gameService.updateGame(barcode, request, image);
            return UploadResponse.success(imageUrl);
        } catch (Exception e) {
            // Consider more specific error handling
            return UploadResponse.fail();
        }
    }

    @GetMapping("/pending-users")
    public ResponseEntity<? super AdminUserListResponse> getPendingUsers() {
        List<AdminUserResponse> pendingUsers = userService.getPendingUsers();
        return AdminUserListResponse.success(pendingUsers);
    }

    @PostMapping("/approve-user/{userId}")
    public ResponseEntity<ResponseDto> approveUser(
            @PathVariable("userId") Long userId,
            @RequestParam(value = "role", defaultValue = "ROLE_USER") String role) {
        return userService.approveUser(userId, role);
    }
}
