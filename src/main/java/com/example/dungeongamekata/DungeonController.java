package com.example.dungeongamekata;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dungeon")
public class DungeonController {
    private final DungeonService dungeonService;
    private final ModelRunRepository modelRunRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public DungeonController(DungeonService dungeonService, ModelRunRepository modelRunRepository) {
        this.dungeonService = dungeonService;
        this.modelRunRepository = modelRunRepository;
    }

    @PostMapping("/solve")
    public int calculateMinimumHP(@RequestBody int[][] dungeon) {
        validateDungeon(dungeon);
        int result = dungeonService.calculateMinimumHP(dungeon);

        try {
            String inputJson = objectMapper.writeValueAsString(dungeon);
            String outputStr = Integer.toString(result);
            modelRunRepository.save(ModelRun.of(inputJson, outputStr));
        } catch (JsonProcessingException e) {
           
        }

        return result;
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
