package com.project.boardgame.endpoint.request;

import com.project.boardgame.endpoint.response.ResponseDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Getter
@NoArgsConstructor
@ToString
public class GenerateInfoRequest {
    private String boardGameName;
}
