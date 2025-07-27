package com.project.boardgame.endpoint.response.admin;

import java.util.List;

import com.project.boardgame.common.ResponseCode;
import com.project.boardgame.common.ResponseMessage;
import com.project.boardgame.endpoint.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
public class GeneratedGameInfoResponse extends ResponseDto {
    private String description;
    private int minPlayers;
    private int maxPlayers;
    private int age;
    private int time;
    private List<String> genres;
    private List<String> systems;

    public static ResponseEntity<ResponseDto> fail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DATABASE_ERROR, ResponseMessage.DATABASE_ERROR);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }
}
