const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, 'images', 'gallery');
const categories = [
  { key: 'lecture', name: '강의' },
  { key: 'workshop', name: '워크숍' },
  { key: 'event', name: '행사' },
  { key: 'project', name: '프로젝트' }
];

// 1. 카테고리별 폴더가 없으면 자동 생성
categories.forEach(cat => {
  const folderPath = path.join(galleryDir, cat.key);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`[폴더 생성 완료] images/gallery/${cat.key}/`);
  }
});

// 2. images/gallery 하위 폴더의 모든 이미지 스캔
const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
const galleryItems = [];

categories.forEach(cat => {
  const folderPath = path.join(galleryDir, cat.key);
  if (fs.existsSync(folderPath)) {
    let files = fs.readdirSync(folderPath);
    // 자연스러운 숫자 순서(Natural Sort Order: 1, 2, 3... 10) 정렬
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    files.forEach((file, index) => {
      const ext = path.extname(file);
      if (validExts.includes(ext.toLowerCase())) {
        const basename = path.basename(file, ext);
        // 숫자 (_1, _2, 1, 2 등) 정리된 깔끔한 제목 생성
        let cleanTitle = basename
          .replace(/_\d+$/i, '')
          .replace(/\s+\d+$/i, '')
          .replace(/[-_]/g, ' ')
          .trim();

        // _1 이거나 첫 대표 이미지 여부 확인
        const isPrimary = /_1$/i.test(basename) || / 1$/i.test(basename) || (!/_\d+$/i.test(basename) && !/\s\d+$/i.test(basename));

        galleryItems.push({
          id: `${cat.key}-${index + 1}`,
          category: cat.key,
          badge: cat.name,
          title: cleanTitle || `${cat.name} 기록`,
          rawTitle: basename,
          isPrimary: isPrimary,
          cohort: `${cat.name} 세션`,
          date: new Date().toISOString().slice(0, 10).replace(/-/g, '. '),
          desc: `${cleanTitle || cat.name} 관련 현장 기록 및 교육 수련 장면입니다.`,
          src: `images/gallery/${cat.key}/${file}`
        });
      }
    });
  }
});

// 3. gallery-data.json 및 gallery-data.js 동시 생성 (로컬 file:// 실행 완벽 지원)
const jsonPath = path.join(__dirname, 'gallery-data.json');
fs.writeFileSync(jsonPath, JSON.stringify(galleryItems, null, 2), 'utf8');

const jsPath = path.join(__dirname, 'gallery-data.js');
fs.writeFileSync(jsPath, `window.GALLERY_DATA = ${JSON.stringify(galleryItems, null, 2)};`, 'utf8');

console.log(`\n✅ 갤러리 데이터 업데이트 완료! 총 ${galleryItems.length}개의 이미지가 등록되었습니다.`);
console.log(`📄 데이터 파일: gallery-data.json, gallery-data.js 생성 완료`);
