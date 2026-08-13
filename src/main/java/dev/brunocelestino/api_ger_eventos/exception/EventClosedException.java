package dev.brunocelestino.api_ger_eventos.exception;

public class EventClosedException extends RuntimeException {
    public EventClosedException(String message) {
        super(message);
    }
}
