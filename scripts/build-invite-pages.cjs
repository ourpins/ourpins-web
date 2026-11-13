// Static, crawler-readable invitations. No group/member data is published.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const copy = {
  ja: ['グループへの招待｜OurPins', '友達と「行きたい」を集めよう。', '気になる場所を同じ地図に。アプリでグループを確認して参加できます。', 'アプリで開く', 'まだアプリを入れていない方', 'インストール後、この招待リンクをもう一度開いてください。', '招待コード', 'リンクが開かないときは、アプリの「招待リンクから参加」にこのコードを入力してください。', 'LINE内で開けない場合は、メニューからSafariやChromeで開いてください。', '招待リンクを確認してください', '招待コードが見つかりません。送ってくれた友達にリンクを確認してください。', 'このページをスマートフォンで開くか、アプリに招待コードを入力してください。', 'OurPins ホーム', '「行きたい」を、友達と。'],
  en: ['You’re invited to OurPins', 'Save places. Discover your friends’ favourites.', 'Keep places on the same map. Open the app to review and join the group.', 'Open in app', 'Don’t have the app yet?', 'After installing, open this invitation link again.', 'Invitation code', 'If the link doesn’t open, enter this code in “Join from an invite link” in the app.', 'If LINE cannot open the app, use its menu to open this page in Safari or Chrome.', 'Check your invitation link', 'No valid invitation code was found. Ask your friend to check the link.', 'Open this page on your smartphone, or enter the invitation code in the app.', 'OurPins home', 'Good places. Better together.'],
  'zh-Hans': ['OurPins 群组邀请', '和朋友一起收藏想去的地方。', '把心动的地方收藏到同一张地图。打开应用，查看并加入群组。', '打开应用', '还没有安装应用？', '安装后，请再次打开此邀请链接。', '邀请码', '如果链接无法打开，请在应用的“通过邀请链接加入”中输入此码。', '如果在 LINE 内无法打开应用，请通过菜单在 Safari 或 Chrome 中打开此页面。', '请检查邀请链接', '未找到有效的邀请码。请联系发来邀请的朋友确认链接。', '请在手机上打开此页面，或在应用中输入邀请码。', 'OurPins 首页', '和朋友，收藏想去的地方。'],
  'zh-Hant': ['OurPins 群組邀請', '和朋友一起收藏想去的地方。', '把心動的地方收藏到同一張地圖。開啟應用程式，查看並加入群組。', '開啟應用程式', '還沒安裝應用程式？', '安裝後，請再次開啟此邀請連結。', '邀請碼', '如果連結無法開啟，請在應用程式的「透過邀請連結加入」輸入此代碼。', '如果在 LINE 內無法開啟應用程式，請透過選單在 Safari 或 Chrome 中開啟此頁面。', '請檢查邀請連結', '找不到有效的邀請碼。請聯絡發來邀請的朋友確認連結。', '請在手機上開啟此頁面，或在應用程式中輸入邀請碼。', 'OurPins 首頁', '和朋友，收藏想去的地方。'],
  ko: ['OurPins 그룹 초대', '친구와 가고 싶은 곳을 모아 보세요.', '마음에 드는 장소를 같은 지도에 저장하세요. 앱에서 그룹을 확인하고 참여할 수 있어요.', '앱에서 열기', '아직 앱이 없나요?', '설치한 뒤 이 초대 링크를 다시 열어 주세요.', '초대 코드', '링크가 열리지 않으면 앱의 ‘초대 링크로 참여’에 이 코드를 입력해 주세요.', 'LINE에서 앱이 열리지 않으면 메뉴에서 Safari 또는 Chrome으로 이 페이지를 열어 주세요.', '초대 링크를 확인해 주세요', '유효한 초대 코드를 찾을 수 없어요. 초대를 보낸 친구에게 링크를 확인해 주세요.', '스마트폰에서 이 페이지를 열거나 앱에 초대 코드를 입력해 주세요.', 'OurPins 홈', '친구와 함께, 가고 싶은 곳.'],
};
const escape = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ui = {
  ja: ['グループへの招待', '準備中', 'リンクが開かないとき', 'プライバシー', 'App Storeで入手'],
  en: ['A map to share with friends', 'Coming soon', 'Having trouble opening the link?', 'Privacy', 'Download on the App Store'],
  'zh-Hans': ['朋友的群组邀请', '即将推出', '无法打开链接？', '隐私政策', '在 App Store 下载'],
  'zh-Hant': ['朋友的群組邀請', '即將推出', '無法開啟連結？', '隱私權政策', '在 App Store 下載'],
  ko: ['친구와 함께하는 지도', '준비 중', '링크가 열리지 않나요?', '개인정보 처리방침', 'App Store에서 다운로드'],
};
for (const [locale, c] of Object.entries(copy)) {
  const u = ui[locale];
  const home = locale === 'en' ? '/en/' : '/';
  const dir = path.join(root, 'invite', ...(locale === 'ja' ? [] : [locale]));
  fs.mkdirSync(dir, {recursive:true});
  const image = `https://ourpins.app/assets/invite-card-${locale}-v1.png`;
  const html = `<!doctype html>
<html lang="${locale}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(c[0])}</title><meta name="description" content="${escape(c[2])}">
<meta name="robots" content="noindex"><meta name="referrer" content="no-referrer">
<meta property="og:type" content="website"><meta property="og:site_name" content="OurPins">
<meta property="og:title" content="${escape(c[0])}"><meta property="og:description" content="${escape(c[2])}">
<meta property="og:image" content="${image}"><meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escape(c[13])}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${image}"><meta name="twitter:image:alt" content="${escape(c[13])}">
<meta name="theme-color" content="#fff9e9"><link rel="icon" href="/assets/pins_icon_transparent.png">
<link rel="stylesheet" href="/styles.css?v=9"><link rel="stylesheet" href="/guide-pages.css?v=2">
<link rel="stylesheet" href="/invite/invite-v1.css?v=2"><script src="/invite/invite-v1.js" defer></script>
</head><body class="guide-page invite-page">
<header class="site-header"><div class="container nav"><a class="nav__logo" href="${home}" aria-label="${escape(c[12])}"><img src="/assets/OurPins_transparent.png" alt="OurPins" width="150" height="36"></a><a class="invite-home" href="${home}">${escape(c[12])}<span aria-hidden="true">↗</span></a></div></header>
<main class="invite-main"><div class="container invite-layout">
<div class="invite-intro"><p class="brand-label">${escape(u[0])}</p>
<div class="map-ticket invite-art" aria-hidden="true"><div class="ticket-icon"><svg viewBox="0 0 64 64" fill="none"><path d="M32 57S13 39 13 24a19 19 0 0 1 38 0c0 15-19 33-19 33Z" fill="#f4685f" stroke="#262b38" stroke-width="2.5"/><circle cx="32" cy="24" r="7" fill="#fffdfa" stroke="#262b38" stroke-width="2.5"/></svg></div><i class="ticket-pin"></i></div>
<h1 id="invite-title">${locale === 'ja' ? '友達と、<br><strong>「行きたい」</strong><br>を集めよう。' : escape(c[1])}</h1><p id="invite-description">${escape(c[2])}</p></div>
<section class="invite-panel" aria-label="${escape(u[0])}">
<div id="invite-valid" hidden><a class="brand-button primary" id="invite-open" href="/">${escape(c[3])}<b aria-hidden="true">↗</b></a>
<p class="muted" id="invite-desktop" hidden>${escape(c[11])}</p>
<div class="invite-code-box"><p class="code-label">${escape(c[6])}</p><strong id="invite-code" class="code"></strong></div>
<details class="invite-help"><summary>${escape(u[2])}</summary><p class="muted">${escape(c[7])}</p><p class="muted" id="invite-line" hidden>${escape(c[8])}</p></details></div>
<div id="invite-invalid" hidden role="status" data-title="${escape(c[9])}" data-description="${escape(c[10])}"><a class="text-link" href="${home}">${escape(c[12])}</a></div>
<noscript><p>${escape(c[11])}</p></noscript>
<div class="install"><h2>${escape(c[4])}</h2><div class="stores"><a class="store-apple" href="https://apps.apple.com/app/id6824908742" aria-label="${escape(u[4])}">App Store<span aria-hidden="true">↗</span></a><span class="store-soon" aria-disabled="true">Google Play<small>${escape(u[1])}</small></span></div><p class="muted">${escape(c[5])}</p></div>
</section></div></main><footer class="invite-footer container"><a href="/privacy/">${escape(u[3])}</a><span>© OurPins</span></footer></body></html>
`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}
fs.writeFileSync(path.join(root, 'scripts', 'invite-card-copy.json'), JSON.stringify(Object.fromEntries(Object.entries(copy).map(([key,value])=>[key,value[13]])),null,2)+'\n');
console.log('Built 5 static invitation pages. og:url/canonical intentionally omitted to preserve the incoming code query.');
