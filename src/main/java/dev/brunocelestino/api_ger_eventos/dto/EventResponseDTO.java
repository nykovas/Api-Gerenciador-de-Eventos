package dev.brunocelestino.api_ger_eventos.dto;

import dev.brunocelestino.api_ger_eventos.model.EventStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventResponseDTO {

    private Integer id;
    private String name;
    private String description;
    private String localization;
    private LocalDate date;
    private Integer maxCapacity;
    private Integer subscribers;
    private EventStatus status;

}
