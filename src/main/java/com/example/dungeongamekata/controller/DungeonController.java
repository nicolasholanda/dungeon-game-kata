package com.example.dungeongamekata.controller;

import com.example.dungeongamekata.service.DungeonService;
import com.example.dungeongamekata.dto.DungeonResponse;
import com.example.dungeongamekata.exception.InvalidDungeonInputException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Tag(name = "Dungeon", description = "Dungeon management API")
@RestController
public class DungeonController {
    private final DungeonService dungeonService;


    public DungeonController(DungeonService dungeonService) {
        this.dungeonService = dungeonService;
    }

    @GetMapping("/hello")
    public Map<String,String> hello() { return Map.of("status","ok"); }

    @Operation(summary = "Calculate Minimum HP", description = "Calculates the minimum initial health points required to navigate the dungeon grid.")
    @PostMapping("/dungeon/solve")
    public DungeonResponse calculateMinimumHP(@RequestBody int[][] dungeonGrid) {
        validateInputGridForDungeon(dungeonGrid);
        return dungeonService.calculateMinimumHP(dungeonGrid);
    }

    /**
     * Validate the dungeon input.
     *
     * @param dungeon
     */
    private void validateInputGridForDungeon(int[][] dungeon) {
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
