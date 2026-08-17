package dev.brunocelestino.api_ger_eventos.handler;

import dev.brunocelestino.api_ger_eventos.dto.ErrorResponseDto;
import dev.brunocelestino.api_ger_eventos.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalHandlerException {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNotFound(NotFoundException ex){
        ErrorResponseDto response =
                buildResponse(
                        ex.getMessage(),
                        HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResponseDto> handleConflict(ConflictException ex){
        ErrorResponseDto response =
                buildResponse(
                        ex.getMessage(),
                        HttpStatus.CONFLICT.value());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponseDto> handleBadRequest(BadRequestException ex){
        ErrorResponseDto response =
                buildResponse(
                        ex.getMessage(),
                        HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<ErrorResponse> methodArgumentNotValidException(MethodArgumentNotValidException ex){
//        Map<String, String> errors = new HashMap<>();
//
//        ex.getBindingResult()
//                .getAllErrors()
//                .forEach((error) -> {
//            String fieldName = ((FieldError) error).getField();
//            String errorMessage = error.getDefaultMessage();
//            errors.put(fieldName, errorMessage);
//        });
//
//        ErrorResponse response = ErrorResponse.builder()
//                .timeStamp(LocalDateTime.now())
//                .status(HttpStatus.BAD_REQUEST.value())
//                .message(ex.getMessage())
//                .invalidFields(errors)
//                .build();
//
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
//    }

    private ErrorResponseDto buildResponse(String message, int status){
        return ErrorResponseDto.builder()
                .message(message)
                .status(status)
                .build();
    }
}
