package com.example.dungeongamekata.controller;

import com.example.dungeongamekata.service.DungeonService;
import com.example.dungeongamekata.dto.DungeonResponse;
import com.example.dungeongamekata.exception.InvalidDungeonInputException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dungeon")
public class DungeonController {
    private final DungeonService dungeonService;


    public DungeonController(DungeonService dungeonService) {
        this.dungeonService = dungeonService;
    }

    @PostMapping("/solve")
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
