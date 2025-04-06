package com.backend.givu.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    /**
     * 카프카 토픽 생성
     * (기존에 있는 토픽이면 중복 생성하지 않음)
     */
    @Bean
    public NewTopic exampleTopic() {
        return TopicBuilder.name("my-transfer-request")
                .partitions(3)
                .replicas(1)
                .build();
    }



}
