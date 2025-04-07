package com.backend.givu.model.service;

import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.Enum.PaymentsTransactionType;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.FundingRepository;
import com.backend.givu.model.repository.PaymentRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.requestDTO.GivuTransferEventDTO;
import com.backend.givu.model.responseDTO.ApiResponse;
import com.backend.givu.model.responseDTO.PaymentResultDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GivuTransferService {

    private final FundingRepository fundingRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    private final KafkaTemplate<String, GivuTransferEventDTO> kafkaTemplate;

    @Transactional
    public ApiResponse<PaymentResultDTO> fundingTransfer(Long userId, int fundingId, int amount){

        // 1. 해당 펀딩이 있는지 확인
        Funding funding = fundingRepository.findById(fundingId)
                .orElseThrow(()-> new EntityNotFoundException("펀딩을 찾을 수 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(()-> new EntityNotFoundException("유저를 찾을 수 없습니다."));

        // 2. 거래내역 생성 및 pending 상태로 저장
        Payment payment = Payment.builder() //serId, fundingId, amount, PaymentsStatus.PENDING);
                .user(user)
                .relatedFunding(funding)
                .relatedProduct(null)
                .amount(amount)
                .status(PaymentsStatus.PENDING)
                .transactionType(PaymentsTransactionType.FUNDING)
                .build();
        paymentRepository.save(payment);

        // 3. 트랜잭션이 끝난 이후 Kafka 발행
        sendKafkaEventAfterCommit(payment, userId);

        // 4. 클라이언트 응답 DTO 생성
        PaymentResultDTO dto = new PaymentResultDTO(payment);
        return ApiResponse.success(dto);
    }

    private void sendKafkaEventAfterCommit(Payment payment, Long userId) {
        GivuTransferEventDTO event = new GivuTransferEventDTO(payment);

        // 트랜잭션 커밋 후 실행되도록
        org.springframework.transaction.support.TransactionSynchronizationManager.registerSynchronization(
                new org.springframework.transaction.support.TransactionSynchronizationAdapter() {
                    @Override
                    public void afterCommit() {
                        kafkaTemplate.send("transfer-request", userId.toString(), event);
                        log.info("✅ Kafka 이벤트 발행 완료 (after commit): {}", event.getPaymentId());
                    }
                }
        );


    }
}

