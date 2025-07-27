package com.project.boardgame.endpoint.request;

import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor
public class GenerateInfoRequest {
    private String boardGameName;
}
