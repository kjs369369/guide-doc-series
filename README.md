# 김진수 · AICLab — 소개 · 포트폴리오 웹앱

AI 전문가 김진수(메이랜드AI비즈랩 대표 / AICLab 소장)의 개인 소개·포트폴리오·강의 컨설팅 문의 페이지입니다.
핀터레스트 스타일의 메이슨리 카드 보드와, 정적 페이지에서도 실제로 쓸 수 있는 문의 폼을 포함합니다.

- GitHub Pages URL: `https://kjs369369.github.io/kimjinsoo-portfolio/`
- 저장소: `https://github.com/kjs369369/kimjinsoo-portfolio`

## 구성

| 파일 | 역할 |
| --- | --- |
| `index.html` | 전체 마크업(고정 헤더, 히어로, 소개, 포트폴리오, 저서·수상, 문의, 푸터) |
| `styles.css` | 디자인 시스템(잉크·크림·골드), 메이슨리 레이아웃, 모달, 반응형 |
| `app.js` | 카드 데이터·SVG 일러스트·필터·상세 모달·문의 폼 |
| `favicon.svg` | 파비콘 |

외부 라이브러리·외부 이미지·외부 폰트를 쓰지 않습니다. 모든 시각 요소는 인라인 SVG와 CSS로 그립니다.
(이미지 URL이 깨져 빈 카드가 되는 일이 없습니다.)

## 수정 포인트

### 1) 카드 내용 바꾸기 / 추가하기
`app.js` 안의 `CARDS` 배열을 수정합니다. 카드 한 개는 아래 형태입니다.

```js
{
  id: "geo-consulting",          // 고유 id
  cat: "geo",                    // geo | edu | book | art | award
  tone: "ink",                   // ink | gold | sage | clay | plum | navy | paper
  kind: "quote",                 // (선택) book | quote | stat | steps | list — 없으면 SVG 일러스트
  art: "network",                // (선택) network | flow | terminal | compare | lecture | canvas | medal | grid
  ratio: 1.28,                   // 카드 시각 영역의 가로/세로 비율
  title: "제목",
  sub: "한 줄 설명",
  body: ["문단1", "문단2"],       // 모달 본문
  bullets: ["· 목록"],            // (선택)
  facts: [["구분", "값"]],        // (선택) 모달 하단 표
  link: { label: "자세히 보기", url: "https://..." } // (선택)
}
```

### 2) 실제 사진으로 교체하기
카드 이미지는 지금 SVG 일러스트입니다. 실제 강의·전시 사진을 넣으려면:

1. `images/` 폴더를 만들고 사진을 넣습니다(예: `images/lecture-01.jpg`).
2. `app.js`의 `visual()` 맨 위에 분기를 추가합니다.

```js
if (c.photo) {
  return `<img src="${c.photo}" alt="${c.title}" loading="lazy"
            style="width:100%;height:100%;object-fit:cover;display:block" />`;
}
```
3. 해당 카드에 `photo: "images/lecture-01.jpg"` 를 추가합니다.
   (비율은 `ratio` 값으로 조정. 0.8 = 세로로 긴 카드, 1.3 = 가로로 긴 카드)

### 3) 링크·연락처
- 채널 링크: `index.html` 푸터의 `.footer__social`
- 전화·이메일: `index.html` 문의 섹션 + 푸터 / `app.js`의 `MAIL` 상수
- 사업자 정보: `index.html` 푸터 `.footer__biz`

### 4) 문의 폼 동작 (정적 페이지)
서버가 없으므로 제출 시 다음을 제공합니다.
1. `mailto:info@aiclab2020.com` 으로 제목·본문이 채워진 메일 창 열기
2. 문의 내용 원클릭 복사(클립보드)
3. 직통 전화·이메일 안내 + 미리보기

자동 발송이 필요하면 Formspree, Google Apps Script, Cloudflare Workers 같은 폼 엔드포인트를
`form` submit 핸들러에 연결하면 됩니다.

## 로컬 확인

```bash
python3 -m http.server 8080
# http://localhost:8080
```

## 배포

`main` 브랜치 루트를 GitHub Pages로 배포합니다.

```bash
gh api repos/kjs369369/kimjinsoo-portfolio/pages -X POST \
  -f "source[branch]=main" -f "source[path]=/"
```
