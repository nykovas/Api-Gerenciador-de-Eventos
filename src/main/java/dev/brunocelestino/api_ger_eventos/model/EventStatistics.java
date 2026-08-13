package dev.brunocelestino.api_ger_eventos.model;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventStatistics {

    private int totalEvents;
    private int openEvents;
    private int closedEvents;
    private int totalSubscribers;
    private int averageSubscribers;


}
