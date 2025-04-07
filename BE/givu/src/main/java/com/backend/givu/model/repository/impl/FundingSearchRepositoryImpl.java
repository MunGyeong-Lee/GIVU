package com.backend.givu.model.repository.impl;

import co.elastic.clients.elasticsearch._types.query_dsl.MultiMatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import com.backend.givu.model.Document.FundingDocument;
import com.backend.givu.model.repository.FundingSearchRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Repository;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class FundingSearchRepositoryImpl implements FundingSearchRepositoryCustom {

    private final ElasticsearchOperations elasticsearchOperations;

    @Override
    public List<FundingDocument> searchFundingByKeyword(String keyword) {

        // MultiMatchQuery 생성
        MultiMatchQuery multiMatchQuery = MultiMatchQuery.of(m -> m
                .query(keyword)
                .fields("title", "description")
                .fuzziness("AUTO")
        );

        // Query 객체로 래핑
        Query query = Query.of(q -> q.multiMatch(multiMatchQuery));

        // NativeQuery 빌드
        NativeQuery nativeQuery = NativeQuery.builder()
                .withQuery(query)
                .build();

        // 실행 및 결과 추출
        SearchHits<FundingDocument> hits = elasticsearchOperations.search(nativeQuery, FundingDocument.class);
        return hits.get().map(SearchHit::getContent).toList();
    }
}