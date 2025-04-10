package com.wukiki.data.mapper

import com.wukiki.data.entity.FundingTransferEntity
import com.wukiki.domain.model.Transfer

object TransferMapper {

    operator fun invoke(fundingTransferEntity: FundingTransferEntity): Transfer {
        val data = fundingTransferEntity.data ?: throw IllegalStateException("data is null")

        return Transfer(
            paymentId = data.paymentId,
            userId = data.userId,
            fundingId = data.fundingId,
            productId = data.productId,
            amount = data.amount,
            transactionType = data.transactionType,
            status = data.status,
            date = data.date
        )
    }
}