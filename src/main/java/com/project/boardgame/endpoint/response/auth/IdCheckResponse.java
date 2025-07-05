package com.project.boardgame.endpoint.response.auth;

import com.project.boardgame.common.ResponseCode;
import com.project.boardgame.common.ResponseMessage;
import com.project.boardgame.endpoint.response.ResponseDto;
import jakarta.persistence.Id;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
public class IdCheckResponse extends ResponseDto {

    private IdCheckResponse() {
        super();
    }

    public static ResponseEntity<IdCheckResponse> success() {
        IdCheckResponse responseBody = new IdCheckResponse();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> duplicateId() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATE_ID, ResponseMessage.DUPLICATE_ID);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);

    }
}
