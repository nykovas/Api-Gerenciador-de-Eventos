package dev.brunocelestino.api_ger_eventos.database.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "eventos")
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String description;
    private String localization;
    private LocalDate date;
    @Column(name = "max_capacity")
    private Integer maxCapacity;
    private Integer subscribers;
    @Enumerated(EnumType.STRING)
    private EventStatus status;

}
