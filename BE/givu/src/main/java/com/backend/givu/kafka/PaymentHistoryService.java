package com.backend.givu.kafka;

import com.backend.givu.model.entity.Payment;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.PaymentRepository;
import com.backend.givu.model.responseDTO.ApiResponse;
import com.backend.givu.model.responseDTO.PaymentHistoryDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentHistoryService {

    private final PaymentRepository paymentRepository;

    /**
     * 결제 내역 조회
     */
    public List<PaymentHistoryDTO>paymentHistory(Long userId){

        // 1. 유저 정보로 상품, 펀딩 정보가 있는 결제 정보 가져오기
        List<Payment> payments = paymentRepository.findByUserIdWithFundingAndProduct(userId);
//        payments.forEach(System.out::println);

        // 2. PaymentHistoryDTO DTO로 매핑
        List<PaymentHistoryDTO> paymentHistorys = payments.stream()
                .map(PaymentHistoryDTO::new)
                .toList();
        return paymentHistorys;

    }



}
