package com.project.boardgame.service.dto;

import java.util.List;

import com.project.boardgame.endpoint.response.ResponseDto;
import com.project.boardgame.endpoint.response.admin.UploadResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GameGeneratedDto extends ResponseDto {
    private String name;
    private String description;
    private int minPlayers;
    private int maxPlayers;
    private int age;
    private int time;
    private List<String> genres;
    private List<String> systems;
}
