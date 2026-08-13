package dev.brunocelestino.api_ger_eventos.exception;

public class DateEarlierThanTodayException extends RuntimeException {
    public DateEarlierThanTodayException(String message){
        super(message);
    }
}
