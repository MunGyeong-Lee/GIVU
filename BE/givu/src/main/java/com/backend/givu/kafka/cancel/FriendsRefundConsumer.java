package com.backend.givu.kafka.cancel;


import com.backend.givu.model.requestDTO.RefundEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FriendsRefundConsumer {

    private final FriendsRefundService friendsRefundService;

    @KafkaListener(
            id= "refund-listener",
            topics = "refund-users",
            groupId = "givupay-refund-consumer",
            concurrency = "3",
            containerFactory = "refundKafkaListenerContainerFactory")
    public void consume(ConsumerRecord<String, RefundEventDTO> record) {
        RefundEventDTO event = record.value();

        log.info("📥 [Kafka] 환불 이벤트 수신: userId={}, fundingId={}, amount={}",
                event.getUserId(), event.getFundingId(), event.getAmount());

        try {
            friendsRefundService.refundToUser(event.getUserId(), event.getFundingId(), event.getAmount(),event.getPaymenetId()); // 실제 환불 처리
        } catch (Exception e) {
            log.error("❌ [Kafka] 환불 처리 실패: userId={}, 이유={}", event.getUserId(), e.getMessage());
            // TODO: 실패 보상 로직 (예: 실패 이벤트 발송)
        }
    }
}