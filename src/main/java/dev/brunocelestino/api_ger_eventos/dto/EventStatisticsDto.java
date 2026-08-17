package dev.brunocelestino.api_ger_eventos.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventStatisticsDto {

    private int totalEvents;
    private int openEvents;
    private int closedEvents;
    private int totalSubscribers;
    private int averageSubscribers;


}
