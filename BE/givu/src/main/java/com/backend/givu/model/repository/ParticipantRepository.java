package com.backend.givu.model.repository;


import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Participant;
import com.backend.givu.model.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.servlet.http.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Integer> {



    boolean existsByFundingAndUser(Funding funding, User user);

    List<Participant> findByFunding_Id(Integer fundingId);

    @Query("""
    SELECT   p
    FROM     Participant p
    WHERE    p.funding.id = :fundingId
    AND      p.user.id = :userId
    AND      p.fundingAmount = :amount
    ORDER BY p.joinedAt asc
    """)
    Optional<Participant> findRefundMatch(Long userId, int fundingId, int amount);

    @Query("""
    SELECT p
    FROM Participant p
    JOIN FETCH p.user
    WHERE p.funding.id = :fundingId
    """)
    List<Participant> findByFundingIdWithUser(@Param("fundingId") Integer fundingId);

}
