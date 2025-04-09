package com.backend.givu.kafka.success;


import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.responseDTO.FundingSuccessEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GivuSuccessService {

    private final UserRepository userRepository;
    private final GivuSuccessProducer givuSuccessProducer;
    private final KafkaTemplate<String, FundingSuccessEventDTO> kafkaTemplate;


    @Transactional
    public void addBalance(Long userId, int fundingId, int amount, int paymentId) {
        try{
            log.info("paymentId: {}", paymentId);
            //1. 유저 존재 여부 확인 및 락킹
            User user = userRepository.findByIdForUpdate(userId)
                    .orElseThrow(() -> new IllegalArgumentException("유저 정보 없음"));

            // 2. 기뷰페이에 반영
            log.info("기뷰페이에 반영 전 금액 ={}", user.getBalance());
            user.addBalance(amount);
            log.info("기뷰페이에 반영 후 금액 ={}", user.getBalance());
            userRepository.save(user);

            // 성공 이벤트 발행
            log.info("성공 이벤트 발행");
            givuSuccessProducer.sendSuccessEventAfterCommit(userId, fundingId, amount, paymentId);


        }catch(Exception e){
            log.error("❌ 펀딩 금액 반영 실패! 보상 이벤트 발행", e);
            givuSuccessProducer.sendFailEventImmediately(userId, paymentId, fundingId, amount, "펀딩 반영 실패");
        }


    }

}
