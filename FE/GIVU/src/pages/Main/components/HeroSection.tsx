import { useState, useEffect, useMemo, useRef, Suspense, useCallback } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Preload, useTexture, Text, ScrollControls, useScroll } from "@react-three/drei";
import * as THREE from "three";
import axios from "axios";
import { HeroFundingItem } from "../../../types/funding";

// --- 선물 상자 애니메이션 관련 상수 ---
const ANIMATION_CONFIG = {
  // 진폭 관련 설정
  BASE_AMPLITUDE: 0.05,        // 기본 진폭 값 (클수록 움직임이 커짐)
  AMPLITUDE_VARIATION: 0.02,   // 진폭의 랜덤 변화량 (±)

  // 속도 관련 설정
  BASE_SPEED: 1.5,             // 기본 속도 값 (클수록 빨라짐)
  SPEED_VARIATION: 0.5,        // 속도의 랜덤 변화량 (±)

  // 축별 움직임 비율
  X_AXIS_RATIO: 0.2,           // X축 움직임 비율 (Y축 움직임 대비)
  Y_AXIS_RATIO: 1.0,           // Y축 기본 비율
  Z_AXIS_RATIO: 0.15,          // Z축 움직임 비율 (Y축 움직임 대비)

  // 회전 관련 설정
  ROTATION_SPEED: 0.2,         // Y축 회전 속도
  X_ROTATION_AMOUNT: 0.15      // X축 회전 정도
};

// --- Texture Atlas 관련 상수 ---
const ATLAS_COLS = 10;
const ATLAS_ROWS = 10;

// --- Shader 코드 ---
const vertexShader = `
  // InstancedBufferAttribute에서 각 인스턴스의 이미지 인덱스를 받음
  attribute float instanceImageIndex;
  
  // 프래그먼트 셰이더로 전달할 변수들
  varying vec2 vUv;
  varying float vImageIndex;
  
  void main() {
    // UV 좌표와 이미지 인덱스를 프래그먼트 셰이더로 전달
    vUv = uv;
    vImageIndex = instanceImageIndex;
    
    // InstancedMesh에서 각 인스턴스의 행렬을 적용하여 위치 계산
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  // Uniforms (모든 인스턴스가 공유하는 값)
  uniform sampler2D atlasTexture;
  uniform vec2 singleImageUVSize;
  uniform float time; // 시간 유니폼 추가 (향후 셰이더 내 애니메이션에 사용 가능)
  uniform float opacity; // 투명도 유니폼 추가
  
  // 버텍스 셰이더에서 전달받은 값들
  varying vec2 vUv;
  varying float vImageIndex;
  
  void main() {
    // 이미지 인덱스를 행과 열로 변환
    float col = mod(vImageIndex, ${ATLAS_COLS}.0);
    float row = floor(vImageIndex / ${ATLAS_COLS}.0);
    
    // 아틀라스 내에서의 UV 좌표 계산 (수정된 방식)
    vec2 atlasUV = vec2(
      vUv.x * singleImageUVSize.x + col * singleImageUVSize.x,
      vUv.y * singleImageUVSize.y + row * singleImageUVSize.y
    );
    
    // 아틀라스 텍스처에서 해당 픽셀 색상 가져오기
    vec4 texColor = texture2D(atlasTexture, atlasUV);
    
    // 알파값이 너무 낮은 픽셀은 렌더링하지 않음 (투명도 최적화)
    if (texColor.a < 0.1) discard;
    
    // 전체 투명도 적용
    gl_FragColor = vec4(texColor.rgb, texColor.a * opacity);
  }
`;

