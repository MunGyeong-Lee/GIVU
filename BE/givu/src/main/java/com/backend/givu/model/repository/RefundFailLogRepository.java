package com.backend.givu.model.repository;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.RefundFailLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefundFailLogRepository extends JpaRepository<RefundFailLog, Integer> {
}
