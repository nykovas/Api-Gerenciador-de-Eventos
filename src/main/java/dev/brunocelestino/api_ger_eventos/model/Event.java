package dev.brunocelestino.api_ger_eventos.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Negative;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Event {

    private Integer id;
    @NotNull(message = "O nome é obrigatório.")
    private String name;
    @NotNull(message = "A descrição é obrigatória.")
    private String description;
    @NotNull(message = "A localização é obrigatória.")
    private String localization;
    private LocalDate date;
    @Min(value = 1, message = "A capacidade minima é de pelo menos 1 participante.")
    private Integer maxCapacity;
    @Min(value = 0, message = "A quantidade minima de participantes não pode ser abaixo de 0.")
    private Integer subscribers;
    @NotNull(message = "O status do evento precisa estar aberto ou fechado.")
    private EventStatus status;

}
