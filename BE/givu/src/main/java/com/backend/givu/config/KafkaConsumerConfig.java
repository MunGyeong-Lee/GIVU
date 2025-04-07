package com.backend.givu.config;

import com.backend.givu.model.requestDTO.GivuTransferEventDTO;
import com.backend.givu.model.service.DeadLetterQueue;
import com.backend.givu.model.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.util.backoff.FixedBackOff;

import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerConfig {

    private final PaymentService paymentService;
    private final DeadLetterQueue deadLetterQueue;

    @Bean
    public DefaultKafkaConsumerFactory<String, GivuTransferEventDTO> consumerFactory() {
        JsonDeserializer<GivuTransferEventDTO> deserializer = new JsonDeserializer<>(GivuTransferEventDTO.class);
        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeHeaders(false); // Spring Kafka 3.x 이상 시 필요

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "transfer-group");
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, deserializer);

        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
    }



    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, GivuTransferEventDTO> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, GivuTransferEventDTO> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setCommonErrorHandler(errorHandler());
        return factory;
    }

    @Bean
    public DefaultErrorHandler errorHandler() {
        FixedBackOff fixedBackOff = new FixedBackOff(0L, 2L); // 총 3회 (0 + 2번 retry)
        DefaultErrorHandler handler = new DefaultErrorHandler(
                (record, ex) -> {
                    GivuTransferEventDTO event = (GivuTransferEventDTO) record.value();
                    log.error("❌ 최종 실패 - paymentId: {}", event.getPaymentId(), ex);

                    try {
                        paymentService.markPaymentFail(event.getPaymentId());  // 강제로 FAIL로 저장
                        deadLetterQueue.send("funding-transfer-dlq", event);  // DLQ로 전송
                    } catch (Exception e) {
                        log.error("❌ FAIL 처리 실패", e);
                    }
                },
                fixedBackOff
        );

        return handler;
        }


}
