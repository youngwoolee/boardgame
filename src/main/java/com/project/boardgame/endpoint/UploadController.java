package com.project.boardgame.endpoint;

import com.project.boardgame.endpoint.response.admin.UploadResponse;
import com.project.boardgame.service.GithubUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class UploadController {

    private final GithubUploadService githubUploadService;

    @PostMapping("/upload")
    public ResponseEntity<? super UploadResponse> uploadToGithub(@RequestParam("image") MultipartFile image) {
        try {
            String url = githubUploadService.uploadImage(image);
            return UploadResponse.success(url);
        } catch (Exception e) {
            return UploadResponse.fail();
        }
    }
}
