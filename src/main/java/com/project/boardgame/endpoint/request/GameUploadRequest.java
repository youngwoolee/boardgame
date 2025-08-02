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
    private int bestPlayers;
    private int age;
    private int minPlayTime;
    private int maxPlayTime;
    private double weight;
    private Set<String> genres;
    private Set<String> systems;
    private String imageUrl;
    private int quantity;
}
