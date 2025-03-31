package com.backend.givu.model.repository;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.responseDTO.FundingsDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundingRepository extends JpaRepository<Funding, Integer> {

    @Query("""
    SELECT f
    FROM Funding f
    JOIN FETCH f.user u
    JOIN FETCH f.product p
""")
    List<Funding> findAllWithUserAndProduct();
}
// funding
// user
// product