// --- 상세 정보 표시 컴포넌트 ---
const FeaturedFunding = ({
  item,
  screenPosition
}: {
  item: HeroFundingItem | null;
  screenPosition: { x: number; y: number; } | null;
}) => {
  // 화면 좌표가 없거나 아이템이 없으면 null 반환
  if (!item || !screenPosition) return null;
  // 팝업 위치 오프셋
  const offsetX = 20;
  const offsetY = -80; // 위쪽으로 표시

  return (
    <div
      // 캔버스 위에 표시되도록 z-index 높게 설정, 마우스 이벤트 통과
      className="absolute z-50 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-100 ease-in-out opacity-95 w-60 pointer-events-none"
      style={{
        left: `${screenPosition.x + offsetX}px`,
        top: `${screenPosition.y + offsetY}px`,
        maxWidth: '260px',
        // 필요시 화면 벗어남 방지 로직 추가
      }}
    >
      {/* 펀딩 이미지 */}
      <div className="w-full h-32 overflow-hidden">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
      </div>
      {/* 펀딩 정보 */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">{item.title}</h3>
        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="text-gray-500">달성률</div>
            <div className="font-semibold">{item.progressPercentage}%</div>
          </div>
          <div>
            <div className="text-gray-500">참여자</div>
            <div className="font-semibold">{item.parcitipantsNumber}명</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3D 선물 상자 효과 컴포넌트 ---
const GiftBoxEffect = ({
  fundingItems,
  onItemHover,
  onItemLeave,
  scrollY = 0 // 실제 DOM 스크롤 위치 추가
}: {
  fundingItems: HeroFundingItem[];
  onItemHover: (item: HeroFundingItem, screenPos: { x: number, y: number }) => void;
  onItemLeave: () => void;
  scrollY?: number; // 실제 DOM 스크롤 위치 추가
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const geometryRef = useRef<THREE.PlaneGeometry>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const numPoints = 3584;

  // --- ScrollControls에서 제공하는 스크롤 정보 가져오기 ---
  const scroll = useScroll();

  // --- Texture Atlas 로드 ---
  const atlasTexture = useTexture('/atlas.png');
  const singleImageUVSize = useMemo(() => new THREE.Vector2(1 / ATLAS_COLS, 1 / ATLAS_ROWS), []);

  useEffect(() => {
    if (atlasTexture) {
      atlasTexture.flipY = true;
      atlasTexture.minFilter = THREE.LinearFilter;
      atlasTexture.magFilter = THREE.LinearFilter;
    }
  }, [atlasTexture]);

  // --- 인스턴스별 이미지 인덱스 Attribute 생성 ---
  const instanceImageIndices = useMemo(() => {
    // 모든 인스턴스에 대해 0부터 (ATLAS_COLS * ATLAS_ROWS - 1) 사이의 랜덤한 인덱스 할당
    return new Float32Array(numPoints).map(() =>
      Math.floor(Math.random() * (ATLAS_COLS * ATLAS_ROWS))
    );
  }, [numPoints]);

  // --- 추가: 인스턴스별 랜덤 애니메이션 파라미터 생성 ---
  const randomAnimationParams = useMemo(() => {
    const speeds = [];
    const amplitudes = [];
    const offsets = [];

    for (let i = 0; i < numPoints; i++) {
      // 속도: 기본값 주변에서 약간의 랜덤성 부여
      speeds.push(ANIMATION_CONFIG.BASE_SPEED + (Math.random() - 0.5) * ANIMATION_CONFIG.SPEED_VARIATION);
      // 진폭: 기본값 주변에서 약간의 랜덤성 부여
      amplitudes.push(ANIMATION_CONFIG.BASE_AMPLITUDE + (Math.random() - 0.5) * ANIMATION_CONFIG.AMPLITUDE_VARIATION);
      // 오프셋: 0 ~ 2*PI 사이의 랜덤값으로 시작 위치 다변화
      offsets.push(Math.random() * Math.PI * 2);
    }

    return { speeds, amplitudes, offsets };
  }, [numPoints]);

  // --- ShaderMaterial Uniforms 정의 ---
  const uniforms = useMemo(() => ({
    atlasTexture: { value: atlasTexture },
    singleImageUVSize: { value: singleImageUVSize },
    time: { value: 0 },
    opacity: { value: 1.0 } // 투명도 유니폼 추가
  }), [atlasTexture, singleImageUVSize]);

  // --- 각 인스턴스의 초기 스케일만 저장 (회전값은 빌보딩으로 대체) ---
  const initialScales = useMemo(() => {
    const scales: THREE.Vector3[] = [];
    for (let i = 0; i < numPoints; i++) {
      const scale = 0.1 + Math.random() * 0.04;
      scales.push(new THREE.Vector3(scale, scale, scale));
    }
    return scales;
  }, [numPoints]);

  // --- 3D 포인트 생성 로직 ---
  const points = useMemo(() => {
    console.log("선물 상자 포인트 생성 로직 실행");
    const generatedPoints: THREE.Vector3[] = [];

    // --- 파라미터 설정 (비대칭 형태로 변경) ---
    // Y축을 더 길게 수정하여 덜 납작하게 만듦
    const boxDims = { x: 6.5, y: 5.5, z: 4.5 }; // Y축 증가, Z축 약간 감소
    const lidHeight = 0.4;    // 뚜껑 높이 증가
    const lidOverhang = 0.25;  // 뚜껑이 밑면보다 튀어나오는 정도 증가
    const ribbonWidth = 0.35;  // 리본 너비 증가

    // 각 축별 절반 크기
    const halfBoxX = boxDims.x / 2;
    const halfBoxY = boxDims.y / 2;
    const halfBoxZ = boxDims.z / 2;
    const halfLidHeight = lidHeight / 2;
    const halfRibbon = ribbonWidth / 2;

    // 밀도 및 스텝 설정
    const density = 15;
    const stepX = boxDims.x / density;
    const stepY = boxDims.y / density;
    const stepZ = boxDims.z / density;

    // --- 1. 밑면 상자 표면 포인트 생성 (뚜껑 제외 5면) ---
    for (let i = 0; i <= density; i++) {
      for (let j = 0; j <= density; j++) {
        // 앞/뒤 면 (Z축 고정)
        const x_front = -halfBoxX + i * stepX;
        const y_front = -halfBoxY + j * stepY;
        generatedPoints.push(new THREE.Vector3(x_front, y_front, halfBoxZ));
        generatedPoints.push(new THREE.Vector3(x_front, y_front, -halfBoxZ));

        // 아래 면 (Y축 고정)
        const x_bottom = -halfBoxX + i * stepX;
        const z_bottom = -halfBoxZ + j * stepZ;
        generatedPoints.push(new THREE.Vector3(x_bottom, -halfBoxY, z_bottom));

        // 좌/우 면 (X축 고정)
        const y_side = -halfBoxY + i * stepY;
        const z_side = -halfBoxZ + j * stepZ;
        generatedPoints.push(new THREE.Vector3(halfBoxX, y_side, z_side));
        generatedPoints.push(new THREE.Vector3(-halfBoxX, y_side, z_side));
      }
    }

    // --- 2. 뚜껑 상자 표면 포인트 생성 (5면) ---
    const lidSizeW = boxDims.x + lidOverhang * 2; // 뚜껑 너비 (좌우)
    const lidSizeD = boxDims.z + lidOverhang * 2; // 뚜껑 깊이 (앞뒤)
    const halfLidW = lidSizeW / 2;
    const halfLidD = lidSizeD / 2;
    const lidY = halfBoxY; // 뚜껑의 바닥이 밑면 상자의 윗면에 위치

    const lidStepW = lidSizeW / density;
    const lidStepD = lidSizeD / density;

    for (let i = 0; i <= density; i++) {
      for (let j = 0; j <= density; j++) {
        // 뚜껑 윗면 (Y축 고정)
        const x_lid_top = -halfLidW + i * lidStepW;
        const z_lid_top = -halfLidD + j * lidStepD;
        generatedPoints.push(new THREE.Vector3(x_lid_top, lidY + halfLidHeight, z_lid_top));

        // 뚜껑 옆면들 생성 (높이에 따라 단계적으로)
        const x_lid_side = -halfLidW + i * lidStepW;
        const z_lid_side = -halfLidD + j * lidStepD;
        const ySide = lidY - halfLidHeight + i * lidHeight / density;

        // 뚜껑 앞/뒤 면 (Z축 고정)
        generatedPoints.push(new THREE.Vector3(x_lid_side, ySide, halfLidD));
        generatedPoints.push(new THREE.Vector3(x_lid_side, ySide, -halfLidD));

        // 뚜껑 좌/우 면 (X축 고정)
        generatedPoints.push(new THREE.Vector3(halfLidW, ySide, z_lid_side));
        generatedPoints.push(new THREE.Vector3(-halfLidW, ySide, z_lid_side));
      }
    }

    // --- 3. 리본 포인트 생성 (수직 + 수평) ---
    // 수직 리본 (높이 방향)
    const ribbonHeight = boxDims.y + lidHeight;
    const ribbonStepH = ribbonHeight / density;
    const ribbonStepW = ribbonWidth / density;

    for (let i = 0; i <= density; i++) {
      for (let j = 0; j <= density; j++) {
        const y_ribbon = -halfBoxY + i * ribbonStepH;
        const x_ribbon = -halfRibbon + j * ribbonStepW;
        generatedPoints.push(new THREE.Vector3(x_ribbon, y_ribbon, halfBoxZ + lidOverhang + 0.01));
        generatedPoints.push(new THREE.Vector3(x_ribbon, y_ribbon, -halfBoxZ - lidOverhang - 0.01));
      }
    }

    // 수평 리본 (너비 방향)
    const ribbonWidthH = boxDims.x + lidOverhang * 2;
    const halfRibbonWidthH = ribbonWidthH / 2;
    const ribbonStepH_H = ribbonWidth / density;
    const ribbonStepW_H = ribbonWidthH / density;

    for (let i = 0; i <= density; i++) {
      for (let j = 0; j <= density; j++) {
        const x_ribbon = -halfRibbonWidthH + i * ribbonStepW_H;
        const y_ribbon = lidY - ribbonWidth + j * ribbonStepH_H;
        generatedPoints.push(new THREE.Vector3(x_ribbon, y_ribbon, halfRibbon + 0.01));
        generatedPoints.push(new THREE.Vector3(x_ribbon, y_ribbon, -halfRibbon - 0.01));
      }
    }

    console.log(`총 ${generatedPoints.length}개의 포인트 생성됨`);
    // 생성된 포인트들을 무작위로 섞고 필요한 개수만큼 선택
    return generatedPoints.sort(() => 0.5 - Math.random()).slice(0, numPoints);

  }, [numPoints]);

  // --- 인스턴스 변환 및 이미지 인덱스 설정 ---
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempPosition = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (!meshRef.current || points.length === 0 || initialScales.length === 0) return;

    // 카메라 위치 (초기에는 [0, 0, 12] 근처)
    const cameraPosition = new THREE.Vector3(0, 0, 12);

    points.forEach((point, i) => {
      if (i >= numPoints) return;

      // 위치 설정
      dummy.position.copy(point);

      // 빌보딩: 초기에 카메라를 향하도록 설정
      dummy.lookAt(cameraPosition);

      // 저장된 스케일 사용
      dummy.scale.copy(initialScales[i]);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [points, initialScales, numPoints]);

  // --- 빌보딩, 애니메이션 및 회전 - 스크롤 효과 추가 ---
  useFrame((state) => {
    if (!meshRef.current || points.length === 0 || initialScales.length === 0) return;

    const time = state.clock.getElapsedTime();
    const cameraPosition = state.camera.position;

    // drei의 스크롤 위치와 실제 DOM 스크롤 위치 모두 활용
    const dreiScrollOffset = scroll.offset;

    // scrollY가 0부터 window.innerHeight까지의 값일 때 0~1 범위로 정규화
    const domScrollOffset = Math.min(scrollY / window.innerHeight, 1);

    // 두 스크롤 값 중 큰 값을 사용 (더 빠른 반응을 위해)
    const scrollOffset = Math.max(dreiScrollOffset, domScrollOffset);

    // 스크롤 기반 계산 파라미터
    const maxScrollScale = 3.5;
    const maxZoomOffset = 4.0;

    // 부드러운 전환을 위해 smoothstep 사용
    const smoothScroll = THREE.MathUtils.smootherstep(scrollOffset, 0, 1);

    // 투명도 계산: 스크롤이 0.6을 넘어가면 점진적으로 투명해짐
    // 0.6 ~ 0.9 사이에서 1 ~ 0으로 변경
    const fadeThreshold = 0.6; // 투명도가 감소하기 시작하는 스크롤 위치
    const fadeEnd = 0.9;      // 완전히 투명해지는 스크롤 위치

    let opacity = 1.0;
    if (scrollOffset > fadeThreshold) {
      // fadeThreshold와 fadeEnd 사이에서 1.0에서 0.0으로 선형 감소
      opacity = 1.0 - THREE.MathUtils.smoothstep(
        (scrollOffset - fadeThreshold) / (fadeEnd - fadeThreshold),
        0, 1
      );
    }

    // 투명도 설정
    if (materialRef.current) {
      // opacity 유니폼 값이 없으면 생성
      if (materialRef.current.uniforms.opacity === undefined) {
        materialRef.current.uniforms.opacity = { value: 1.0 };
      }
      materialRef.current.uniforms.opacity.value = opacity;

      // 캔버스 전체 투명도 설정 (완전히 투명해지면 렌더링 중지하여 성능 향상)
      if (opacity < 0.01) {
        meshRef.current.visible = false;
      } else {
        meshRef.current.visible = true;
      }
    }

    // 스크롤에 따른 터널 효과를 위한 카메라 FOV 변화
    // 기본 40도에서 스크롤에 따라 50도까지 증가 (원근감 강화)
    if (state.camera instanceof THREE.PerspectiveCamera) {
      state.camera.fov = THREE.MathUtils.lerp(40, 50, smoothScroll);
      state.camera.updateProjectionMatrix(); // 중요: 투영 행렬 업데이트
    }

    // 깊이 계산에 필요한 상수들 - 비대칭 상자 크기와 일치시킴
    const boxDims = { x: 6, y: 3.5, z: 4.5 }; // 포인트 생성 로직의 boxDims와 일치
    const maxDepthEffect = 1.2; // 깊이에 따른 최대 스케일 변화 정도

    // 재사용할 임시 객체들
    const lookAtQuaternion = new THREE.Quaternion();
    const finalScale = new THREE.Vector3();
    const worldPosition = new THREE.Vector3();

    // 카메라 효과 계수 계산 (카메라 위치에 따라 효과 강도 조절)
    const cameraDist = cameraPosition.length();
    const cameraEffectFactor = THREE.MathUtils.clamp(12 / cameraDist, 0.5, 2.0);

    // 회전 속도 (비대칭 형태의 특성을 살리기 위해 속도 조절)
    // 스크롤에 따라 회전 속도도 증가 - 빨려들어가는 효과 강화
    const rotationYSpeed = ANIMATION_CONFIG.ROTATION_SPEED * (1 + smoothScroll * 0.5);

    // 개별 인스턴스 애니메이션 및 빌보딩
    for (let i = 0; i < Math.min(points.length, numPoints); i++) {
      const point = points[i];

      // 1. 랜덤 애니메이션 파라미터 가져오기
      const speed = randomAnimationParams.speeds[i];
      const amplitude = randomAnimationParams.amplitudes[i];
      const offset = randomAnimationParams.offsets[i];

      // 2. 애니메이션 적용된 위치 계산 - 모든 축에 변화 적용
      tempPosition.copy(point);

      // 각 축에 다른 사인/코사인 함수와 오프셋 적용하여 더 복잡한 움직임 생성
      // 스크롤에 따라 진폭 점점 감소 (빨려들어가면서 더 안정적으로)
      const scrollAmpFactor = 1 - smoothScroll * 0.7; // 진폭 감소 팩터
      tempPosition.x += Math.sin(time * speed * 1.1 + offset * 1.5) * amplitude * ANIMATION_CONFIG.X_AXIS_RATIO * scrollAmpFactor;
      tempPosition.y += Math.sin(time * speed + offset) * amplitude * ANIMATION_CONFIG.Y_AXIS_RATIO * scrollAmpFactor;
      tempPosition.z += Math.cos(time * speed * 0.9 + offset * 2.0) * amplitude * ANIMATION_CONFIG.Z_AXIS_RATIO * scrollAmpFactor;

      // 3. 중심점 주위로 회전 (전체 회전 효과)
      // Y축 회전 - 비대칭 형태를 더 잘 보여주기 위해 속도 조절
      const rotationY = time * rotationYSpeed;
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const rotatedX = tempPosition.x * cosY - tempPosition.z * sinY;
      const rotatedZ = tempPosition.x * sinY + tempPosition.z * cosY;
      tempPosition.x = rotatedX;
      tempPosition.z = rotatedZ;

      // X축 회전 (약간만)
      const rotationX = Math.sin(time * 0.1) * ANIMATION_CONFIG.X_ROTATION_AMOUNT;
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const rotatedY = tempPosition.y * cosX - tempPosition.z * sinX;
      const newRotatedZ = tempPosition.y * sinX + tempPosition.z * cosX;
      tempPosition.y = rotatedY;
      tempPosition.z = newRotatedZ;

      // 4. 월드 위치 저장 (깊이 계산용)
      worldPosition.copy(tempPosition);

      // 5. 빨려 들어가는 효과: 각 객체의 위치를 원점(중심)을 향해 스크롤 정도에 따라 이동
      // 원점과의 거리와 방향 계산
      const dirToCenter = worldPosition.clone().negate().normalize(); // 월드 위치에서 원점(0,0,0)을 향하는 방향
      const distToCenter = worldPosition.length(); // 원점과의 거리

      // 빨려들어가는 강도 계산 - 중심에서 멀수록 더 강하게 당겨짐 (터널 효과)
      const pullFactor = THREE.MathUtils.lerp(
        0,
        Math.min(distToCenter * 1.2, maxZoomOffset), // 거리에 비례, 최대값 제한
        smoothScroll
      );

      // 객체 위치를 중심 방향으로 이동 (스크롤에 따라 강도 증가)
      worldPosition.add(dirToCenter.multiplyScalar(pullFactor));

      // 원근감 강화: 화면 바깥쪽 객체는 더 빠르게 중심으로 이동
      // 객체가 화면 중심에서 멀수록 더 많이 이동 (돌리 줌 효과 강화)
      const screenDistFactor = Math.sqrt(
        Math.pow(worldPosition.x / boxDims.x, 2) +
        Math.pow(worldPosition.y / boxDims.y, 2)
      );

      // 화면 가장자리 객체 추가 이동 (vignette 효과처럼)
      if (screenDistFactor > 0.3) { // 중심에서 30% 이상 떨어진 객체만 적용
        const edgePullFactor = (screenDistFactor - 0.3) * smoothScroll * 2.0;
        worldPosition.add(dirToCenter.multiplyScalar(edgePullFactor));
      }

      // 6. 위치 설정
      dummy.position.copy(worldPosition);

      // 7. 빌보딩: 카메라를 바라보도록 회전 설정
      dummy.lookAt(cameraPosition);
      lookAtQuaternion.copy(dummy.quaternion); // 회전값 저장

      // 8. 깊이에 따른 스케일 배율 계산
      // 카메라와의 실제 거리 계산 (보다 정확한 원근감을 위해)
      const distanceToCamera = worldPosition.distanceTo(cameraPosition);

      // 카메라 방향 벡터
      const cameraDir = new THREE.Vector3().subVectors(cameraPosition, new THREE.Vector3(0, 0, 0)).normalize();

      // 객체의 방향 벡터 (원점에서 객체로의 방향)
      const objectDir = worldPosition.clone().normalize();

      // 객체가 카메라와 얼마나 같은 방향에 있는지 계산 (-1 ~ 1)
      const dotProduct = cameraDir.dot(objectDir);

      // 방향성을 고려한 깊이 팩터 계산
      const maxDim = Math.max(boxDims.x, boxDims.y, boxDims.z) / 2;
      const depthFactor = THREE.MathUtils.clamp(dotProduct, -1, 1);

      // 깊이와 거리를 모두 고려한 스케일 배율 계산
      // 스크롤에 따라 깊이 효과 강화
      const enhancedDepthEffect = maxDepthEffect * (1 + smoothScroll * 0.5);
      const scaleMultiplier = THREE.MathUtils.lerp(
        1.0 - enhancedDepthEffect,   // 최소값 (뒤쪽): 더 작게
        1.0 + enhancedDepthEffect,   // 최대값 (앞쪽): 더 크게
        THREE.MathUtils.smootherstep((depthFactor + 1) * 0.5, 0, 1)
      );

      // 카메라 거리에 따른 추가 조정
      const distanceEffect = THREE.MathUtils.smoothstep(distanceToCamera, maxDim, maxDim * 3);
      const cameraAdjustedMultiplier = THREE.MathUtils.lerp(
        scaleMultiplier,
        scaleMultiplier * 0.5, // 멀리 있는 객체는 50% 더 작게
        distanceEffect
      ) * cameraEffectFactor;

      // 9. 최종 스케일 계산
      const scrollScaleMultiplier = THREE.MathUtils.lerp(
        1.0,
        maxScrollScale * (1.0 + screenDistFactor * 0.5), // 가장자리 객체는 더 크게 확대 (터널 효과)
        smoothScroll
      );

      // 초기 스케일 * 깊이 배율 * 스크롤 배율
      finalScale.copy(initialScales[i])
        .multiplyScalar(cameraAdjustedMultiplier)
        .multiplyScalar(scrollScaleMultiplier);

      // 10. 최종 매트릭스 구성
      dummy.position.copy(worldPosition);
      dummy.quaternion.copy(lookAtQuaternion);
      dummy.scale.copy(finalScale);

      // 11. 매트릭스 업데이트 및 적용
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    // 인스턴스 매트릭스 업데이트
    meshRef.current.instanceMatrix.needsUpdate = true;

    // 시간 유니폼 업데이트
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = time;
    }
  });

  // --- 마우스 이벤트 처리 (개선) ---
  const handlePointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (event.intersections.length > 0) {
      const intersect = event.intersections[0];
      const instanceId = intersect.instanceId;

      if (instanceId !== undefined && fundingItems.length > 0) {
        // instanceId를 사용하여 해당 펀딩 아이템 선택 (순환)
        const itemIndex = instanceId % fundingItems.length;
        const item = fundingItems[itemIndex];

        // 교차점의 월드 좌표를 화면 좌표로 변환
        const worldPos = intersect.point;
        const screenPos = worldPos.project(event.camera);

        // 화면 좌표를 픽셀 단위로 변환
        onItemHover(item, {
          x: (screenPos.x + 1) * window.innerWidth / 2,
          y: (-screenPos.y + 1) * window.innerHeight / 2
        });
      }
    } else {
      onItemLeave();
    }
  }, [fundingItems, onItemHover, onItemLeave]);

  // plane 지오메트리 생성 시 UV 좌표 조정 효과 추가
  /*
  useEffect(() => {
    if (geometryRef.current) {
      // 기존 UV 좌표 가져오기
      const uv = geometryRef.current.attributes.uv;

      // UV 좌표 수정 (Y축 뒤집기)
      for (let i = 0; i < uv.count; i++) {
        const y = uv.getY(i);
        uv.setY(i, 1 - y); // Y 좌표 뒤집기
      }

      // 업데이트 필요 표시
      uv.needsUpdate = true;
    }
  }, []);
  */

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[null!, null!, numPoints]}
        frustumCulled={false}
        castShadow
        receiveShadow
        onPointerMove={handlePointerMove}
        onPointerLeave={onItemLeave}
        raycast={new THREE.Mesh().raycast}
      >
        <planeGeometry ref={geometryRef} args={[1, 1]}>
          <instancedBufferAttribute
            attach="attributes-instanceImageIndex"
            args={[instanceImageIndices, 1, false]}
            array={instanceImageIndices}
            itemSize={1}
            count={numPoints}
          />
        </planeGeometry>
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          side={THREE.DoubleSide}
          depthTest={true}
          depthWrite={true}
          alphaTest={0.1}
          polygonOffset={true}
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </instancedMesh>
    </group>
  );
};


// --- 메인 HeroSection 컴포넌트 ---
const HeroSection = () => {
  const [fundingItems, setFundingItems] = useState<HeroFundingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<HeroFundingItem | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number, y: number } | null>(null);

  // 실제 DOM 스크롤 위치를 추적하는 state
  const [scrollY, setScrollY] = useState(0);

  // Canvas 가시성 제어 (스크롤 위치에 따라)
  const [canvasVisible, setCanvasVisible] = useState(true);
  const [canvasOpacity, setCanvasOpacity] = useState(1);

  // 컴포넌트 DOM 요소 참조
  const sectionRef = useRef<HTMLDivElement>(null);

  // 스크롤 이벤트 리스너 설정
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Hero 섹션의 높이
      const sectionHeight = sectionRef.current.offsetHeight;

      // 섹션이 절반 이상 스크롤되면 Canvas 투명도 조절 시작
      const fadeStartOffset = sectionHeight * 0.5;
      const fadeEndOffset = sectionHeight * 0.8;

      if (currentScrollY < fadeStartOffset) {
        // 상단 영역에서는 완전히 표시
        setCanvasOpacity(1);
        setCanvasVisible(true);
      } else if (currentScrollY >= fadeStartOffset && currentScrollY <= fadeEndOffset) {
        // 중간 영역에서는 투명도 점진적 감소
        const opacity = 1 - (currentScrollY - fadeStartOffset) / (fadeEndOffset - fadeStartOffset);
        setCanvasOpacity(opacity);
        setCanvasVisible(true);
      } else {
        // 하단 영역에서는 완전히 숨김
        setCanvasOpacity(0);
        setCanvasVisible(false);
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);

    // 초기 스크롤 위치에 맞춰 상태 설정
    handleScroll();

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 컴포넌트 마운트 시 API 호출하여 펀딩 데이터 로드
  useEffect(() => {
    const fetchFundings = async () => {
      try {
        setIsLoading(true);
        // API 호출 (환경 변수 사용)
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/fundings/list`);
        // API 응답 데이터를 HeroFundingItem 형태로 변환
        const heroItems: HeroFundingItem[] = response.data.map((item: any) => ({
          id: item.fundingId,
          title: item.title,
          imageUrl: item.product.image, // product.image 사용 확인
          progressPercentage: item.fundedAmount ? Math.floor((item.fundedAmount / item.product.price) * 100) : 0,
          parcitipantsNumber: item.participantsNumber ?? 0 // null일 경우 0 처리
        }));
        // 이미지 URL이 있는 아이템만 필터링하여 상태 업데이트
        setFundingItems(heroItems.filter(item => item.imageUrl));
      } catch (error) {
        console.error('펀딩 데이터를 가져오는 중 오류가 발생했습니다:', error);
        setFundingItems([]); // 에러 발생 시 빈 배열로 설정
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };
    fetchFundings();
  }, []); // 빈 의존성 배열: 마운트 시 1회만 실행

  // --- 호버 콜백 함수 (InstancedMesh 적용 시 수정 필요) ---
  // InstancedMesh는 개별 인스턴스 ID와 데이터를 받아와야 함
  const handleItemHover = (item: HeroFundingItem, screenPos: { x: number, y: number }) => {
    console.log("Hovering (InstancedMesh needs update)", item.id, screenPos); // 임시 로그
    setHoveredItem(item);
    setHoveredPosition(screenPos);
  };
  const handleItemLeave = () => {
    setHoveredItem(null);
    setHoveredPosition(null);
  };
  // --- ---

  return (
    <div
      ref={sectionRef}
      className="relative w-full bg-white"
      style={{
        height: '100vh', // 화면 높이만큼 영역 확보
        minHeight: '600px', // 최소 높이 설정
        overflow: 'hidden', // 이 컨테이너의 스크롤바 숨김
        position: 'relative' // 확실하게 relative 적용
      }}
    >
      {/* Canvas 컴포넌트 - DOM 스크롤에 따라 가시성 및 투명도 제어 */}
      {canvasVisible && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: canvasOpacity,
            transition: 'opacity 0.3s ease',
            zIndex: 1,
            overflow: 'hidden' // Canvas 컨테이너도 overflow 숨김
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 13], fov: 40 }}
            style={{
              display: 'block', // 블록 레벨로 설정
              outline: 'none' // 포커스 아웃라인 제거
            }}
          >
            <ScrollControls
              damping={0.25}
              pages={1}
              distance={1}
            >
              {/* 조명 설정 */}
              <ambientLight intensity={1.8} />
              <pointLight position={[10, 10, 10]} intensity={4.0} color={0xffffff} />
              <pointLight position={[-10, -10, -10]} intensity={2.5} color={0xffffff} />
              <pointLight position={[0, 5, 5]} intensity={2.5} color={0xffffff} />
              <primitive
                object={new THREE.HemisphereLight(0xffffff, 0x404040, 2.0)}
                position={[0, 10, 0]}
              />

              <Suspense fallback={
                <Text color="black" anchorX="center" anchorY="middle" fontSize={0.5}>Loading 3D...</Text>
              }>
                {/* 로딩 상태 및 데이터 유무에 따른 조건부 렌더링 */}
                {isLoading ? null : fundingItems.length > 0 ? (
                  <GiftBoxEffect
                    fundingItems={fundingItems}
                    onItemHover={handleItemHover}
                    onItemLeave={handleItemLeave}
                    scrollY={scrollY} // 실제 스크롤 위치 전달
                  />
                ) : (
                  <Text color="grey" anchorX="center" anchorY="middle" fontSize={0.4} maxWidth={5} textAlign="center">No funding available.</Text>
                )}
              </Suspense>
              <Preload all />
            </ScrollControls>
          </Canvas>
        </div>
      )}

      {/* 로딩 중일 때 표시될 스피너 (캔버스 위에 오버레이) */}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* 호버 시 상세 정보 표시 컴포넌트 (캔버스 외부에 렌더링) */}
      <FeaturedFunding item={hoveredItem} screenPosition={hoveredPosition} />

      {/* 스크롤바 숨김을 위한 스타일 적용 - 컴포넌트 마운트 시 실행 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* 스크롤바 숨김 스타일 */
          ::-webkit-scrollbar {
            width: 0 !important;
            display: none;
          }
          body {
            -ms-overflow-style: none;
            scrollbar-width: none;
            scroll-behavior: smooth;
          }
        `
      }} />
    </div>
  );
};

export default HeroSection;
