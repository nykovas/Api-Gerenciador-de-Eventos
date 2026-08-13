package dev.brunocelestino.api_ger_eventos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubscribeDto {
    @NotNull(message = "O id do evento é obrigatório.")
    private Integer eventId;
    @NotNull(message = "Quantidade de participante é obrigatória")
    @Min(value = 0, message = "A quantidade minima de participantes não pode ser abaixo de 0.")
    private Integer participant;

}
