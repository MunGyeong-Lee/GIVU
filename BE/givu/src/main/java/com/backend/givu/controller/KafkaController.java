package com.backend.givu.controller;

import com.backend.givu.model.service.KafkaProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.kafka.listener.MessageListenerContainer;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
//@RequiredArgsConstructor
@RequestMapping("/kafka")
public class KafkaController {

    @Autowired
//    @Qualifier("internalKafkaListenerEndpointRegistry")
    private KafkaListenerEndpointRegistry registry;

    @PostMapping("/start")
    public String startConsumer() {
        MessageListenerContainer container = registry.getListenerContainer("transferListener");
        if (!container.isRunning()) {
            container.start();
            return "✅ Kafka Consumer Started";
        }
        return "⏸️ Kafka Consumer Already Running";
    }

    @PostMapping("/stop")
    public String stopConsumer() {
        MessageListenerContainer container = registry.getListenerContainer("transferListener");
        if (container.isRunning()) {
            container.stop();
            return "🛑 Kafka Consumer Stopped";
        }
        return "⏸️ Kafka Consumer Already Stopped";
    }


}