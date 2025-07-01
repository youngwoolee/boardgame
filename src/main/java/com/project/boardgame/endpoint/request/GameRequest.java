package com.project.boardgame.endpoint.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameRequest {
    private String name;
    private String description;
    private int totalQuantity;
}
