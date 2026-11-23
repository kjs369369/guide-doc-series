/* ==========================================================
   김진수 · AICLab — app.js
   카드 데이터 · 핀터레스트 메이슨리 · 필터 · 상세 모달 · 문의 폼
   ========================================================== */
(function () {
  "use strict";

  /* ───────────── 팔레트 ───────────── */
  const P = {
    ink:   { bg: "#1b1714", bg2: "#2e2620", fg: "#f6f1e8", accent: "#d9bd74", line: "rgba(217,189,116,.42)" },
    gold:  { bg: "#e9d9ab", bg2: "#d6bd82", fg: "#2a2118", accent: "#8c6d1f", line: "rgba(42,33,24,.26)" },
    sage:  { bg: "#2f4f45", bg2: "#243d35", fg: "#eef2ec", accent: "#d9bd74", line: "rgba(238,242,236,.32)" },
    clay:  { bg: "#a4553a", bg2: "#84402a", fg: "#fbeee6", accent: "#f2d4a4", line: "rgba(251,238,230,.36)" },
    plum:  { bg: "#43324d", bg2: "#31233d", fg: "#f4ecf2", accent: "#d9bd74", line: "rgba(244,236,242,.3)" },
    navy:  { bg: "#22334a", bg2: "#17243c", fg: "#e9eef5", accent: "#d9bd74", line: "rgba(233,238,245,.3)" },
    paper: { bg: "#f0e7d5", bg2: "#e0d2b6", fg: "#2c2621", accent: "#a4553a", line: "rgba(44,38,33,.22)" }
  };

  const CAT_LABEL = {
    geo: "GEO마케팅",
    edu: "AI 교육·자동화",
    book: "저서·출간",
    art: "AI 아트·전시",
    award: "수상·자격"
  };

  const ASK_LABEL = {
    geo: "GEO 컨설팅 문의",
    edu: "AI 특강·워크숍 문의",
    book: "강연·집필 문의",
    art: "AI 아트 협업 문의",
    award: "강연 문의"
  };

  const ASK_DEFAULT = {
    geo: "GEO마케팅 전략 컨설팅",
    edu: "기업·공공기관 AI 특강",
    book: "기업·공공기관 AI 특강",
    art: "1:1 코칭·협업",
    award: "기업·공공기관 AI 특강"
  };

  /* ───────────── SVG 아트 ───────────── */
  let uid = 0;

  function frame(h, p, inner) {
    const id = "g" + (++uid);
    return `<svg viewBox="0 0 400 ${h}" preserveAspectRatio="xMidYMid slice" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="${p.bg}"/><stop offset="1" stop-color="${p.bg2}"/>
        </linearGradient>
        <pattern id="${id}d" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="1" fill="${p.fg}" opacity=".1"/>
        </pattern>
      </defs>
      <rect width="400" height="${h}" fill="url(#${id})"/>
      <rect width="400" height="${h}" fill="url(#${id}d)"/>
      ${inner}
    </svg>`;
  }

  const ART = {
    /* GEO — 엔티티 네트워크 */
    network(p, h) {
      const cy = h * 0.52;
      const nodes = [
        [72, cy - h * 0.28], [318, cy - h * 0.22], [54, cy + h * 0.24], [330, cy + h * 0.28],
        [150, cy + h * 0.34], [268, cy - h * 0.36]
      ];
      let g = `<g stroke="${p.line}" stroke-width="1" fill="none">
        <circle cx="200" cy="${cy}" r="${h * 0.2}" opacity=".45"/>
        <circle cx="200" cy="${cy}" r="${h * 0.31}" opacity=".25"/>
        <circle cx="200" cy="${cy}" r="${h * 0.42}" opacity=".14"/>`;
      nodes.forEach((n) => { g += `<path d="M200 ${cy} L${n[0]} ${n[1]}"/>`; });
      g += `</g><g fill="${p.accent}"><circle cx="200" cy="${cy}" r="9"/>`;
      nodes.forEach((n, i) => { g += `<circle cx="${n[0]}" cy="${n[1]}" r="${i % 2 ? 4 : 6}" opacity=".9"/>`; });
      g += `</g>`;
      g += `<g fill="${p.fg}" font-family="sans-serif" font-size="9.5" opacity=".62" letter-spacing="1">
        <text x="26" y="${h - 30}">ENTITY</text>
        <text x="300" y="${h - 30}">CITATION</text>
      </g>`;
      g += `<text x="200" y="${h - 30}" text-anchor="middle" fill="${p.fg}" font-family="Georgia,serif" font-size="13" letter-spacing="5" opacity=".9">GEO</text>`;
      return frame(h, p, g);
    },

    /* 업무 자동화 흐름 */
    flow(p, h) {
      let g = `<g fill="none" stroke="${p.line}" stroke-width="1.2">`;
      const bw = 132, x = 134, y0 = h * 0.16, gap = h * 0.2;
      for (let i = 0; i < 3; i++) {
        g += `<rect x="${x}" y="${y0 + i * gap}" width="${bw}" height="${h * 0.115}" rx="9"/>`;
        if (i < 2) g += `<path d="M200 ${y0 + i * gap + h * 0.115} v${gap - h * 0.115}"/>`;
      }
      g += `<path d="M60 ${y0 + h * 0.06} H${x}" stroke-dasharray="3 4"/><path d="M${x + bw} ${y0 + h * 0.06} H340" stroke-dasharray="3 4"/>`;
      g += `<circle cx="60" cy="${y0 + h * 0.06}" r="4" fill="${p.accent}" stroke="none"/>`;
      g += `<circle cx="340" cy="${y0 + h * 0.06}" r="4" fill="${p.accent}" stroke="none"/>`;
      g += `</g>`;
      g += `<g fill="${p.fg}" font-family="sans-serif" font-size="10.5" opacity=".85" letter-spacing=".5">
        <text x="158" y="${y0 + h * 0.068}">수집 · 입력</text>
        <text x="158" y="${y0 + gap + h * 0.068}">AI 처리</text>
        <text x="158" y="${y0 + gap * 2 + h * 0.068}">발행 · 자동화</text>
      </g>`;
      g += `<text x="200" y="${h - 26}" text-anchor="middle" fill="${p.accent}" font-family="sans-serif" font-size="9.5" letter-spacing="3">WORKFLOW</text>`;
      return frame(h, p, g);
    },

    /* 터미널 스타일 */
    terminal(p, h) {
      let g = `<rect x="34" y="${h * 0.16}" width="332" height="${h * 0.62}" rx="12" fill="rgba(0,0,0,.28)" stroke="${p.line}"/>`;
      g += `<g fill="${p.accent}"><circle cx="54" cy="${h * 0.16 + 16}" r="3.2"/><circle cx="66" cy="${h * 0.16 + 16}" r="3.2" opacity=".6"/><circle cx="78" cy="${h * 0.16 + 16}" r="3.2" opacity=".35"/></g>`;
      const lines = [
        [p.accent, "$ claude code"],
        [p.fg, "› skill: geo-brief"],
        [p.fg, "› run workflow.md"],
        [p.accent, "✓ published 12 assets"]
      ];
      let y = h * 0.16 + 52;
      lines.forEach((l, i) => {
        g += `<text x="56" y="${y}" fill="${l[0]}" font-family="ui-monospace,Menlo,monospace" font-size="11.5" opacity="${i === 3 ? 1 : 0.85}">${l[1]}</text>`;
        y += 26;
      });
      g += `<rect x="56" y="${y - 14}" width="${h * 0.05}" height="12" fill="${p.accent}" opacity=".7"/>`;
      return frame(h, p, g);
    },

    /* SEO vs GEO 비교 */
    compare(p, h) {
      const mid = 200;
      let g = `<line x1="${mid}" y1="${h * 0.14}" x2="${mid}" y2="${h * 0.86}" stroke="${p.line}" stroke-dasharray="2 5"/>`;
      g += `<text x="100" y="${h * 0.16}" text-anchor="middle" fill="${p.fg}" font-family="Georgia,serif" font-size="15" letter-spacing="3" opacity=".55">SEO</text>`;
      g += `<text x="300" y="${h * 0.16}" text-anchor="middle" fill="${p.accent}" font-family="Georgia,serif" font-size="15" letter-spacing="3">GEO</text>`;
      const rows = ["키워드 순위", "클릭 유도", "페이지 최적화", "AI 인용 · 추천"];
      rows.forEach((r, i) => {
        const y = h * 0.28 + i * (h * 0.145);
        g += `<circle cx="66" cy="${y - 4}" r="3" fill="${p.fg}" opacity=".3"/>`;
        g += `<text x="82" y="${y}" fill="${p.fg}" font-family="sans-serif" font-size="10.5" opacity=".55">${r}</text>`;
        g += `<circle cx="266" cy="${y - 4}" r="4" fill="${p.accent}"/>`;
        g += `<text x="282" y="${y}" fill="${p.fg}" font-family="sans-serif" font-size="10.5" opacity=".9">${r}</text>`;
      });
      g += `<path d="M250 ${h * 0.72} l-8 8 l8 8" fill="none" stroke="${p.accent}" stroke-width="1.4" opacity=".8"/>`;
      return frame(h, p, g);
    },

    /* 강의장 */
    lecture(p, h) {
      let g = `<rect x="96" y="${h * 0.14}" width="208" height="${h * 0.26}" rx="6" fill="rgba(0,0,0,.22)" stroke="${p.line}"/>`;
      g += `<path d="M186 ${h * 0.22} l24 14 l-24 14 z" fill="${p.accent}" opacity=".85"/>`;
      g += `<g fill="${p.accent}" opacity=".5">`;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 7; c++) {
          const x = 44 + c * 46 + (r % 2 ? 12 : 0);
          const y = h * 0.56 + r * 32;
          g += `<rect x="${x}" y="${y}" width="26" height="15" rx="5"/>`;
        }
      }
      g += `</g><g fill="${p.fg}" opacity=".28">`;
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 5; c++) {
          g += `<circle cx="${80 + c * 62 + (r % 2 ? 26 : 0)}" cy="${h * 0.56 + r * 32 + 8}" r="5"/>`;
        }
      }
      g += `</g>`;
      g += `<text x="200" y="${h - 22}" text-anchor="middle" fill="${p.fg}" font-family="sans-serif" font-size="9.5" letter-spacing="3" opacity=".55">LECTURE · WORKSHOP</text>`;
      return frame(h, p, g);
    },

    /* AI 아트 — 캔버스 붓질 */
    canvas(p, h, seed) {
      const s = seed || 1;
      let g = `<g fill="none" stroke="${p.accent}" stroke-linecap="round">`;
      g += `<circle cx="${300 - s * 12}" cy="${h * 0.26}" r="${h * 0.11}" stroke-width="1.2" opacity=".85"/>`;
      g += `<circle cx="${300 - s * 12}" cy="${h * 0.26}" r="${h * 0.055}" fill="${p.accent}" stroke="none" opacity=".9"/>`;
      for (let i = 0; i < 4; i++) {
        const y = h * 0.42 + i * (h * 0.12) + s * 4;
        g += `<path d="M-20 ${y} C ${90 + i * 20} ${y - 46}, ${180 - i * 12} ${y + 40}, 430 ${y - 26}"
          stroke="${p.fg}" stroke-width="${1.4 - i * 0.2}" opacity="${0.5 - i * 0.08}"/>`;
      }
      g += `<path d="M40 ${h * 0.86} C 140 ${h * 0.72}, 230 ${h * 0.98}, 380 ${h * 0.78}" stroke="${p.accent}" stroke-width="2.2" opacity=".75"/>`;
      g += `</g>`;
      g += `<text x="34" y="${h - 26}" fill="${p.fg}" font-family="Georgia,serif" font-size="11" letter-spacing="3" opacity=".6">CANVAS ART</text>`;
      return frame(h, p, g);
    },

    /* 메달 */
    medal(p, h) {
      const cy = h * 0.42;
      let g = `<g><path d="M182 ${cy - 40} l-24 76 h20 l22 -60z" fill="${p.accent}" opacity=".55"/>`;
      g += `<path d="M218 ${cy - 40} l24 76 h-20 l-22 -60z" fill="${p.accent}" opacity=".4"/>`;
      g += `<circle cx="200" cy="${cy}" r="44" fill="none" stroke="${p.accent}" stroke-width="1.6"/>`;
      g += `<circle cx="200" cy="${cy}" r="34" fill="${p.accent}" opacity=".18"/>`;
      g += `<path d="M200 ${cy - 15} l4.6 9.6 10.4 1.5 -7.6 7.4 1.8 10.5 -9.2 -4.9 -9.2 4.9 1.8 -10.5 -7.6 -7.4 10.4 -1.5z" fill="${p.accent}"/>`;
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        g += `<line x1="${200 + Math.cos(a) * 50}" y1="${cy + Math.sin(a) * 50}" x2="${200 + Math.cos(a) * 56}" y2="${cy + Math.sin(a) * 56}" stroke="${p.accent}" stroke-width="1" opacity=".45"/>`;
      }
      g += `</g><text x="200" y="${h - 26}" text-anchor="middle" fill="${p.fg}" font-family="sans-serif" font-size="9.5" letter-spacing="3" opacity=".6">AWARD</text>`;
      return frame(h, p, g);
    },

    /* 코드 그리드 — 바이브코딩 */
    grid(p, h) {
      let g = `<g>`;
      const cell = 34, cols = 7, startX = 60, startY = h * 0.18;
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < cols; c++) {
          const hot = (r === 2 && c === 3) || (r === 3 && c === 4);
          g += `<rect x="${startX + c * cell}" y="${startY + r * cell}" width="${cell - 8}" height="${cell - 8}" rx="6"
            fill="${hot ? p.accent : "none"}" stroke="${p.line}" opacity="${hot ? 0.9 : 0.5}"/>`;
        }
      }
      g += `</g>`;
      g += `<path d="M${startX + 3 * cell + 13} ${startY + 2 * cell + 13} l26 34" stroke="${p.accent}" stroke-width="1.2" fill="none" opacity=".7"/>`;
      g += `<text x="200" y="${h - 24}" text-anchor="middle" fill="${p.fg}" font-family="ui-monospace,Menlo,monospace" font-size="10.5" letter-spacing="2" opacity=".7">vibe coding</text>`;
      return frame(h, p, g);
    }
  };

  /* ───────────── HTML 포스터 ───────────── */
  function posterQuote(c, tone) {
    const p = P[tone];
    return `<div class="poster poster--quote" style="--p-bg:${p.bg};--p-bg2:${p.bg2};--p-fg:${p.fg};--p-accent:${p.accent}">
      <span class="poster__mark" aria-hidden="true">“</span>
      <p class="poster__text">${c.quote}</p>
      <span class="poster__by">${c.by || "김진수 · AICLab"}</span>
    </div>`;
  }

  function posterStat(c, tone) {
    const p = P[tone];
    return `<div class="poster poster--stat" style="--p-bg:${p.bg};--p-bg2:${p.bg2};--p-fg:${p.fg};--p-accent:${p.accent}">
      <span class="poster__kicker">${c.kicker || "NUMBERS"}</span>
      <div class="poster__nums">
        ${(c.nums || []).map((n) => `<div><strong>${n.v}</strong><span>${n.l}</span></div>`).join("")}
      </div>
      ${c.footnote ? `<p class="poster__foot">${c.footnote}</p>` : ""}
    </div>`;
  }

  function posterSteps(c, tone) {
    const p = P[tone];
    return `<div class="poster poster--steps" style="--p-bg:${p.bg};--p-bg2:${p.bg2};--p-fg:${p.fg};--p-accent:${p.accent}">
      <span class="poster__kicker">${c.kicker || "PROCESS"}</span>
      <ol class="poster__steps">
        ${(c.steps || []).map((s, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><div><strong>${s.t}</strong><em>${s.d}</em></div></li>`).join("")}
      </ol>
    </div>`;
  }

  function posterList(c, tone) {
    const p = P[tone];
    return `<div class="poster poster--list" style="--p-bg:${p.bg};--p-bg2:${p.bg2};--p-fg:${p.fg};--p-accent:${p.accent}">
      <span class="poster__kicker">${c.kicker || "LIST"}</span>
      <strong class="poster__head">${c.head}</strong>
      <ul class="poster__items">
        ${(c.items || []).map((i) => `<li>${i}</li>`).join("")}
      </ul>
    </div>`;
  }

  function posterBook(c, tone) {
    const p = P[tone];
    return `<div class="book" data-tone="${tone}" style="--p-bg:${p.bg};--p-bg2:${p.bg2};--p-fg:${p.fg};--p-accent:${p.accent}">
      <span class="book__spine" aria-hidden="true"></span>
      <div class="book__face">
        <span class="book__kicker">${c.series || "AICLab"}</span>
        <strong class="book__title">${c.lines.join("<br />")}</strong>
        <span class="book__rule" aria-hidden="true"></span>
        <span class="book__pub">${c.pub}</span>
      </div>
      <span class="book__author">김진수</span>
    </div>`;
  }

  function visual(c, mode) {
    if (c.kind === "book") return posterBook(c, c.tone);
    if (c.kind === "quote") return posterQuote(c, c.tone);
    if (c.kind === "stat") return posterStat(c, c.tone);
    if (c.kind === "steps") return posterSteps(c, c.tone);
    if (c.kind === "list") return posterList(c, c.tone);
    const p = P[c.tone] || P.ink;
    const h = mode === "modal" ? 220 : Math.round(400 / (c.ratio || 1.2));
    return ART[c.art] ? ART[c.art](p, h, c.seed) : ART.network(p, h);
  }

  /* ───────────── 카드 데이터 ───────────── */
  const CARDS = [
    /* ── GEO마케팅 ── */
    {
      id: "geo-consulting", cat: "geo", tone: "ink", art: "network", ratio: 1.28,
      title: "GEO 전략 컨설팅",
      sub: "생성형 AI가 인용하는 콘텐츠를 설계합니다",
      body: [
        "GEO(Generative Engine Optimization)는 검색 순위를 넘어, ChatGPT·Gemini·Perplexity 같은 생성형 AI가 브랜드와 사람을 정확히 이해하고 답변에서 인용·추천하도록 정보 구조를 설계하는 전략입니다.",
        "이름·전문 분야·활동·조직·콘텐츠가 인터넷에서 하나의 일관된 엔티티로 연결되도록 만들고, AI가 읽고 인용하기 좋은 문장과 출처를 함께 정비합니다."
      ],
      bullets: [
        "엔티티 정의 — 나와 브랜드는 무엇을 하는 사람인가",
        "구조화 콘텐츠 — 스키마·FAQ·비교형 콘텐츠 설계",
        "인용 검증 — 주요 AI에 질문해 실제 인용 여부 추적",
        "채널 교차 검증 — 홈페이지·블로그·SNS·언론 정보의 정합성"
      ],
      facts: [["저서", "『이것이 GEO마케팅이다』 · 『AI가 고객을 데려오는 시대』"], ["소속", "GEO마케팅연구원 부원장"], ["진행 형태", "전략 진단 → 로드맵 → 실행 워크숍"]],
      link: { label: "김진수 프로필 보기", url: "https://kimjinsoo.aiclab.kr" }
    },
    {
      id: "geo-quote", cat: "geo", tone: "plum", kind: "quote", ratio: 1.16,
      title: "AI가 고객을 데려오는 시대",
      sub: "GEO마케팅으로 비즈니스의 언어를 바꿉니다",
      quote: "AI가 고객을 데려오는 시대, GEO마케팅으로 비즈니스의 언어를 바꿉니다",
      body: [
        "검색창에 질문하던 고객이 이제 AI에게 묻습니다. AI의 답변에 등장하지 않는 브랜드는 고객의 선택지에도 오르지 않습니다.",
        "그래서 지금 필요한 것은 광고비가 아니라, AI가 읽고 인용할 수 있는 정보 구조입니다."
      ],
      bullets: ["콘텐츠를 만드는 일에서, 인용되는 구조를 만드는 일로", "단발성 노출이 아닌 축적되는 신뢰 자산"]
    },
    {
      id: "geo-steps", cat: "geo", tone: "gold", kind: "steps", ratio: 1.24,
      title: "GEO 실행 3단계",
      sub: "정의하고, 구조화하고, 검증합니다",
      kicker: "GEO PROCESS",
      steps: [
        { t: "엔티티 정의", d: "누구를 돕는 어떤 전문가인지 한 문장으로 고정" },
        { t: "구조화 콘텐츠", d: "스키마·FAQ·사례·비교 콘텐츠로 근거 축적" },
        { t: "인용 검증", d: "AI 답변을 추적하고 부족한 정보를 다시 채움" }
      ],
      body: ["컨설팅은 이 세 단계를 고객의 업종과 목표에 맞춰 설계하는 일입니다.", "진단 → 로드맵 → 실행 워크숍 순으로, 담당자가 남아서 계속 운영할 수 있는 구조로 만듭니다."],
      facts: [["기간", "진단 2주 · 로드맵 2주 · 실행 워크숍 4~8주"], ["산출물", "엔티티 정의서 · 콘텐츠 맵 · 인용 추적 시트"]]
    },
    {
      id: "geo-book", cat: "geo", tone: "clay", kind: "book", ratio: 0.78,
      title: "『AI가 고객을 데려오는 시대 — GEO마케팅 완전정복』",
      sub: "미디어북 · 2026",
      series: "GEO마케팅",
      lines: ["AI가 고객을", "데려오는 시대", "GEO마케팅", "완전정복"],
      pub: "미디어북 · 2026",
      body: ["생성형 AI 검색 환경에서 고객을 데려오는 방법을 정리한 GEO마케팅 실전서입니다.", "엔티티 설계부터 콘텐츠 구조, 인용 추적까지 실행 순서대로 담았습니다."],
      facts: [["출간", "2026 · 미디어북"], ["분야", "GEO마케팅 / 디지털 마케팅"]]
    },
    {
      id: "geo-compare", cat: "geo", tone: "sage", art: "compare", ratio: 1.1,
      title: "SEO에서 GEO로",
      sub: "검색 순위를 넘어 AI의 답변으로",
      body: ["SEO가 검색 결과 페이지에서 발견되는 일을 다뤘다면, GEO는 생성형 AI가 사람·브랜드·콘텐츠의 관계를 이해하고 답변에 활용하도록 구조를 만드는 일입니다.", "두 전략은 대체가 아니라 확장입니다. 기존 콘텐츠를 GEO 관점으로 다시 정리하면 같은 자산이 AI 답변에서도 인용됩니다."],
      bullets: ["SEO — 키워드 · 페이지 최적화 · 클릭", "GEO — 엔티티 · 출처 신뢰 · 인용"],
      facts: [["핵심 질문", "“AI에게 이 브랜드를 물으면 어떤 근거로 답하는가?”"]]
    },
    {
      id: "geo-check", cat: "geo", tone: "paper", kind: "list", ratio: 1.14,
      title: "GEO 진단 체크리스트",
      sub: "지금 우리 사이트는 AI에게 어떻게 보일까",
      kicker: "CHECK LIST",
      head: "AI가 인용하기 좋은 상태인지 점검하는 6가지",
      items: ["엔티티 일관성 — 이름·직함·소속 표기 통일", "전문 분야가 한 문장으로 설명되는가", "FAQ·사례 등 인용 가능한 문장 구조", "구조화 데이터(JSON-LD) 적용", "외부 채널 간 정보 불일치 여부", "주요 AI 답변 내 브랜드 언급 추적"],
      body: ["진단은 문서 한 장으로 끝나지 않습니다. 실제 AI에 질문해 답변을 캡처하고, 빠진 근거를 콘텐츠로 채우는 순환으로 운영합니다."],
      facts: [["진행", "1회 진단 워크숍 (3시간) 또는 2주 진단"]]
    },

    /* ── AI 교육 · 자동화 ── */
    {
      id: "edu-lecture", cat: "edu", tone: "ink", art: "lecture", ratio: 1.22,
      title: "기업 · 공공기관 AI 특강",
      sub: "현장 업무에 바로 붙는 실습형 강의",
      body: ["기업·공공기관·대학·교육기관에서 생성형 AI 실무 교육을 진행합니다. 기능 소개로 끝나지 않고, 참석자가 자기 업무 문서와 데이터로 직접 결과물을 만들어 봅니다.", "40~60대 비전공자 비중이 높은 현장에서도 따라올 수 있도록 난이도와 예시를 현장에 맞춰 조정합니다."],
      bullets: ["생성형 AI 리터러시 · 프롬프트 엔지니어링", "문서·보고서·기획·강의안 제작 자동화", "GPTs·AI 에이전트 실습", "공공기관 AI 거버넌스와 활용 윤리"],
      facts: [["누적 강의", "500회+"], ["누적 교육생", "2,000명+"], ["진행 형태", "특강 2~3시간 · 워크숍 1일 · 과정 4~8주"]]
    },
    {
      id: "edu-numbers", cat: "edu", tone: "gold", kind: "stat", ratio: 0.9,
      title: "숫자로 보는 교육 현장",
      sub: "500회의 강의, 2,000명의 교육생",
      kicker: "SINCE 2023",
      nums: [{ v: "500+", l: "누적 강의" }, { v: "2,000+", l: "누적 교육생" }],
      footnote: "공공기관 · 대학 · 기업 · 교원연수 · CEO 과정",
      body: ["강의 횟수보다 중요한 것은 교육 후 현장에 남는 변화입니다.", "한 번의 특강으로 끝나지 않도록, 과정안·실습 파일·복습 자료를 함께 남깁니다."],
      facts: [["주요 대상", "기업·공공기관 실무자, 교원·강사, 소상공인, 1인 전문가"]]
    },
    {
      id: "edu-agent", cat: "edu", tone: "navy", art: "flow", ratio: 1.34,
      title: "AI 에이전트 · 업무 자동화",
      sub: "반복 업무를 시스템으로 바꾸는 워크숍",
      body: ["Claude Code·Skills, CLI 기반 자동화, n8n, 맞춤형 GPTs를 조합해 실제 업무 흐름을 자동화합니다.", "도구 하나를 배우는 대신, 수집 → 처리 → 발행으로 이어지는 하나의 파이프라인을 직접 완성합니다."],
      bullets: ["자료 수집 → 요약 → 보고서 초안 자동 생성", "강의안·콘텐츠·SNS 발행 파이프라인", "사내 문서 기반 챗봇과 업무 매뉴얼 에이전트", "바이브코딩으로 만드는 업무용 웹앱"],
      facts: [["도구", "Claude Code · Skills · n8n · GPTs · Gems"], ["형태", "1일 워크숍 / 4주 실습 과정"]]
    },
    {
      id: "edu-venues", cat: "edu", tone: "paper", kind: "list", ratio: 1.18,
      title: "주요 출강 · 협업 기관",
      sub: "공공 · 대학 · 기업 현장에서",
      kicker: "VENUES",
      head: "현장에서 검증된 커리큘럼",
      items: ["공정거래위원회", "국민대학교 RISE", "안양대학교", "KINTEX", "국립세종도서관", "목포해양대학교", "숙명여대 미래교육원", "대한상공회의소 서울기술교육센터"],
      body: ["기관별 목적에 맞춰 커리큘럼을 새로 설계합니다. 실습 데이터는 해당 기관의 실제 업무 문서를 비식별화해 사용합니다."],
      facts: [["진행", "대면 · 온라인 · 하이브리드"]]
    },
    {
      id: "edu-quote", cat: "edu", tone: "sage", kind: "quote", ratio: 1.05,
      title: "구조를 가르칩니다",
      sub: "도구는 바뀌어도 사고는 남습니다",
      quote: "개별 도구가 아닌 구조적 사고와 워크플로우 시스템을 가르칩니다.",
      body: ["새로운 AI 도구는 매달 나옵니다. 그때마다 다시 배워야 한다면 교육이 아니라 소모입니다.", "목표·역할·맥락·절차·출력 형식을 설계하는 사고를 익히면, 어떤 도구가 나와도 같은 방식으로 적용할 수 있습니다."]
    },
    {
      id: "edu-trainer", cat: "edu", tone: "plum", art: "network", ratio: 1.2, seed: 2,
      title: "AI 강사 양성 과정",
      sub: "가르치는 사람을 길러냅니다",
      body: ["한국AI전문가교육협회(KAEA) 협회장으로서 AI 강사 양성 과정을 운영합니다. 교안 설계, 실습 구성, 질문 대응까지 강의의 전 과정을 훈련합니다.", "클로드AI연구회 교수진, 디지털융합교육원 부원장으로서 강사 커리큘럼을 함께 만들고 있습니다."],
      bullets: ["강의 설계 — 대상 분석과 학습 목표 설정", "교안·슬라이드·실습 파일 제작", "현장 운영과 질문 대응", "수료 후 활동 연계"],
      facts: [["소속", "한국AI전문가교육협회 협회장 · 디지털융합교육원 부원장"], ["대상", "AI 강사 지망생 · 현직 교원 · 교육 담당자"]]
    },
    {
      id: "edu-claude", cat: "edu", tone: "ink", art: "terminal", ratio: 1.06,
      title: "Claude Code · Skills 실습",
      sub: "CLI 기반 업무 자동화",
      body: ["터미널에서 문서를 만들고, 데이터를 정리하고, 반복 작업을 스킬로 묶습니다. 코딩 경험이 없어도 따라올 수 있도록 환경 설정부터 함께 합니다.", "『기업 AI자동화를 위한 클로드AI활용』, 『한 권으로 끝내는 AI 자동화』의 내용을 현장 실습으로 구성합니다."],
      bullets: ["환경 설정과 첫 실행", "업무별 스킬 설계", "문서·발표자료 자동 생성", "실패 지점과 안전장치 설계"],
      facts: [["교재", "『기업 AI자동화를 위한 클로드AI활용』(2026)"]]
    },
    {
      id: "edu-vibe", cat: "edu", tone: "gold", art: "grid", ratio: 1.26,
      title: "바이브코딩 · 노코드",
      sub: "비개발자가 만드는 업무용 웹앱",
      body: ["필요한 도구가 없으면 직접 만듭니다. AI에게 요구사항을 정확히 전달하고, 결과를 검증하며, 배포까지 가는 과정을 실습합니다.", "n8n 워크플로우와 노코드 도구를 함께 써서 유지보수 가능한 형태로 남깁니다."],
      bullets: ["요구사항을 프롬프트로 번역하기", "웹앱 · 랜딩페이지 제작", "GitHub Pages·Vercel 배포", "유지보수를 위한 문서화"],
      facts: [["산출물", "수강생 각자의 업무용 웹앱 1개"]]
    },
    {
      id: "edu-senior", cat: "edu", tone: "clay", kind: "list", ratio: 1.02,
      title: "비전공자 눈높이 교육",
      sub: "40~60대도 따라오는 실습 설계",
      kicker: "APPROACH",
      head: "어렵게 가르치지 않습니다",
      items: ["한 화면에 한 가지 동작만", "실습은 3분 단위로 끊기", "업무 문서를 그대로 예제로", "실패해도 되돌릴 수 있는 안전장치", "강의 후 복습 자료 제공"],
      body: ["유아교육 현장에서 시작한 교육 경험이 바탕입니다. 처음 배우는 사람이 어디서 멈추는지 알고, 그 지점을 미리 없애고 진행합니다."],
      facts: [["학력", "숙명여대 인적자원개발대학원 리더십교육전공 석사과정 수료"]]
    },

    /* ── 저서 · 출간 ── */
    {
      id: "book-claude", cat: "book", tone: "ink", kind: "book", ratio: 0.78,
      title: "『기업 AI자동화를 위한 클로드AI활용』",
      sub: "2026",
      series: "AI AUTOMATION",
      lines: ["기업 AI자동화를", "위한", "클로드AI활용"],
      pub: "2026",
      body: ["기업 현장의 반복 업무를 Claude로 자동화하는 방법을 정리했습니다. 문서 처리, 보고서 초안, 데이터 정리까지 실무 예제 중심으로 구성했습니다."],
      facts: [["출간", "2026"], ["분야", "AI 자동화 · 업무 효율화"]]
    },
    {
      id: "book-automation", cat: "book", tone: "sage", kind: "book", ratio: 0.78,
      title: "『한 권으로 끝내는 AI 자동화』",
      sub: "2026",
      series: "ONE BOOK",
      lines: ["한 권으로", "끝내는", "AI 자동화"],
      pub: "2026",
      body: ["AI 자동화의 전체 지도를 한 권에 담았습니다. 무엇부터 시작하고, 어디까지 맡기고, 무엇을 사람이 확인해야 하는지 순서대로 설명합니다."],
      facts: [["출간", "2026"], ["분야", "AI 자동화 입문·실전"]]
    },
    {
      id: "book-agent", cat: "book", tone: "navy", kind: "book", ratio: 0.78,
      title: "『AI Agent가 공무를 바꾼다』",
      sub: "두온교육 · 2026",
      series: "PUBLIC SECTOR",
      lines: ["AI Agent가", "공무를", "바꾼다"],
      pub: "두온교육 · 2026",
      body: ["공공기관 업무에 AI 에이전트를 도입하는 방법과 사례를 다룹니다. 개인정보·보안·책임 소재까지 공공의 맥락에서 정리했습니다."],
      facts: [["출간", "2026 · 두온교육"], ["분야", "공공행정 · AI 에이전트"]]
    },
    {
      id: "book-geo", cat: "book", tone: "clay", kind: "book", ratio: 0.78,
      title: "『이것이 GEO마케팅이다』",
      sub: "두온교육 · 2026",
      series: "GEO MARKETING",
      lines: ["이것이", "GEO", "마케팅이다"],
      pub: "두온교육 · 2026",
      body: ["GEO마케팅의 개념과 실행 방법을 처음부터 끝까지 다룬 실전서입니다. 엔티티 구축, 콘텐츠 구조화, AI 인용 검증을 단계별로 설명합니다."],
      facts: [["출간", "2026 · 두온교육"], ["분야", "GEO마케팅 · 콘텐츠 전략"]]
    },
    {
      id: "book-geo2", cat: "book", tone: "gold", kind: "book", ratio: 0.78,
      title: "『AI가 고객을 데려오는 시대 — GEO마케팅 완전정복』",
      sub: "미디어북 · 2026",
      series: "GEO COMPLETE",
      lines: ["AI가 고객을", "데려오는 시대", "GEO마케팅", "완전정복"],
      pub: "미디어북 · 2026",
      body: ["AI 검색 시대에 고객이 브랜드를 발견하는 경로가 어떻게 바뀌었는지, 그 흐름에 맞춰 무엇을 준비해야 하는지 정리했습니다."],
      facts: [["출간", "2026 · 미디어북"], ["분야", "GEO마케팅"]]
    },
    {
      id: "book-prompts", cat: "book", tone: "plum", kind: "book", ratio: 0.78,
      title: "『프롬프트를 만드는 프롬프트 GPTs & Gems』",
      sub: "성안당 · 2025",
      series: "PROMPT",
      lines: ["프롬프트를", "만드는", "프롬프트", "GPTs & Gems"],
      pub: "성안당 · 2025",
      body: ["프롬프트를 대신 만들어 주는 프롬프트, 그리고 GPTs·Gems로 반복 업무를 도구화하는 방법을 담았습니다."],
      facts: [["출간", "2025 · 성안당"], ["분야", "프롬프트 엔지니어링 · GPTs"]]
    },
    {
      id: "book-literacy", cat: "book", tone: "paper", kind: "book", ratio: 0.78,
      title: "『전 국민이 알아야 할 AI리터러시』",
      sub: "미디어북 · 2025",
      series: "AI LITERACY",
      lines: ["전 국민이", "알아야 할", "AI리터러시"],
      pub: "미디어북 · 2025",
      body: ["AI를 처음 접하는 사람이 알아야 할 기본 개념과 활용 태도를 정리했습니다. 교육 현장과 강의에서 나온 질문들이 뼈대가 되었습니다."],
      facts: [["출간", "2025 · 미디어북"], ["분야", "AI 리터러시 · 디지털 교육"]]
    },
    {
      id: "book-video", cat: "book", tone: "clay", kind: "book", ratio: 0.78,
      title: "『AI영상 비즈니스의 언어가 되다』",
      sub: "두온교육 · 2024",
      series: "AI VIDEO",
      lines: ["AI영상", "비즈니스의", "언어가 되다"],
      pub: "두온교육 · 2024",
      body: ["AI 영상 제작이 마케팅과 브랜딩의 언어로 자리 잡는 과정을 정리했습니다. 기획부터 제작, 활용까지의 흐름을 다룹니다."],
      facts: [["출간", "2024 · 두온교육"], ["분야", "AI 영상 · 콘텐츠"]]
    },
    {
      id: "book-cf", cat: "book", tone: "ink", kind: "book", ratio: 0.78,
      title: "『AI로 CF영상 제작비법』",
      sub: "두온교육 · 2024",
      series: "AI FILM",
      lines: ["AI로", "CF영상", "제작비법"],
      pub: "두온교육 · 2024",
      body: ["광고 영상(CF)을 AI로 기획하고 제작하는 실무 방법을 단계별로 설명합니다. 프롬프트부터 편집·합성까지 다룹니다."],
      facts: [["출간", "2024 · 두온교육"], ["분야", "AI 영상 제작"]]
    },
    {
      id: "book-total", cat: "book", tone: "gold", kind: "stat", ratio: 0.92,
      title: "저서 24권+",
      sub: "GEO마케팅부터 AI 리터러시까지",
      kicker: "PUBLICATIONS",
      nums: [{ v: "24+", l: "저서 · 공저" }],
      footnote: "두온교육 · 미디어북 · 성안당",
      body: ["강의 현장에서 나온 질문을 책으로 정리해 왔습니다. 『이것이 GEO마케팅이다』, 『AI Agent가 공무를 바꾼다』, 『프롬프트를 만드는 프롬프트』 등 24권 이상을 집필·공저했습니다."],
      facts: [["대표 저서", "GEO마케팅 2권 · AI 자동화 2권 · AI 리터러시 · AI 영상"]]
    },

    /* ── AI 아트 · 전시 ── */
    {
      id: "art-exhibition", cat: "art", tone: "sage", art: "canvas", ratio: 1.3, seed: 1,
      title: "캔버스 아트 전시 6회 주최",
      sub: "돈화문갤러리 · 성수 스페이스 큐",
      body: ["AI로 만든 이미지를 캔버스 위에 올려 전시로 완성합니다. 기획, 작품 선정, 디렉팅, 전시 운영까지 직접 맡습니다.", "2025년 1월 첫 전시 이후 2026년 3월까지 6회의 캔버스 아트 전시를 주최했습니다."],
      bullets: ["2026.03 ‘공존’ · 돈화문갤러리", "2025.08 ‘쉼의 온도’ · 돈화문갤러리", "2025.05 ‘사랑의 결’ · 돈화문갤러리", "2025.02 ‘봄과 생명’ · 돈화문갤러리", "2025.02 ‘치유’ · 성수 연리단길 스페이스 큐", "2025.01 ‘공감과 소통’ · 돈화문갤러리"],
      facts: [["역할", "기획 · 디렉팅 · 운영"], ["장소", "돈화문갤러리 외"]]
    },
    {
      id: "art-gongjon", cat: "art", tone: "plum", art: "canvas", ratio: 1.02, seed: 3,
      title: "‘공존’ — 2026.3",
      sub: "돈화문갤러리",
      body: ["가장 최근 전시 ‘공존’은 사람과 AI, 자연과 기술이 함께 있는 상태를 캔버스에 담았습니다.", "전시 기획부터 작품 디렉팅, 현장 운영까지 직접 진행했습니다."],
      facts: [["시기", "2026년 3월"], ["장소", "돈화문갤러리"], ["역할", "주최 · 전시 디렉팅"]]
    },
    {
      id: "art-shim", cat: "art", tone: "gold", art: "canvas", ratio: 1.18, seed: 2,
      title: "‘쉼의 온도’ — 2025.8",
      sub: "돈화문갤러리",
      body: ["AI 이미지에 온도라는 감각을 얹은 전시입니다. 차갑게만 여겨지던 생성 이미지에 사람의 호흡을 더하는 작업을 이어갔습니다."],
      facts: [["시기", "2025년 8월"], ["장소", "돈화문갤러리"]]
    },
    {
      id: "art-direct", cat: "art", tone: "paper", kind: "list", ratio: 1.22,
      title: "AI 아트 · 전시 디렉팅",
      sub: "기획에서 현장까지",
      kicker: "DIRECTING",
      head: "전시를 하나의 작품으로 만듭니다",
      items: ["전시 기획 · 주제 설정", "작품 생성과 선별", "캔버스 출력 · 설치", "관람 동선과 라벨링", "개막 운영과 기록"],
      body: ["AI 아트는 이미지 생성에서 끝나지 않습니다. 무엇을 보여주고 어떤 순서로 경험하게 할지가 전시의 완성도를 결정합니다."],
      facts: [["경력", "캔버스 아트 전시 6회 주최 (2025~2026)"]]
    },
    {
      id: "art-jury", cat: "art", tone: "navy", art: "medal", ratio: 1.12,
      title: "AI 영화제 · 공모전 심사",
      sub: "국내 AI 창작의 기준을 봅니다",
      body: ["AI로 만든 영상과 콘텐츠를 심사하며 현장의 기준을 함께 만들어 왔습니다.", "심사 기준은 기술의 화려함보다 기획의 의도와 완성도, 그리고 관객에게 닿는 힘입니다."],
      bullets: ["2025 SIAFF 서울국제AI영화제 심사", "2025 농림수산부 ‘AGRI TED U’ 공모전 심사", "2024 통일부 프롬프톤 대회 심사"],
      facts: [["역할", "심사위원"]]
    },

    /* ── 수상 · 자격 ── */
    {
      id: "aw-teacher", cat: "award", tone: "gold", art: "medal", ratio: 1.04,
      title: "2025 생성형AI강사대상",
      sub: "AI기술강의부문",
      body: ["생성형 AI 강의 분야에서 활동을 인정받아 AI기술강의부문 대상을 수상했습니다.", "현장에서 쌓은 강의 기록과 교육생 피드백이 바탕이 되었습니다."],
      facts: [["수상", "2025"], ["부문", "AI기술강의부문"]]
    },
    {
      id: "aw-kacf", cat: "award", tone: "ink", art: "medal", ratio: 1.08,
      title: "2025 KACF 대한민국인공지능영화제",
      sub: "스페셜상",
      body: ["KACF 대한민국인공지능영화제에서 스페셜상을 수상했습니다.", "AI 영상 제작과 전시, 교육을 하나의 흐름으로 이어 온 작업이 평가받았습니다."],
      facts: [["수상", "2025"], ["부문", "스페셜상"]]
    },
    {
      id: "aw-hanam", cat: "award", tone: "clay", art: "medal", ratio: 1.0,
      title: "2024 하남 AI 뮤직 무비 영화제",
      sub: "AI아트 부문 국회의원 최우수상",
      body: ["하남 AI 뮤직 무비 영화제 AI아트 부문에서 국회의원 최우수상을 수상했습니다."],
      facts: [["수상", "2024"], ["부문", "AI아트 · 국회의원 최우수상"]]
    },
    {
      id: "aw-2023", cat: "award", tone: "sage", kind: "list", ratio: 1.14,
      title: "2023 수상 기록",
      sub: "강사경진대회 대상 · 아시아리더대상",
      kicker: "2023",
      head: "두 개의 대상",
      items: ["인공지능콘텐츠 강사경진대회 대상", "아시아리더대상 — 아시아미래산업기술 발전부문"],
      body: ["AI 콘텐츠 강의 역량과 산업 기술 발전 기여를 함께 인정받은 해입니다."],
      facts: [["수상", "2023 · 2건"]]
    },
    {
      id: "aw-cert", cat: "award", tone: "paper", kind: "list", ratio: 1.2,
      title: "국제 공인 자격",
      sub: "Anthropic · Google · Gemini",
      kicker: "CERTIFIED",
      head: "직접 이수하고 가르치는 자격",
      items: ["Anthropic Claude 101", "Google Certified Educator", "Gemini Certified Educator", "Prompt Engineer", "AI리터러시강사", "인공지능콘텐츠 강사 1급", "GEO마케팅컨설턴트"],
      body: ["자격은 시작점일 뿐이지만, 가르치는 도구는 직접 써 보고 가르칩니다."],
      facts: [["인증", "Anthropic · Google for Education · 민간 자격"]]
    }
  ];

  /* ───────────── 렌더 ───────────── */
  const grid = document.getElementById("grid");
  const pinCount = document.getElementById("pinCount");
  const filterBar = document.querySelector(".filters");

  function pinHTML(c) {
    const isSvg = !!c.art;
    const isBook = c.kind === "book";
    const ratio = isBook ? 0.76 : c.ratio || 1.2;
    const visualBox =
      isSvg || isBook
        ? `<div class="pin__visual" style="aspect-ratio:${ratio}">${visual(c, "pin")}</div>`
        : `<div class="pin__visual pin__visual--auto">${visual(c, "pin")}</div>`;
    return `<article class="pin" role="button" tabindex="0" data-id="${c.id}" data-cat="${c.cat}" aria-haspopup="dialog"
        aria-label="${c.title} — ${c.sub}" style="animation-delay:${Math.random() * 0.18}s">
      ${visualBox}
      <div class="pin__body">
        <span class="pin__cat">${CAT_LABEL[c.cat]}</span>
        <strong class="pin__title">${c.title}</strong>
        <span class="pin__sub">${c.sub}</span>
        <span class="pin__more">자세히 보기</span>
      </div>
    </article>`;
  }

  function renderGrid() {
    grid.innerHTML = CARDS.map(pinHTML).join("");
  }

  /* 도서 선반 */
  const shelf = document.getElementById("shelf");
  const shelfBooks = CARDS.filter((c) => c.cat === "book" && c.kind === "book");
  function renderShelf() {
    shelf.innerHTML = shelfBooks
      .map(
        (c) => `<div class="shelf-item" title="${c.title}">${posterBook(c, c.tone)}</div>`
      )
      .join("");
  }

  /* ───────────── 필터 ───────────── */
  let currentFilter = "all";

  function applyFilter(f, scroll) {
    currentFilter = f;
    document.querySelectorAll(".filters .chip").forEach((b) => {
      const on = b.dataset.filter === f;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    let shown = 0;
    grid.querySelectorAll(".pin").forEach((pin) => {
      const match = f === "all" || pin.dataset.cat === f;
      pin.classList.toggle("is-hidden", !match);
      if (match) shown++;
    });
    pinCount.textContent = `${shown}개의 핀 · ${f === "all" ? "전체" : CAT_LABEL[f]}`;
    if (scroll) {
      document.getElementById("portfolio").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (btn) applyFilter(btn.dataset.filter);
  });

  document.querySelectorAll("[data-filter-jump]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilter(a.dataset.filterJump, true);
    });
  });

  /* ───────────── 모달 ───────────── */
  const modal = document.getElementById("modal");
  const mVisual = document.getElementById("modalVisual");
  const mCat = document.getElementById("modalCat");
  const mTitle = document.getElementById("modalTitle");
  const mSub = document.getElementById("modalSub");
  const mContent = document.getElementById("modalContent");
  const mAsk = document.getElementById("modalAsk");
  const mLink = document.getElementById("modalLink");
  let lastFocus = null;
  let activeCard = null;

  function openModal(card) {
    activeCard = card;
    lastFocus = document.activeElement;
    mVisual.innerHTML = visual(card, "modal");
    mCat.textContent = CAT_LABEL[card.cat];
    mTitle.textContent = card.title;
    mSub.textContent = card.sub;

    let html = "";
    (card.body || []).forEach((p) => (html += `<p>${p}</p>`));
    if (card.bullets && card.bullets.length) {
      html += `<ul>${card.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`;
    }
    if (card.facts && card.facts.length) {
      html += `<dl class="modal__facts">${card.facts
        .map((f) => `<div><dt>${f[0]}</dt><dd>${f[1]}</dd></div>`)
        .join("")}</dl>`;
    }
    mContent.innerHTML = html;

    if (card.link) {
      mLink.hidden = false;
      mLink.href = card.link.url;
      mLink.textContent = card.link.label || "자세히 보기";
    } else {
      mLink.hidden = true;
      mLink.removeAttribute("href");
    }

    mAsk.textContent = ASK_LABEL[card.cat] || "이 분야로 문의하기";
    modal.hidden = false;
    document.body.classList.add("is-locked");
    modal.querySelector(".modal__panel").scrollTop = 0;
    setTimeout(() => modal.querySelector(".modal__close").focus(), 30);
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("is-locked");
    mVisual.innerHTML = "";
    if (lastFocus) lastFocus.focus();
  }

  grid.addEventListener("click", (e) => {
    const pin = e.target.closest(".pin");
    if (!pin) return;
    const card = CARDS.find((c) => c.id === pin.dataset.id);
    if (card) openModal(card);
  });

  grid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const pin = e.target.closest(".pin");
    if (!pin) return;
    e.preventDefault();
    const card = CARDS.find((c) => c.id === pin.dataset.id);
    if (card) openModal(card);
  });

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!modal.hidden) closeModal();
      closeNav();
    }
    if (e.key === "Tab" && !modal.hidden) {
      const focusables = modal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  mAsk.addEventListener("click", () => {
    const card = activeCard;
    closeModal();
    if (!card) return;
    const type = ASK_DEFAULT[card.cat] || "기업·공공기관 AI 특강";
    const radio = document.querySelector(`input[name="type"][value="${type}"]`);
    if (radio) radio.checked = true;
    const msg = document.getElementById("f-message");
    if (msg && !msg.value.trim()) {
      msg.value = `[${card.title}] 관련 문의드립니다.`;
    }
    document.getElementById("contact").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => document.getElementById("f-name").focus({ preventScroll: true }), 600);
  });

  /* ───────────── 헤더 · 모바일 메뉴 ───────────── */
  const header = document.getElementById("siteHeader");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("primaryNav");

  function onScroll() {
    header.classList.toggle("is-stuck", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeNav() {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "메뉴 열기");
  }

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  });

  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeNav();
  });

  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    if (!e.target.closest("#primaryNav") && !e.target.closest("#burger")) closeNav();
  });

  /* 스크롤 스파이 */
  const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]')).filter(
    (a) => !a.classList.contains("nav__cta")
  );
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          navLinks.forEach((a) =>
            a.classList.toggle("is-current", a.getAttribute("href") === "#" + en.target.id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));

    /* 등장 애니메이션 */
    const revealTargets = document.querySelectorAll(
      ".section__head, .card, .venues, .books__grid, .awards__grid, .contact__intro, .inquiry"
    );
    revealTargets.forEach((el) => el.classList.add("reveal"));
    const rev = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            rev.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealTargets.forEach((el) => rev.observe(el));
  }

  /* ───────────── 문의 폼 ───────────── */
  const form = document.getElementById("inquiryForm");
  const statusEl = document.getElementById("formStatus");
  const donePanel = document.getElementById("donePanel");
  const donePreview = document.getElementById("donePreview");
  const mailtoAgain = document.getElementById("mailtoAgain");
  const MAIL = "info@aiclab2020.com";

  function currentType() {
    const r = form.querySelector('input[name="type"]:checked');
    return r ? r.value : "기업·공공기관 AI 특강";
  }

  function buildMessage() {
    const val = (id) => (document.getElementById(id).value || "").trim();
    const name = val("f-name");
    const org = val("f-org");
    const contact = val("f-contact");
    const when = val("f-when");
    const msg = val("f-message");
    const lines = [
      "[문의 유형] " + currentType(),
      "[성함] " + (name || "-"),
      "[소속/기관] " + (org || "-"),
      "[연락처] " + (contact || "-"),
      "[희망 일정] " + (when || "-"),
      "",
      "[문의 내용]",
      msg || "-",
      "",
      "— 김진수 · AICLab 소개 페이지에서 보냄"
    ];
    return {
      subject: `[강의·컨설팅 문의] ${currentType()} — ${name || "성함 미기재"}`,
      body: lines.join("\n")
    };
  }

  function mailtoHref(m) {
    return `mailto:${MAIL}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`;
  }

  function setError(field, on) {
    const wrap = field.closest(".field");
    if (!wrap) return;
    wrap.classList.toggle("has-error", on);
    field.setAttribute("aria-invalid", on ? "true" : "false");
  }

  function validate() {
    let ok = true;
    ["f-name", "f-contact", "f-message"].forEach((id) => {
      const el = document.getElementById(id);
      const bad = !el.value.trim();
      setError(el, bad);
      if (bad) ok = false;
    });
    if (!ok) {
      const firstBad = form.querySelector(".field.has-error input, .field.has-error textarea");
      if (firstBad) firstBad.focus();
      statusEl.textContent = "성함·연락처·문의 내용을 입력해 주세요.";
    }
    return ok;
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      /* fallthrough */
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (err) {
      return false;
    }
  }

  function showDone(m) {
    donePreview.textContent = `받는 사람: ${MAIL}\n제목: ${m.subject}\n\n${m.body}`;
    mailtoAgain.href = mailtoHref(m);
    donePanel.hidden = false;
  }

  form.addEventListener("input", (e) => {
    if (e.target.matches("input, textarea")) setError(e.target, false);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;
    const m = buildMessage();
    showDone(m);
    statusEl.textContent = "메일 앱을 엽니다… 열리지 않으면 아래 내용을 복사해 보내 주세요.";
    window.location.href = mailtoHref(m);
    setTimeout(() => {
      statusEl.textContent = "메일 앱이 열리지 않으면 아래 ‘내용 복사’를 눌러 주세요.";
    }, 1500);
  });

  document.getElementById("copyBtn").addEventListener("click", async () => {
    if (!validate()) return;
    const m = buildMessage();
    const ok = await copyText(`받는 사람: ${MAIL}\n제목: ${m.subject}\n\n${m.body}`);
    statusEl.textContent = ok
      ? "문의 내용을 복사했습니다. 메일이나 메신저에 붙여넣어 보내 주세요."
      : "복사가 차단되었습니다. 아래 미리보기 내용을 직접 선택해 복사해 주세요.";
    showDone(m);
  });

  document.getElementById("copyAgain").addEventListener("click", async () => {
    const ok = await copyText(donePreview.textContent);
    statusEl.textContent = ok ? "복사했습니다." : "복사가 차단되었습니다. 미리보기에서 직접 선택해 주세요.";
  });

  /* ───────────── 초기화 ───────────── */
  document.getElementById("year").textContent = new Date().getFullYear();
  renderGrid();
  renderShelf();
  applyFilter("all");
})();
