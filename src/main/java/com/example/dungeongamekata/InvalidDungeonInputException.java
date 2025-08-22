package com.example.dungeongamekata;

public class InvalidDungeonInputException extends RuntimeException {
    public InvalidDungeonInputException(String message) {
        super(message);
    }
}