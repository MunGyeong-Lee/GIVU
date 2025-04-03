package com.backend.givu.model.service;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaConsumer {

    @KafkaListener(topics = "my-first-topic", groupId = "givu")
    public void consume(ConsumerRecord<String, String > record){
        System.out.println("Recevied message" + record.value());
    }
}
