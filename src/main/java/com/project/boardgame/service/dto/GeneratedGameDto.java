package com.project.boardgame.service.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GeneratedGameDto {
    private String description;
    private int minPlayers;
    private int maxPlayers;
    private int bestPlayers;
    private int age;
    private int minPlayTime;
    private int maxPlayTime;
    private double weight;
    private List<String> genres;
    private List<String> systems;
    private String imageUrl;
}
