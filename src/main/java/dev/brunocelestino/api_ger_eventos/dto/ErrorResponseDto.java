package dev.brunocelestino.api_ger_eventos.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ErrorResponseDto {

    private LocalDateTime timeStamp;
    private Integer status;
    private String message;

}
