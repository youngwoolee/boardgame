package com.project.boardgame.endpoint.request;

import java.util.Set;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class GameUploadRequest {
    private String name;
    private String description;
    private int minPlayers;
    private int maxPlayers;
    private int age;
    private String time;
    private Set<String> genres;
    private Set<String> systems;
    private String imageUrl;
    private int quantity;
}
