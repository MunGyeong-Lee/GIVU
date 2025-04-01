package com.wukiki.givu.views.register.component

import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.views.register.viewmodel.RegisterViewModel

@Composable
fun RegisterFundingImagePager(
    registerViewModel: RegisterViewModel
) {
    val context = LocalContext.current
    val images by registerViewModel.fundingImageUris.collectAsState()
    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickMultipleVisualMedia(maxItems = 3)
    ) { uris ->
        registerViewModel.setSelectedImages(uris.take(3 - images.size))
    }

    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = stringResource(R.string.title_register_image_upload),
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = suit
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = stringResource(R.string.text_register_image_upload),
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium,
            fontFamily = suit
        )

        Spacer(modifier = Modifier.height(8.dp))

        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            item {
                Box(
                    modifier = Modifier
                        .size(120.dp)
                        .background(Color.White, RoundedCornerShape(10.dp))
                        .clickable {
                            when (images.size < 3) {
                                true -> {
                                    photoPickerLauncher.launch(
                                        PickVisualMediaRequest(
                                            ActivityResultContracts.PickVisualMedia.ImageOnly
                                        )
                                    )
                                }

                                else -> {
                                    Toast
                                        .makeText(
                                            context,
                                            context.getString(R.string.message_image_limit),
                                            Toast.LENGTH_SHORT
                                        )
                                        .show()
                                }
                            }
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Canvas(
                        modifier = Modifier.matchParentSize()
                    ) {
                        val strokeWidth = 2.dp.toPx()
                        val dashLength = 6.dp.toPx()
                        val gapLength = 4.dp.toPx()
                        drawRoundRect(
                            color = Color(0xFFF88383),
                            size = size,
                            cornerRadius = androidx.compose.ui.geometry.CornerRadius(
                                10.dp.toPx(),
                                10.dp.toPx()
                            ),
                            style = androidx.compose.ui.graphics.drawscope.Stroke(
                                width = strokeWidth,
                                pathEffect = androidx.compose.ui.graphics.PathEffect.dashPathEffect(
                                    floatArrayOf(dashLength, gapLength)
                                )
                            )
                        )
                    }

                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.ic_upload),
                            contentDescription = null,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = when (images.isEmpty()) {
                                true -> {
                                    stringResource(R.string.text_image_upload)
                                }

                                else -> {
                                    "${images.size}/3"
                                }
                            },
                            fontSize = 16.sp,
                            fontFamily = suit,
                            color = Color(0xFFF88383)
                        )
                    }
                }
            }

            items(images) { uri ->
                Box(
                    modifier = Modifier.size(120.dp)
                ) {
                    AsyncImage(
                        model = uri,
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(RoundedCornerShape(10.dp))
                    )

                    IconButton(
                        onClick = { registerViewModel.removeUri(uri) },
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(4.dp)
                            .size(20.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(16.dp)
                                .background(Color.Black.copy(alpha = 0.6f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "삭제",
                                tint = Color.White,
                                modifier = Modifier.size(10.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}