package com.backend.givu.model.repository;

import com.backend.givu.model.Document.FundingDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundingSearchRepository extends ElasticsearchRepository<FundingDocument, Integer> {
    List<FundingDocument> findByTitleContainingIgnoreCase(String title);
}
