package com.project.boardgame.endpoint.response;

import java.util.List;

import com.project.boardgame.domain.Game;
import com.project.boardgame.endpoint.response.auth.EmailCertificationResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Builder
@Getter
@NoArgsConstructor
public class GameListResponse extends ResponseDto{

    private List<GameResponse> data;

    @Builder
    public GameListResponse(List<GameResponse> data) {
        super();
        this.data = data;
    }

    public static ResponseEntity<GameListResponse> success(List<GameResponse> data) {
        GameListResponse responseBody = new GameListResponse(data);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

}
