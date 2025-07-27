package com.project.boardgame.service;

import com.project.boardgame.endpoint.response.admin.GeneratedGameInfoResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;


@Service
public class AiService {

    public Mono<GeneratedGameInfoResponse> generateGameInfo(String boardGameName) {
        return Mono.empty();
    }
}
