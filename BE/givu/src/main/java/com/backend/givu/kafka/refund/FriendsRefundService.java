package com.backend.givu.kafka.refund;


import com.backend.givu.kafka.refund.FriendsRefundProducer;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FriendsRefundService {

    private final UserRepository userRepository;
    private final FriendsRefundProducer friendsRefundProducer;

    @Transactional
    public void refundToUser(Long userId, int fundingId, int amount, int paymenetId) {
        try {
            // 1. 사용자 확인
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("유저가 존재하지 않습니다."));

            // 2. 금액 환불 처리
            log.info("환불 전 잔액={}",user.getBalance());
            user.addBalance(amount);
            log.info("환불 후 잔액={}",user.getBalance());
            log.info("💰 [환불 처리 완료] userId={}, amount={}", userId, amount);

            // 3. 성공 시 이벤트 전송
            friendsRefundProducer.sendSuccessAfterCommit(user.getId(), fundingId, amount, paymenetId);

        } catch (Exception e) {
            log.error("❌ 펀딩 금액 반영 실패! 보상 이벤트 발행", e);
            friendsRefundProducer.sendFailure(userId, paymenetId, fundingId, amount, "펀딩 반영 실패");
            throw e;
        }
    }

}
