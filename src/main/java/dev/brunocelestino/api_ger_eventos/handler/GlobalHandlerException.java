package dev.brunocelestino.api_ger_eventos.handler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import dev.brunocelestino.api_ger_eventos.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalHandlerException {

    @ExceptionHandler(EventNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEventNotFoundException(EventNotFoundException ex){
        ErrorResponse response =
                buildResponse(
                        ex.getMessage(),
                        HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(TooManyCancellationsException.class)
    public ResponseEntity<ErrorResponse> handleTooManyCancellationsException(TooManyCancellationsException ex){
        ErrorResponse response =
                buildResponse(
                        ex.getMessage(),
                        HttpStatus.BAD_REQUEST.value());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(MaximumCapacityException.class)
    public ResponseEntity<ErrorResponse> handleMaxiumCapacityException(MaximumCapacityException ex){
        ErrorResponse response =
                buildResponse(
                        ex.getMessage(),
                        HttpStatus.BAD_REQUEST.value());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(EventClosedException.class)
    public ResponseEntity<ErrorResponse> eventClosedException(EventClosedException ex){
        ErrorResponse response =
                buildResponse(
                        ex.getMessage(),
                        HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> methodArgumentNotValidException(MethodArgumentNotValidException ex){
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getAllErrors()
                .forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse response = ErrorResponse.builder()
                .timeStamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .invalidFields(errors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> DateEarlierThanTodayException(DateEarlierThanTodayException ex){
        ErrorResponse response =
                buildResponse(
                        ex.getMessage(),
                        HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> MaximumCapacityLowerThanTheNumberOfRegistrantsException(MaximumCapacityLowerThanTheNumberOfRegistrantsException ex){
        ErrorResponse response =
                buildResponse(
                        ex.getMessage(),
                        HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    private ErrorResponse buildResponse(String message, int status){
        return ErrorResponse.builder()
                .message(message)
                .status(status)
                .build();
    }
}
