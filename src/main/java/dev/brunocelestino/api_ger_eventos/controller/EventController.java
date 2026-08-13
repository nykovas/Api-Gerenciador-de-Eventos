package dev.brunocelestino.api_ger_eventos.controller;

import dev.brunocelestino.api_ger_eventos.dto.EventCount;
import dev.brunocelestino.api_ger_eventos.dto.EventDto;
import dev.brunocelestino.api_ger_eventos.dto.SubscribeDto;
import dev.brunocelestino.api_ger_eventos.model.Event;
import dev.brunocelestino.api_ger_eventos.model.EventStatistics;
import dev.brunocelestino.api_ger_eventos.service.EventService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/event")
@AllArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Event> list(){
        return eventService.list();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Event listById(@PathVariable Integer id){
        return eventService.searchById(id);
    }

    @GetMapping("/events/order/date")
    @ResponseStatus(HttpStatus.OK)
    public List<Event> orderByDate(){
        return eventService.listOrderByDate();
    }

    @GetMapping("/events/count")
    @ResponseStatus(HttpStatus.OK)
    public EventCount countEvents(){
        return eventService.countEvents();
    }

    @GetMapping("/events/today")
    @ResponseStatus(HttpStatus.OK)
    public List<Event> eventsToday(){
        return eventService.eventsToday();
    }

    @GetMapping("/events/statistics")
    @ResponseStatus(HttpStatus.OK)
    public EventStatistics eventStatistics(){
        return eventService.statistics();
    }

    @GetMapping("/events/packed")
    @ResponseStatus(HttpStatus.OK)
    public List<Event> packedEvents(){
        return eventService.packedEvents();
    }

    @GetMapping("/events/notPacked")
    @ResponseStatus(HttpStatus.OK)
    public List<Event> notPackedEvents(){
        return eventService.notPackedEvents();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Event createEvent(@Valid @RequestBody EventDto eventDto){
        return eventService.create(eventDto);
    }

    @PostMapping("/{id}/duplicate")
    @ResponseStatus(HttpStatus.OK)
    public Event duplicateEvent(@PathVariable Integer id){
        return eventService.duplicateEvent(id);
    }

    @PostMapping("/subscribe")
    @ResponseStatus(HttpStatus.OK)
    public void subscribe(@Valid @RequestBody SubscribeDto subscribeDto){
        eventService.subscribe(subscribeDto);
    }

    @PostMapping("/unsubscribe")
    @ResponseStatus(HttpStatus.OK)
    public void unsubscribe(@Valid @RequestBody SubscribeDto subscribeDto){
        eventService.unsubscribe(subscribeDto);
    }

    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Event patch(@Valid
                       @RequestBody EventDto event,
                       @PathVariable Integer id){
        return eventService.patch(event, id);
    }

    @PatchMapping("/{id}/reset")
    @ResponseStatus(HttpStatus.OK)
    public Event cancelAllSubscriptions(@PathVariable Integer id){
        return eventService.cancelAllSubscriptions(id);
    }

    @PatchMapping("/{id}/alternate")
    @ResponseStatus(HttpStatus.OK)
    public Event alternateEventStatus(@PathVariable Integer id){
        return eventService.alternateStatus(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable Integer id){
        eventService.delete(id);
    }

}