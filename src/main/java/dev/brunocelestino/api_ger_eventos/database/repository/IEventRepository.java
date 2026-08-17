package dev.brunocelestino.api_ger_eventos.database.repository;

import dev.brunocelestino.api_ger_eventos.database.model.EventEntity;
import dev.brunocelestino.api_ger_eventos.dto.EventDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IEventRepository extends JpaRepository<EventEntity, Integer> {

    @Query(value = """
            SELECT e FROM EventEntity e
            WHERE e.subscribers = e.maxCapacity
            """)
    List<EventEntity> findByPacked();

    @Query(value = """
            SELECT e FROM EventEntity e
            WHERE e.subscribers < e.maxCapacity
            """)
    List<EventEntity> findByNotPacked();

    List<EventEntity> findAllByOrderByDateAsc();

    @Query(value = """
            SELECT e FROM EventEntity e
            WHERE e.date = CURRENT_DATE
            """)
    List<EventEntity> findAllByToday();

    @Query(value = """
            SELECT SUM(e.subscribers) FROM EventEntity e
            """)
    Integer totalSubscribers();

    @Query(value = """
            SELECT AVG(e.subscribers) FROM EventEntity e
            """)
    Integer averageSubscribers();

}
