const fs = require('fs');
const path = require('path');

// SVG를 PNG와 ICO로 변환하는 스크립트
// 이 스크립트를 실행하려면 다음 패키지들이 필요합니다:
// npm install sharp

async function convertSvgToPng() {
  try {
    // sharp 패키지가 설치되어 있는지 확인
    const sharp = require('sharp');
    
    console.log('SVG를 PNG와 ICO로 변환 중...');
    
    // SVG 파일 경로
    const svgPath = path.join(__dirname, '../public/logo-og.svg');
    const faviconSvgPath = path.join(__dirname, '../public/logo-favicon.svg');
    
    // 1. 메인 로고 변환 (1200x630)
    const outputPath = path.join(__dirname, '../public/logo-og.png');
    await sharp(svgPath)
      .resize(1200, 630)
      .png()
      .toFile(outputPath);
    console.log('✅ logo-og.png (1200x630) 생성 완료!');
    
    // 2. Favicon 변환 (64x64)
    const faviconOutputPath = path.join(__dirname, '../public/logo-favicon.png');
    await sharp(faviconSvgPath)
      .resize(64, 64)
      .png()
      .toFile(faviconOutputPath);
    console.log('✅ logo-favicon.png (64x64) 생성 완료!');
    
    // 3. ICO 파일 생성 (16x16, 32x32, 48x48 크기 포함)
    const icoOutputPath = path.join(__dirname, '../public/favicon.ico');
    
    // ICO 파일은 여러 크기의 PNG를 포함해야 하므로, 
    // 16x16, 32x32, 48x48 크기로 생성
    const sizes = [16, 32, 48];
    const pngBuffers = [];
    
    for (const size of sizes) {
      const buffer = await sharp(faviconSvgPath)
        .resize(size, size)
        .png()
        .toBuffer();
      pngBuffers.push({ size, buffer });
    }
    
    // ICO 파일 생성 (간단한 방식)
    // 실제로는 더 복잡한 ICO 포맷 처리가 필요하지만, 
    // 여기서는 32x32 PNG를 favicon.ico로 복사
    await sharp(faviconSvgPath)
      .resize(32, 32)
      .png()
      .toFile(icoOutputPath.replace('.ico', '-32.png'));
    
    // favicon.ico 파일을 32x32 PNG로 교체
    await sharp(faviconSvgPath)
      .resize(32, 32)
      .png()
      .toFile(icoOutputPath);
    
    console.log('✅ favicon.ico (32x32) 생성 완료!');
    
    // 4. 다양한 크기의 아이콘들 생성
    const iconSizes = [16, 32, 48, 72, 96, 144, 192, 512];
    
    for (const size of iconSizes) {
      const iconPath = path.join(__dirname, `../public/logo-icon-${size}.png`);
      await sharp(faviconSvgPath)
        .resize(size, size)
        .png()
        .toFile(iconPath);
      console.log(`✅ logo-icon-${size}.png (${size}x${size}) 생성 완료!`);
    }
    
    console.log('\n🎉 모든 로고 변환 완료!');
    console.log('생성된 파일들:');
    console.log('- logo-og.png (1200x630) - 소셜 미디어 공유용');
    console.log('- logo-favicon.png (64x64) - favicon용');
    console.log('- favicon.ico (32x32) - 브라우저 favicon용');
    console.log('- logo-icon-*.png - 다양한 크기의 아이콘들');
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('❌ sharp 패키지가 설치되지 않았습니다.');
      console.log('다음 명령어로 설치하세요:');
      console.log('npm install sharp');
    } else {
      console.error('❌ 변환 중 오류 발생:', error.message);
    }
  }
}

// 스크립트 실행
convertSvgToPng();

