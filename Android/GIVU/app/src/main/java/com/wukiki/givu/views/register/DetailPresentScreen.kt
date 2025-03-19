package com.wukiki.givu.views.register

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.givu.R
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.util.StoreDetailBottomButton
import com.wukiki.givu.util.StoreDetailTopBar

@Composable
fun DetailPresentScreen() {

    Box(modifier = Modifier.fillMaxSize()) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = 68.dp)
        ) {
            StoreDetailTopBar()

            Image(
                painter = painterResource(R.drawable.test_img_doll), null,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(4f / 3f),
                contentScale = ContentScale.FillWidth
            )

            Spacer(Modifier.height(16.dp))
            Column(Modifier.padding(horizontal = 24.dp)) {
                Text(
                    text = "상품 이름 표시",
                    fontFamily = pretendard,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 22.sp,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(Modifier.height(12.dp))
                Text(
                    text = "15,800원",
                    fontFamily = pretendard,
                    fontWeight = FontWeight.Medium,
                    fontSize = 19.sp,
                    color = colorResource(R.color.main_secondary)
                )
            }

        }

        StoreDetailBottomButton(
            modifier = Modifier
                .fillMaxWidth()
                .height(68.dp)
                .align(
                    Alignment.BottomCenter
                ),
            text = "이 상품 선택하기"
        )
    }

}

@Preview(showBackground = true)
@Composable
private fun TestPreview() {
    DetailPresentScreen()
}