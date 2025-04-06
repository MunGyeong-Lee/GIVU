package com.backend.givu.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeadLetterQueue {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void send(String topic, Object event){

        // 실패한 메세지를 전송
        kafkaTemplate.send(topic, event);
    }

}
