package com.backend.givu.kafka;

import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;


/**
 * PENDING 상태로 너무 오래 머물러 있는 거래(Payment)를
 * 모니터링해서 보상 이벤트(sendFailEventImmediately)를
 * 발행하는 스케줄러
 *
 */


@Component
@RequiredArgsConstructor
@Slf4j
public class PendingPaymentMonitor {

    private final PaymentRepository paymentRepository;
    private final FundingProducer fundingProducer;

    // 5분마다 실행 (cron = "0 */5 * * * *")
    @Scheduled(fixedDelay = 5 * 60 * 1000) //5분을 밀리초(ms)로 표현한 값
    public void monitorPendingPayments() {
        Instant fiveMinutesAgo = Instant.now().minusSeconds(5 * 60);// 5분 이상 된 거래

        List<Payment> pendingList = paymentRepository.findAllByStatusAndDateBefore(PaymentsStatus.PENDING, fiveMinutesAgo);

        for (Payment payment : pendingList) {
            log.warn("⏰ [PENDING 거래 모니터링] paymentId: {} 가 5분 이상 처리되지 않음", payment.getId());

            // 보상 이벤트 발송
            fundingProducer.sendFailEventImmediately(
                    payment.getUser().getId(),
                    payment.getId(),
                    payment.getRelatedFunding().getId(),
                    payment.getAmount(),
                    "펀딩 반영 지연으로 인한 자동 보상"
            );
        }
    }




}
