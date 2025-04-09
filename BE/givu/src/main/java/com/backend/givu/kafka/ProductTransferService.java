package com.backend.givu.kafka;

import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.PaymentRepository;
import com.backend.givu.model.repository.ProductRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.requestDTO.OrderCreatedEventDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductTransferService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ProductProducer productProducer;

    @Transactional
    public void purchaseProduct(OrderCreatedEventDTO order) {
        User user = userRepository.findById(order.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("유저 정보가 없습니다: " + order.getUserId()));

        Payment payment = paymentRepository.findByIdForUpdate(order.getPaymentId())
                .orElseThrow(() -> new EntityNotFoundException("결제 정보가 없습니다: " + order.getPaymentId()));

        int balance = user.getBalance();
        int totalAmount = order.getTotalAmount();

        if (balance >= totalAmount) {
            // 잔액 차감
            user.setBalance(balance - totalAmount);
            userRepository.save(user);

            // 결제 성공 처리
            payment.setStatus(PaymentsStatus.SUCCESS);
            paymentRepository.save(payment);

            log.info("✅ 결제 성공 - 사용자: {}, 결제: {}, 차감금액: {}",
                    user.getId(), payment.getId(), totalAmount);
            // Kafka로 결제 성공 이벤트 발행 (트랜잭션 커밋 후)
            productProducer.sendSuccessEventAfterCommit(payment);
        } else {
            // 결제 실패 처리 (잔액 부족)
            payment.setStatus(PaymentsStatus.FAIL);
            paymentRepository.save(payment);

            log.warn("❌ 결제 실패 (잔액 부족) - 사용자: {}, 결제: {}, 보유잔액: {}, 결제금액: {}",
                    user.getId(), payment.getId(), balance, totalAmount);

            // Kafka로 결제 실패 이벤트 발행 (즉시)
            productProducer.sendFailEventImmediately(
                    payment.getId(),
                    user.getId(),
                    "잔액 부족"
            );
        }
    }
}
