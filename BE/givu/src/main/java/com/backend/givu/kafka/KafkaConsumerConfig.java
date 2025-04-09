package com.backend.givu.kafka;

import com.backend.givu.model.requestDTO.*;
import com.backend.givu.model.responseDTO.PaymentFailedEventDTO;
import com.backend.givu.model.responseDTO.PaymentSuccessEventDTO;
import com.backend.givu.model.service.DeadLetterQueue;
import com.backend.givu.model.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
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

    @Value("${spring.kafka.bootstrap-servers}")
    private String kafkaBootstrapServers;

    private final PaymentService paymentService;
    private final DeadLetterQueue deadLetterQueue;

    // ------------ 공통 메서드 ------------
    private <T> DefaultKafkaConsumerFactory<String, T> createFactory(Class<T> clazz, String groupId) {
        JsonDeserializer<T> deserializer = new JsonDeserializer<>(clazz);
        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeHeaders(false);

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaBootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, deserializer);

        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
    }

    // ------------ Consumer Factories ------------
    @Bean
    public ConsumerFactory<String, GivuTransferEventDTO> consumerFactory() {
        return createFactory(GivuTransferEventDTO.class, "transfer-group");
    }

    @Bean
    public ConsumerFactory<String, OrderCreatedEventDTO> orderConsumerFactory() {
        return createFactory(OrderCreatedEventDTO.class, "order-group");
    }

    @Bean
    public ConsumerFactory<String, PaymentSuccessEventDTO> paymentSuccessConsumerFactory() {
        return createFactory(PaymentSuccessEventDTO.class, "payment-success-group");
    }

    @Bean
    public ConsumerFactory<String, PaymentFailedEventDTO> paymentFailConsumerFactory() {
        return createFactory(PaymentFailedEventDTO.class, "payment-fail-group");
    }

    @Bean
    public ConsumerFactory<String, RefundEventDTO> refundConsumerFactory() {
        return createFactory(RefundEventDTO.class, "givupay-refund-consumer");
    }

    // ------------ Listener Container Factories ------------
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, GivuTransferEventDTO> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, GivuTransferEventDTO> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setCommonErrorHandler(errorHandler());
        return factory;
    }

    @Bean(name = "refundKafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, RefundEventDTO> refundKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, RefundEventDTO> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(refundConsumerFactory());
        return factory;
    }

    @Bean(name = "refundResultKafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, RefundResultEventDTO> refundResultKafkaListenerContainerFactory() {
        JsonDeserializer<RefundResultEventDTO> deserializer = new JsonDeserializer<>(RefundResultEventDTO.class);
        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeHeaders(false);

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaBootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "refund-consumer-group");
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, deserializer);

        DefaultKafkaConsumerFactory<String, RefundResultEventDTO> factory =
                new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);

        ConcurrentKafkaListenerContainerFactory<String, RefundResultEventDTO> kafkaFactory =
                new ConcurrentKafkaListenerContainerFactory<>();
        kafkaFactory.setConsumerFactory(factory);
        return kafkaFactory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, OrderCreatedEventDTO> orderEventListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, OrderCreatedEventDTO> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(orderConsumerFactory());
        factory.setCommonErrorHandler(errorHandler());
        return factory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, PaymentSuccessEventDTO> paymentSuccessListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, PaymentSuccessEventDTO> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(paymentSuccessConsumerFactory());
        factory.setCommonErrorHandler(errorHandler());
        return factory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, PaymentFailedEventDTO> paymentFailListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, PaymentFailedEventDTO> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(paymentFailConsumerFactory());
        factory.setCommonErrorHandler(errorHandler());
        return factory;
    }

    // ------------ Error Handler ------------
    @Bean
    public DefaultErrorHandler errorHandler() {
        FixedBackOff fixedBackOff = new FixedBackOff(0L, 2L); // 총 3회 시도

        DefaultErrorHandler handler = new DefaultErrorHandler((record, ex) -> {
            Object event = record.value();
            log.error("❌ Kafka 소비 실패 - Topic: {}, Partition: {}, Payload: {}",
                    record.topic(), record.partition(), event, ex);

            try {
                deadLetterQueue.send(record.topic() + "-dlq", event); // DLQ로 전송
            } catch (Exception e) {
                log.error("❌ DLQ 전송 실패", e);
            }

        }, fixedBackOff);

        return handler;
    }
}