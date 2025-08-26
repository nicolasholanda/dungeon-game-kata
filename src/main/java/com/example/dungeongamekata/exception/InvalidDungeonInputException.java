package com.example.dungeongamekata.exception;

public class InvalidDungeonInputException extends RuntimeException {
    public InvalidDungeonInputException(String message) {
        super(message);
    }
}