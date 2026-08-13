package dev.brunocelestino.api_ger_eventos.exception;

public class TooManyCancellationsException extends RuntimeException {
    public TooManyCancellationsException(String message) {
        super(message);
    }
}
