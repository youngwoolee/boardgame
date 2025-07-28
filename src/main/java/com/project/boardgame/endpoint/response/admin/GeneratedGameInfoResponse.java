package com.project.boardgame.endpoint.response.admin;

import java.util.List;

import com.project.boardgame.common.ResponseCode;
import com.project.boardgame.common.ResponseMessage;
import com.project.boardgame.endpoint.response.ResponseDto;
import com.project.boardgame.service.dto.GeneratedGameDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneratedGameInfoResponse extends ResponseDto {
    private String description;
    private int minPlayers;
    private int maxPlayers;
    private int age;
    private int time;
    private List<String> genres;
    private List<String> systems;
    private String imageUrl;

    public static GeneratedGameInfoResponse from(GeneratedGameDto dto) {
        return GeneratedGameInfoResponse.builder()
                .description(dto.getDescription())
                .minPlayers(dto.getMinPlayers())
                .maxPlayers(dto.getMaxPlayers())
                .age(dto.getAge())
                .time(dto.getTime())
                .genres(dto.getGenres())
                .systems(dto.getSystems())
                .imageUrl(dto.getImageUrl())
                .build();
    }

    public static ResponseEntity<GeneratedGameInfoResponse> success(GeneratedGameDto dto) {
        GeneratedGameInfoResponse responseBody = GeneratedGameInfoResponse.from(dto);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> fail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DATABASE_ERROR, ResponseMessage.DATABASE_ERROR);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }
}
