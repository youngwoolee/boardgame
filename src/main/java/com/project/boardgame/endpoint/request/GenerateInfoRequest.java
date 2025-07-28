package com.project.boardgame.endpoint.request;

import com.project.boardgame.endpoint.response.ResponseDto;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor
public class GenerateInfoRequest {
    private String boardGameName;
}
