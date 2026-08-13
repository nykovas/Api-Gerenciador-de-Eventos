package dev.brunocelestino.api_ger_eventos.exception;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ErrorResponse {

    private LocalDateTime timeStamp;
    private Integer status;
    private String message;
    private Map<String, String> invalidFields;

}
