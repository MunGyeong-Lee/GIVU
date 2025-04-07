package com.backend.givu.model.repository.impl;

import co.elastic.clients.elasticsearch._types.query_dsl.MultiMatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import com.backend.givu.model.Document.FundingDocument;
import com.backend.givu.model.Document.ProductDocument;
import com.backend.givu.model.repository.ProductSearchRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class ProductSearchRepositoryImpl implements ProductSearchRepositoryCustom {

    private final ElasticsearchOperations elasticsearchOperations;

    @Override
    public List<ProductDocument> searchProductByKeyword(String keyword) {
        // MultiMatchQuery 생성
        MultiMatchQuery multiMatchQuery = MultiMatchQuery.of(m -> m
                .query(keyword)
                .fields("productName", "description")
                .fuzziness("AUTO")
        );

        // Query 객체로 래핑
        Query query = Query.of(q -> q.multiMatch(multiMatchQuery));

        // NativeQuery 빌드
        NativeQuery nativeQuery = NativeQuery.builder()
                .withQuery(query)
                .build();

        // 실행 및 결과 추출
        SearchHits<ProductDocument> hits = elasticsearchOperations.search(nativeQuery, ProductDocument.class);
        return hits.get().map(SearchHit::getContent).toList();
    }

}
