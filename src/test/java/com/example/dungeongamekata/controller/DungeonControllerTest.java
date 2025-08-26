package com.example.dungeongamekata.controller;

import com.example.dungeongamekata.dto.DungeonResponse;
import com.example.dungeongamekata.exception.GlobalExceptionHandler;
import com.example.dungeongamekata.repository.ModelRunRepository;
import com.example.dungeongamekata.service.DungeonService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class DungeonControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DungeonService dungeonService;

    @Mock
    private ModelRunRepository modelRunRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        DungeonController controller = new DungeonController(dungeonService, modelRunRepository, objectMapper);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void postSolve_WithMalformedJson_ReturnsFormattedErrorResponse() throws Exception {
        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{invalid json"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is("Invalid JSON format or malformed request body")))
                .andExpect(jsonPath("$.statusCode", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.path", is("/dungeon/solve")))
                .andExpect(jsonPath("$.timestamp", matchesPattern("\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}")));
    }

    @Test
    void postSolve_WithEmptyBody_ReturnsFormattedErrorResponse() throws Exception {
        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is("Invalid JSON format or malformed request body")))
                .andExpect(jsonPath("$.statusCode", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.path", is("/dungeon/solve")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    void postSolve_WithWrongContentType_ReturnsFormattedErrorResponse() throws Exception {
        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.TEXT_PLAIN)
                .content("not json"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is("An unexpected error occurred")))
                .andExpect(jsonPath("$.statusCode", is(500)))
                .andExpect(jsonPath("$.error", is("Internal Server Error")));
    }

    @Test
    void postSolve_WithInvalidJsonStructure_ReturnsFormattedErrorResponse() throws Exception {
        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"invalid\": \"structure\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is("Invalid JSON format or malformed request body")))
                .andExpect(jsonPath("$.statusCode", is(400)))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    void postSolve_WhenServiceThrowsRuntimeException_ReturnsFormattedErrorResponse() throws Exception {
        when(dungeonService.calculateMinimumHP(any())).thenThrow(new RuntimeException("Service error"));

        int[][] validDungeon = {{1, 2}, {3, 4}};

        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validDungeon)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is("An unexpected error occurred")))
                .andExpect(jsonPath("$.statusCode", is(500)))
                .andExpect(jsonPath("$.error", is("Internal Server Error")))
                .andExpect(jsonPath("$.path", is("/dungeon/solve")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    void postSolve_WithValidInput_ReturnsSuccessfulResponse() throws Exception {
        int[][] validDungeon = {{1, 2}, {3, 4}};
        DungeonResponse mockResponse = new DungeonResponse(42, List.of(new int[]{0, 0}, new int[]{1, 1}));
        when(dungeonService.calculateMinimumHP(any())).thenReturn(mockResponse);



        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validDungeon)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.minimumHP").value(42))
                .andExpect(jsonPath("$.path").isArray())
                .andExpect(jsonPath("$.path[0][0]").value(0))
                .andExpect(jsonPath("$.path[0][1]").value(0))
                .andExpect(jsonPath("$.path[1][0]").value(1))
                .andExpect(jsonPath("$.path[1][1]").value(1));
    }

    @Test
    void postSolve_WithEmptyDungeonArray_ReturnsInvalidDungeonInputError() throws Exception {
        int[][] emptyDungeon = {};

        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emptyDungeon)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Dungeon array cannot be null or empty")))
                .andExpect(jsonPath("$.statusCode", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    void postSolve_WithEmptyRows_ReturnsInvalidDungeonInputError() throws Exception {
        int[][] dungeonWithEmptyRow = {{}};

        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dungeonWithEmptyRow)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Dungeon array cannot have empty rows")))
                .andExpect(jsonPath("$.statusCode", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    void postSolve_WithInconsistentRowLengths_ReturnsInvalidDungeonInputError() throws Exception {
        int[][] dungeonWithInconsistentRows = {{1, 2}, {3}};

        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dungeonWithInconsistentRows)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("All rows in dungeon must have the same length")))
                .andExpect(jsonPath("$.statusCode", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }
}
