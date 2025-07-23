package com.project.boardgame.endpoint.request;

import java.util.Set;

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
    private Set<String> genres;
    private Set<String> systems;
    private String barcode;
}
