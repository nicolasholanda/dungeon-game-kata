package com.example.dungeongamekata;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/dungeon")
public class DungeonController {
    private final DungeonService dungeonService;
    private final ModelRunRepository modelRunRepository;
    private final ObjectMapper objectMapper;

    public DungeonController(DungeonService dungeonService, ModelRunRepository modelRunRepository, ObjectMapper objectMapper) {
        this.dungeonService = dungeonService;
        this.modelRunRepository = modelRunRepository;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/solve")
    public DungeonResponse calculateMinimumHP(@RequestBody int[][] dungeon) {
        validateDungeon(dungeon);

        try {
            String inputJson = objectMapper.writeValueAsString(dungeon);

            Optional<ModelRun> existingRun = modelRunRepository.findByInput(inputJson);
            if (existingRun.isPresent()) {
                return objectMapper.readValue(existingRun.get().getOutput(), DungeonResponse.class);
            }

            DungeonResponse response = dungeonService.calculateMinimumHP(dungeon);
            String outputJson = objectMapper.writeValueAsString(response);
            modelRunRepository.save(ModelRun.of(inputJson, outputJson));

            return response;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao processar JSON", e);
        }
    }
    private void validateDungeon(int[][] dungeon) {
        if (dungeon == null || dungeon.length == 0) {
            throw new InvalidDungeonInputException("Dungeon array cannot be null or empty");
        }

        int rows = dungeon.length;
        int cols = dungeon[0].length;

        if (cols == 0) {
            throw new InvalidDungeonInputException("Dungeon array cannot have empty rows");
        }

        // Validate that all rows have the same length
        for (int i = 1; i < rows; i++) {
            if (dungeon[i].length != cols) {
                throw new InvalidDungeonInputException("All rows in dungeon must have the same length");
            }
        }
    }
}
