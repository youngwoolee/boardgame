package com.project.boardgame.endpoint.response.admin;

import java.util.List;

import com.project.boardgame.common.ResponseCode;
import com.project.boardgame.common.ResponseMessage;
import com.project.boardgame.endpoint.response.GameResponse;
import com.project.boardgame.endpoint.response.ResponseDto;
import com.project.boardgame.endpoint.response.auth.IdCheckResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
public class UploadResponse extends ResponseDto {

    private String url;

    private UploadResponse(String url) {
        super();
        this.url = url;
    }

    public static ResponseEntity<UploadResponse> success(String url) {
        UploadResponse responseBody = new UploadResponse(url);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> fail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DATABASE_ERROR, ResponseMessage.DATABASE_ERROR);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }
}
