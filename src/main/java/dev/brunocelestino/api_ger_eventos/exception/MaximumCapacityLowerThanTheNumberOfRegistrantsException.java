package dev.brunocelestino.api_ger_eventos.exception;

public class MaximumCapacityLowerThanTheNumberOfRegistrantsException extends RuntimeException {
    public MaximumCapacityLowerThanTheNumberOfRegistrantsException(String message) {
        super(message);
    }
}
