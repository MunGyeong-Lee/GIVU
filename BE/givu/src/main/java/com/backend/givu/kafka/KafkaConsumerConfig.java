package com.backend.givu.kafka;

import com.backend.givu.model.requestDTO.GivuTransferEventDTO;
import com.backend.givu.model.requestDTO.RefundEventDTO;
import com.backend.givu.model.requestDTO.RefundResultEventDTO;
import com.backend.givu.model.responseDTO.FundingSuccessEventDTO;
import com.backend.givu.model.responseDTO.GivuSuccessDTO;
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

    // ===================== 공통 메서드 =====================

    private <T> JsonDeserializer<T> createDeserializer(Class<T> clazz) {
        JsonDeserializer<T> deserializer = new JsonDeserializer<>(clazz);
        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeHeaders(false);
        return deserializer;
    }

    private Map<String, Object> defaultConsumerProps(String groupId) {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaBootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        return props;
    }

    private <T> DefaultKafkaConsumerFactory<String, T> createConsumerFactory(Class<T> clazz, String groupId) {
        return new DefaultKafkaConsumerFactory<>(
                defaultConsumerProps(groupId),
                new StringDeserializer(),
                createDeserializer(clazz)
        );
    }

    private <T> ConcurrentKafkaListenerContainerFactory<String, T> createListenerFactory(Class<T> clazz, String groupId, boolean setErrorHandler) {
        ConcurrentKafkaListenerContainerFactory<String, T> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(createConsumerFactory(clazz, groupId));
        if (setErrorHandler) {
            factory.setCommonErrorHandler(errorHandler());
        }
        return factory;
    }

    // ===================== Listener Factories =====================

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, GivuTransferEventDTO> kafkaListenerContainerFactory() {
        return createListenerFactory(GivuTransferEventDTO.class, "transfer-group", true);
    }

    @Bean(name = "refundKafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, RefundEventDTO> refundKafkaListenerContainerFactory() {
        return createListenerFactory(RefundEventDTO.class, "givupay-refund-consumer", false);
    }

    @Bean(name = "refundResultKafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, RefundResultEventDTO> refundResultKafkaListenerContainerFactory() {
        return createListenerFactory(RefundResultEventDTO.class, "refund-consumer-group", false);
    }

    @Bean(name = "successKafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, FundingSuccessEventDTO> successKafkaListenerContainerFactory() {
        return createListenerFactory(FundingSuccessEventDTO.class, "success-funding-group", false);
    }

    @Bean(name = "givuSuccessKafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, GivuSuccessDTO> givuSuccessKafkaListenerContainerFactory() {
        return createListenerFactory(GivuSuccessDTO.class, "confirm-payment-group", false);
    }

    // ===================== 에러 핸들러 =====================

    @Bean
    public DefaultErrorHandler errorHandler() {
        FixedBackOff fixedBackOff = new FixedBackOff(0L, 2L); // 총 3회 (0 + 2번 retry)
        return new DefaultErrorHandler((record, ex) -> {
            try {
                GivuTransferEventDTO event = (GivuTransferEventDTO) record.value();
                log.error("❌ 최종 실패 - paymentId: {}", event.getPaymentId(), ex);
                deadLetterQueue.send("funding-transfer-dlq", event);
            } catch (Exception e) {
                log.error("❌ DLQ 전송 실패", e);
            }
        }, fixedBackOff);
    }
}
