package com.backend.givu.kafka.cancel;

import com.backend.givu.model.requestDTO.RefundEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RefundFundingProducer {


    private final KafkaTemplate<String, RefundEventDTO> kafkaTemplate;
    private static final String TOPIC = "refund-users";

    public void send(int fundingId, RefundEventDTO event) {
        try {
            // key: fundingId 기반 → 파티션 정렬 보장
            kafkaTemplate.send(TOPIC, String.valueOf(fundingId), event);
            log.info("📤 [Kafka] 환불 이벤트 전송 완료: fundingId={}, userId={}, amount={}",
                    event.getFundingId(), event.getUserId(), event.getAmount());
        } catch (Exception e) {
            log.error("❌ [Kafka] 환불 이벤트 전송 실패: {}", e.getMessage());
            throw e; // 트랜잭션 롤백 유도
        }
    }





}