package dev.brunocelestino.api_ger_eventos.service;

import dev.brunocelestino.api_ger_eventos.database.repository.IEventRepository;
import dev.brunocelestino.api_ger_eventos.dto.EventCount;
import dev.brunocelestino.api_ger_eventos.exception.*;
import dev.brunocelestino.api_ger_eventos.dto.EventDto;
import dev.brunocelestino.api_ger_eventos.dto.SubscribeDto;
import dev.brunocelestino.api_ger_eventos.database.model.EventEntity;
import dev.brunocelestino.api_ger_eventos.dto.EventStatisticsDto;
import dev.brunocelestino.api_ger_eventos.database.model.EventStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final IEventRepository eventRepository;

    public List<EventEntity> list() {
        return eventRepository.findAll(Sort.by("id"));
    }

    public EventEntity create(EventDto eventDto){

        if (eventDto.getDate().isBefore(LocalDate.now())){
            throw new BadRequestException("A data do evento não pode ser menor do que a de hoje.");
        }

        EventEntity event = EventEntity.builder()
                .name(eventDto.getName())
                .description(eventDto.getDescription())
                .localization(eventDto.getLocalization())
                .date(eventDto.getDate())
                .maxCapacity(eventDto.getMaxCapacity())
                .subscribers(eventDto.getSubscribers())
                .status(EventStatus.OPEN)
                .build();

        return eventRepository.save(event);
    }

    public EventEntity searchById(Integer id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Evento não encontrado."));
    }

    public EventEntity patch(EventDto eventDto, Integer id) {
        EventEntity event = searchById(id);

        event.setName(eventDto.getName());
        event.setDescription(eventDto.getDescription());
        event.setLocalization(eventDto.getLocalization());
        event.setDate(eventDto.getDate());

        if (eventDto.getMaxCapacity() < event.getSubscribers()){
            throw new BadRequestException("Não é possível reduzir a capacidade máxima de inscritos para um valor menor do que os já inscritos.");
        }

        event.setMaxCapacity(eventDto.getMaxCapacity());

        eventRepository.save(event);

        return event;

    }

    public void delete(Integer id) {
        EventEntity event = searchById(id);
        eventRepository.delete(event);
    }

    public void subscribe(SubscribeDto subscribeDto) {
        EventEntity event = searchById(subscribeDto.getEventId());

        if (event.getStatus().equals(EventStatus.CLOSED)){
            throw new ConflictException("O evento está fechado.");
        }

        if (subscribeDto.getParticipant() + event.getSubscribers() > event.getMaxCapacity()){
            throw new BadRequestException(String.format(
                    "Quantidade de participantes maior do que a suportada. (%s/%s)",
                    event.getSubscribers(), event.getMaxCapacity())
            );
        }

        event.setSubscribers(subscribeDto.getParticipant() + event.getSubscribers());
        updateStatus(event);

        if (event.getSubscribers().equals(event.getMaxCapacity())){
            event.setStatus(EventStatus.CLOSED);
        }

        eventRepository.save(event);
    }

    public void unsubscribe(SubscribeDto subscribeDto){
        EventEntity event = searchById(subscribeDto.getEventId());
        Integer unsub = subscribeDto.getParticipant();

        int newSubscribers = event.getSubscribers() - unsub;

        if (newSubscribers < 0 ){
            throw new BadRequestException("Não é possível cancelar mais do que a quantidade de inscritos." +
                    "Quantidade de inscritos atual: " + event.getSubscribers());
        }

        event.setSubscribers(newSubscribers);
        updateStatus(event);
        eventRepository.save(event);
    }

    public List<EventEntity> packedEvents(){
        return eventRepository.findByPacked();
    }

    public List<EventEntity> notPackedEvents(){
        return eventRepository.findByNotPacked();
    }

    public List<EventEntity> listOrderByDate() {
        return eventRepository.findAllByOrderByDateAsc();
    }

    public EventCount countEvents() {
        return EventCount.builder()
                .total(eventRepository.findAll().size())
                .build();
    }

    public List<EventEntity> eventsToday() {
        return eventRepository.findAllByToday();
    }

    public EventEntity cancelAllSubscriptions(Integer id) {
        EventEntity event = searchById(id);
        event.setSubscribers(0);
        eventRepository.save(event);
        return event;
    }

    public EventEntity duplicateEvent(Integer id) {
        EventEntity eventToBeDuplicated = searchById(id);

        EventEntity eventDuplicated = EventEntity.builder()
                .name(eventToBeDuplicated.getName() + "(Duplicated)")
                .description(eventToBeDuplicated.getDescription())
                .localization(eventToBeDuplicated.getLocalization())
                .date(eventToBeDuplicated.getDate())
                .maxCapacity(eventToBeDuplicated.getMaxCapacity())
                .subscribers(0)
                .status(EventStatus.OPEN)
                .build();

        eventRepository.save(eventDuplicated);

        return eventDuplicated;
    }

    public EventEntity alternateStatus(Integer id){
        EventEntity event = searchById(id);

        if (event.getStatus().equals(EventStatus.OPEN)){
            event.setStatus(EventStatus.CLOSED);
        } else {
            event.setStatus(EventStatus.OPEN);
        }

        eventRepository.save(event);
        return event;
    }

    public EventStatisticsDto statistics(){

        int totalEvents = eventRepository.findAll().size();
        int openedEvents = notPackedEvents().size();
        int closedEvents = packedEvents().size();
        int totalSubscribers = eventRepository.totalSubscribers();
        int averageSubscribers = eventRepository.averageSubscribers();

        return EventStatisticsDto.builder()
                .totalEvents(totalEvents)
                .openEvents(openedEvents)
                .closedEvents(closedEvents)
                .totalSubscribers(totalSubscribers)
                .averageSubscribers(averageSubscribers)
                .build();
    }

    private void updateStatus(EventEntity event) {
        if (event.getSubscribers().equals(event.getMaxCapacity())) {
            event.setStatus(EventStatus.CLOSED);
        } else {
            event.setStatus(EventStatus.OPEN);
        }
    }
}
