package com.wukiki.givu.views.cancel.component

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.wukiki.domain.model.User
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit

@Composable
fun FinishFundingParticipantPager(
    participants: List<User>
) {
    Column(
        modifier = Modifier
    ) {
        Text(
            text = stringResource(R.string.title_finish_funding_participate),
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = suit
        )

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            participants.forEach { participant ->
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Image(
                        painter = rememberAsyncImagePainter("https://placekitten.com/100/100"),
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(48.dp)
                            .background(Color.LightGray, CircleShape)
                            .clip(CircleShape)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = participant.id,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        fontFamily = suit
                    )
                }
            }
        }
    }
}