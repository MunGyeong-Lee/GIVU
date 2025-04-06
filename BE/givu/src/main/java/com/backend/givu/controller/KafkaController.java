package com.backend.givu.controller;

import com.backend.givu.model.service.KafkaProducer;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/kafka")
public class KafkaController {

    private final KafkaProducer producer;

    public KafkaController(KafkaProducer producer) {
        this.producer = producer;
    }


    @PostMapping("/send")
    public void sendMessage(@RequestParam String message) {
        producer.sendMessage("my-first-topic", message);
    }

}