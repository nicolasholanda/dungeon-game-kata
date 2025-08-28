package com.example.dungeongamekata.service;

import com.example.dungeongamekata.dto.DungeonResponse;
import com.example.dungeongamekata.dto.ModelRun;
import com.example.dungeongamekata.repository.ModelRunRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class DungeonService {

    private final ModelRunRepository modelRunRepository;
    private final ObjectMapper objectMapper;

    public DungeonService(ModelRunRepository modelRunRepository, ObjectMapper objectMapper) {
        this.modelRunRepository = modelRunRepository;
        this.objectMapper = objectMapper;
    }

    public DungeonResponse calculateMinimumHP(int[][] dungeonGrid) {
        String inputJson;
        try {
            inputJson = objectMapper.writeValueAsString(dungeonGrid);
        } catch (Exception e) {
            log.error("Error processing JSON for dungeon calculation", e);
            throw new RuntimeException("Error processing JSON", e);
        }

        Optional<DungeonResponse> cachedResult = getCachedResult(inputJson);
        if (cachedResult.isPresent()) {
            return cachedResult.get();
        }

        DungeonResponse response = executeCalculateMinimumHP(dungeonGrid);
        try {
            saveCacheResult(inputJson, response);
        } catch (Exception e) {
            log.warn("Database unavailable for caching result, returning calculated response: {}", e.getMessage());
        }

        return response;
    }

    private Optional<DungeonResponse> getCachedResult(String inputJson) {
        try {
            Optional<ModelRun> existingRun = modelRunRepository.findByInput(inputJson);
            if (existingRun.isPresent()) {
                return Optional.of(objectMapper.readValue(existingRun.get().getOutput(), DungeonResponse.class));
            }
        } catch (Exception e) {
            log.warn("Database unavailable for cache lookup, proceeding with calculation: {}", e.getMessage());
        }
        return Optional.empty();
    }

    private void saveCacheResult(String inputJson, DungeonResponse response) throws JsonProcessingException {
        String outputJson = objectMapper.writeValueAsString(response);
        modelRunRepository.save(ModelRun.of(inputJson, outputJson));
    }

    /**
     * Calculate the minimum initial health required to rescue the princess in the dungeon.
     * @param dungeon
     * @return
     */
    private DungeonResponse executeCalculateMinimumHP(int[][] dungeon) {
        int m = dungeon.length;
        int n = dungeon[0].length;

        int[][] dp = new int[m+1][n+1];

        for (int i = 0; i <= m; i++)
            Arrays.fill(dp[i], Integer.MAX_VALUE);

        dp[m][n-1] = 1;
        dp[m-1][n] = 1;

        for (int i = m-1; i >= 0; i--) {
            for (int j = n-1; j >= 0; j--) {
                int minHp = Math.min(dp[i+1][j], dp[i][j+1])  - dungeon[i][j];
                dp[i][j] = (minHp <= 0) ? 1 : minHp;
            }
        }

        List<int[]> path = new ArrayList<>();
        int i = 0, j = 0;
        while (i < m && j < n) {
            path.add(new int[]{i, j});
            if (i == m - 1 && j == n - 1) break;

            if (i + 1 < m && j + 1 < n) {
                if (dp[i + 1][j] < dp[i][j + 1]) {
                    i++;
                } else {
                    j++;
                }
            } else if (i + 1 < m) {
                i++;
            } else {
                j++;
            }
        }

        return new DungeonResponse(dp[0][0], path);
    }
}
