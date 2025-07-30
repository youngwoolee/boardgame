package com.project.boardgame.provider;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.project.boardgame.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class BarcodeGenerator {

    private final GameRepository gameRepository;
    private final Random random = new SecureRandom();

    public List<String> generateUniqueBarcodes(int count) {
        List<String> result = new ArrayList<>();

        while (true) {
            String prefix = generateRandomPrefix();
            List<String> candidates = new ArrayList<>();

            for (int i = 1; i <= count; i++) {
                candidates.add(String.format("%s-%02d", prefix, i));
            }

            boolean hasConflict = candidates.stream()
                                            .anyMatch(code -> gameRepository.existsByBarcode(code));

            if (!hasConflict) {
                return candidates;
            }
            // 중복된 경우 새로운 prefix 생성
        }
    }

    private String generateRandomPrefix() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            sb.append(characters.charAt(random.nextInt(characters.length())));
        }
        return sb.toString();
    }
}
