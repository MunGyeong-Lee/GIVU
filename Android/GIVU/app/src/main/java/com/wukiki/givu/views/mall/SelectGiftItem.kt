package com.wukiki.givu.views.mall

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.material3.Text
import androidx.compose.ui.Alignment
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.wukiki.domain.model.Product
import com.wukiki.givu.R
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils

@Composable
fun GiftListItem(
    product: Product,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(106.dp)
            .padding(vertical = 4.dp)
            .clickable { onClick() },
        verticalAlignment = Alignment.CenterVertically
    ) {
        AsyncImage(
            model = product.image,
            contentDescription = null,
            modifier = Modifier
                .width(120.dp)
                .height(90.dp)
                .clip(RoundedCornerShape(5.dp)),
            contentScale = ContentScale.FillWidth
        )

        Column(
            modifier = Modifier
                .fillMaxHeight()
                .padding(start = 16.dp)
                .padding(vertical = 8.dp),
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "브랜드 이름: ${product.category}",
                fontFamily = suit,
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
            )
            Spacer(Modifier.height(6.dp))
            Text(
                text = product.productName,
                fontFamily = suit,
                fontWeight = FontWeight.Medium,
                fontSize = 14.sp
            )
            Spacer(Modifier.weight(1f))
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = product.price,
                    fontFamily = pretendard,
                    fontWeight = FontWeight.Black,
                    fontSize = 16.sp,
                    color = colorResource(R.color.main_secondary)
                )
                Spacer(Modifier.weight(1f))
                Image(
                    painter = painterResource(R.drawable.ic_like_on), null,
                    modifier = Modifier.size(24.dp)
                )

                Spacer(Modifier.width(4.dp))
                Text(
                    text = product.favorite,
                    fontFamily = pretendard,
                    fontWeight = FontWeight.Normal,
                    fontSize = 14.sp
                )
            }

        }

    }
}

@Preview(showBackground = true)
@Composable
private fun PreviewItem() {
    Column(
        Modifier
            .fillMaxSize()
            .padding(horizontal = 24.dp)
    ) {}
}