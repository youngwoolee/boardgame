package com.project.boardgame.endpoint.request;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class GameUploadRequest {
    private String name;
    private String description;
    private int minPlayers;
    private int maxPlayers;
    private String age;
    private String time;
    private String genre;
    private String system;
    private String barcode;
}
