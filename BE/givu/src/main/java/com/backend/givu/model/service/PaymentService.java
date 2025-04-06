package com.backend.givu.model.service;

import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.repository.PaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private  final PaymentRepository paymentRepository;

//    @Transactional(propagation = Propagation.REQUIRES_NEW)//항상 새 트랜잭션을 시작함
//    public void markAsSuccess(Payment payment) {
//        Payment payment = paymentRepository.findByIdForUpdate(paymentId)
//                .orElseThrow(() -> new EntityNotFoundException("결제 정보가 없습니다: " + paymentId));
//
//        payment.setStatus(PaymentsStatus.SUCCESS);
//        paymentRepository.save(payment);
//        log.info("✅ 거래 성공 상태로 변경 - paymentId: {}", payment.getId());
//    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markPaymentFail(Integer paymentId) {
        Payment payment = paymentRepository.findByIdForUpdate(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("결제 정보가 없습니다: " + paymentId));
        log.info("🔄 FAIL 상태 업데이트 전: {}", payment.getStatus());
        payment.setStatus(PaymentsStatus.FAIL);
        paymentRepository.save(payment);
        log.info("✅ FAIL 상태 업데이트 후: {}", payment.getStatus());
    }


}
