package com.wukiki.data.mapper

import com.wukiki.data.entity.PaymentEntity
import com.wukiki.data.util.CommonUtils.formatDateTime
import com.wukiki.domain.model.Payment

object PaymentMapper {

    operator fun invoke(paymentEntity: PaymentEntity): List<Payment> {
        val newPaymentHistoryList = mutableListOf<Payment>()

        paymentEntity.data.forEach { payment ->
            newPaymentHistoryList.add(
                Payment(
                    paymentId = payment.paymentId,
                    userId = payment.userId,
                    fundingTitle = payment.fundingTitle,
                    productName = payment.productName ?: "",
                    amount = payment.amount,
                    transactionType = payment.transactionType,
                    date = formatDateTime(payment.date ?: "")
                )
            )

        }

        return newPaymentHistoryList
    }
}