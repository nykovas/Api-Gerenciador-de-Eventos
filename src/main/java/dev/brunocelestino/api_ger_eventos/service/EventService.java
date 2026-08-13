package dev.brunocelestino.api_ger_eventos.service;

import dev.brunocelestino.api_ger_eventos.dto.EventCount;
import dev.brunocelestino.api_ger_eventos.exception.*;
import dev.brunocelestino.api_ger_eventos.dto.EventDto;
import dev.brunocelestino.api_ger_eventos.dto.SubscribeDto;
import dev.brunocelestino.api_ger_eventos.model.Event;
import dev.brunocelestino.api_ger_eventos.model.EventStatistics;
import dev.brunocelestino.api_ger_eventos.model.EventStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class EventService {

    private final List<Event> events = new ArrayList<>();

    public List<Event> list() {
        return List.copyOf(events);
    }

    public Event create(EventDto eventDto) {

        Integer id = events.stream()
                .mapToInt(Event::getId)
                .max()
                .orElse(0) + 1;

        Event event = new Event(
                id,
                eventDto.getName(),
                eventDto.getDescription(),
                eventDto.getLocalization(),
                eventDto.getDate(),
                eventDto.getMaxCapacity(),
                eventDto.getSubscribers(),
                EventStatus.OPEN);

        if (event.getDate().isBefore(LocalDate.now())){
            throw new DateEarlierThanTodayException("Não é possível criar eventos que não sejam a partir de hoje.");
        }

        events.add(event);
        return event;
    }

    public Event searchById(Integer id) {
        return events.stream()
                .filter(e -> e.getId().equals(id))
                .findAny()
                .orElseThrow(() -> new EventNotFoundException("Evento não encontrado."));
    }

    public Event patch(EventDto eventDto, Integer id) {
        Event event = searchById(id);

        event.setName(eventDto.getName());
        event.setDescription(eventDto.getDescription());
        event.setLocalization(eventDto.getLocalization());
        event.setDate(eventDto.getDate());
        if (event.getMaxCapacity() <= event.getSubscribers()){
            throw new MaximumCapacityLowerThanTheNumberOfRegistrantsException("Não é possível reduzir a capacidade máxima de inscritos para um valor menor do que os já inscritos.");
        }
        event.setMaxCapacity(eventDto.getMaxCapacity());
        return event;

    }

    public void delete(Integer id) {
        Event event = searchById(id);
        events.remove(event);
    }

    public void subscribe(SubscribeDto subscribeDto) {
        Event event = searchById(subscribeDto.getEventId());

        if (event.getStatus().equals(EventStatus.CLOSED)){
            throw new EventClosedException("O evento está fechado.");
        }

        if (subscribeDto.getParticipant() + event.getSubscribers() > event.getMaxCapacity()){
            throw new MaximumCapacityException("Quantidade de participantes maior do que a suportada. " +
                    "("+event.getSubscribers()+"/"+event.getMaxCapacity()+")");
        }

        event.setSubscribers(subscribeDto.getParticipant() + event.getSubscribers());
        updateStatus(event);

        if (event.getSubscribers().equals(event.getMaxCapacity())){
            event.setStatus(EventStatus.CLOSED);
        }
    }

    public void unsubscribe(SubscribeDto subscribeDto){
        Event event = searchById(subscribeDto.getEventId());
        Integer unsub = subscribeDto.getParticipant();

        int newSubscribers = event.getSubscribers() - unsub;

        if (newSubscribers < 0 ){
            throw new TooManyCancellationsException("Não é possível cancelar mais do que a quantidade de inscritos." +
                    "Quantidade de inscritos atual: " + event.getSubscribers());
        }

        event.setSubscribers(newSubscribers);
        updateStatus(event);
    }

    public List<Event> packedEvents(){
        return events.stream()
                .filter(e -> e.getSubscribers().equals(e.getMaxCapacity()))
                .toList();
    }

    public List<Event> notPackedEvents(){
        return events.stream()
                .filter(e -> e.getSubscribers() < e.getMaxCapacity())
                .toList();
    }

    public List<Event> listOrderByDate() {
        return events.stream()
                .sorted(Comparator.comparing(Event::getDate))
                .toList();
    }

    public EventCount countEvents() {
        int size = events.size();
        return EventCount.builder()
                .total(size)
                .build();
    }

    public List<Event> eventsToday() {
        return events.stream()
                .filter(e -> LocalDate.now().equals(e.getDate()))
                .toList();
    }

    public Event cancelAllSubscriptions(Integer id) {
        Event event = searchById(id);
        event.setSubscribers(0);
        return event;
    }

    public Event duplicateEvent(Integer id) {
        Event eventToBeDuplicated = searchById(id);

        Integer newId = events.stream()
                .mapToInt(Event::getId)
                .max()
                .orElse(0) + 1;

        Event eventDuplicated = Event.builder()
                .id(newId)
                .name(eventToBeDuplicated.getName())
                .description(eventToBeDuplicated.getDescription())
                .localization(eventToBeDuplicated.getLocalization())
                .date(eventToBeDuplicated.getDate())
                .maxCapacity(eventToBeDuplicated.getMaxCapacity())
                .subscribers(0)
                .status(EventStatus.OPEN)
                .build();

        events.add(eventDuplicated);

        return eventDuplicated;
    }

    public Event alternateStatus(Integer id){
        Event event = searchById(id);

        if (event.getStatus().equals(EventStatus.OPEN)){
            event.setStatus(EventStatus.CLOSED);
        } else {
            event.setStatus(EventStatus.OPEN);
        }

        return event;
    }

    public EventStatistics statistics(){

        int totalEvents = events.size();
        int openedEvents = Math.toIntExact(events.stream()
                .filter(e -> e.getStatus().equals(EventStatus.OPEN))
                .count());
        int closedEvents = Math.toIntExact(events.stream()
                .filter(e -> e.getStatus().equals(EventStatus.CLOSED))
                .count());

        int totalSubscribers = events.stream()
                .mapToInt(Event::getSubscribers)
                .sum();

        int averageSubscribers = (int) events.stream()
                .mapToInt(Event::getSubscribers)
                .average()
                .orElse(0);

        return EventStatistics.builder()
                .totalEvents(totalEvents)
                .openEvents(openedEvents)
                .closedEvents(closedEvents)
                .totalSubscribers(totalSubscribers)
                .averageSubscribers(averageSubscribers)
                .build();

    }

    private void updateStatus(Event event) {
        if (event.getSubscribers().equals(event.getMaxCapacity())) {
            event.setStatus(EventStatus.CLOSED);
        } else {
            event.setStatus(EventStatus.OPEN);
        }
    }
}
