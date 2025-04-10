package com.wukiki.givu.views.mall.component

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.SubcomposeAsyncImage
import com.wukiki.domain.model.Product
import com.wukiki.givu.R
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils

@Composable
fun MallItemPopular(
    product: Product,
    onProductClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(200.dp)
            .padding(horizontal = 8.dp, vertical = 16.dp)
            .shadow(
                elevation = 4.dp,
                shape = RoundedCornerShape(10.dp),
                clip = true
            )
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onProductClick
            ),
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {

            SubcomposeAsyncImage(
                model = product.image,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(5f / 4f),
            )

            Spacer(Modifier.height(8.dp))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp)
            ) {

                Text(
                    text = product.productName,
                    fontFamily = suit,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 16.sp,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.height(42.dp)
                )

                Spacer(Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    BestItemTag(
                        modifier = Modifier
                            .height(28.dp)
                            .weight(1f)
                            .background(
                                color = Color(0xFFFFE100),
                                shape = RoundedCornerShape(8.dp)
                            ),
                    )
                    Spacer(Modifier.width(4.dp))
                    NewItemTag(
                        modifier = Modifier
                            .height(28.dp)
                            .weight(1f)
                            .background(
                                color = Color(0xFF00B2FF),
                                shape = RoundedCornerShape(8.dp)
                            ),
                    )
                }

                Spacer(Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = CommonUtils.makeCommaPrice(product.price.toInt()),
                        fontFamily = pretendard,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                    )

                    Spacer(Modifier.weight(1f))
                    Icon(
                        painter = painterResource(R.drawable.ic_star_best),
                        contentDescription = null,
                        modifier = Modifier
                            .size(28.dp),
                        tint = colorResource(R.color.main_secondary)
                    )
                    Text(
                        text = product.star,
                        fontFamily = pretendard,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Normal
                    )
                }

                Spacer(Modifier.height(8.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
//                    Icon(
//                        painter = painterResource(R.drawable.ic_star_best),
//                        contentDescription = null,
//                        modifier = Modifier
////                            .padding( end = 2.dp)
//                            .size(28.dp),
//                        tint = colorResource(R.color.main_secondary)
//                    )
//                    Text(
//                        text = "4.9",
//                        fontFamily = pretendard,
//                        fontSize = 14.sp,
//                        fontWeight = FontWeight.Normal
//                    )

                }
            }

        }
    }

}

@Composable
private fun BestItemTag(modifier: Modifier) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center
    ) {
        Image(
            painter = painterResource(R.drawable.ic_star_best),
            contentDescription = null,
            modifier = Modifier.padding(start = 8.dp, end = 2.dp)
        )
        Text(
            text = "BEST",
            fontFamily = suit,
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp,
            color = Color.White
        )
        Spacer(Modifier.width(12.dp))

    }
}

@Composable
private fun NewItemTag(modifier: Modifier) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center
    ) {
        Image(
            painter = painterResource(R.drawable.ic_new_item),
            contentDescription = null,
            modifier = Modifier.padding(start = 8.dp, end = 2.dp)
        )
        Text(
            text = "NEW",
            fontFamily = suit,
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp,
            color = Color.White
        )
        Spacer(Modifier.width(12.dp))

    }
}


@Preview(showBackground = true)
@Composable
private fun PreviewMallItem() {
//    MallItemPopular()

//    NewItemTag()
}