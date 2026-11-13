# OurPins Web

共同マップアプリ **OurPins** の公式サイト（LP ＋ 法務・サポートページ）です。
GitHub Pages でホスティングし、カスタムドメイン `ourpins.app` で公開します。
デザインは Claude Design で作成し、本リポジトリに実装しています。

すべてのページを `ourpins.app` 配下に集約しています（旧 `legal.ourpins.app` は廃止予定）。

## ページ構成

| パス | ファイル | 内容 |
| --- | --- | --- |
| `/` | [`index.html`](index.html) | ランディングページ |
| `/privacy` | [`privacy/index.html`](privacy/index.html) | プライバシーポリシー |
| `/terms` | [`terms/index.html`](terms/index.html) | 利用規約 |
| `/contact` | [`contact/index.html`](contact/index.html) | お問い合わせ |
| `/delete-account` | [`delete-account/index.html`](delete-account/index.html) | アカウント削除の案内 |
| `/community-guidelines` | [`community-guidelines/index.html`](community-guidelines/index.html) | コミュニティガイドライン |
| `/partners` | [`partners/index.html`](partners/index.html) | パートナー・掲載相談 |
| （404） | [`404.html`](404.html) | Not Found |
| `/invite/?code=…` | [`invite/index.html`](invite/index.html) | 画像付きのグループ招待。en/zh-Hans/zh-Hant/ko配下にも静的ページ |

共通: [`styles.css`](styles.css)（デザイントークン・全ページ共通スタイル）、
[`site.js`](site.js)（控えめなモーション：スクロール表示・ヒーロー演出・ピン演出。`prefers-reduced-motion` 対応）、
[`assets/`](assets/)（ロゴ・アイコン・スマホモック）。

> 拡張子なしURL（`/privacy` 等）のため、各ページは「フォルダ + index.html」で配置しています。
> `styles.css` / `site.js` はキャッシュ更新用に `?v=N` を付けて参照しています（更新時は番号を上げる）。

## 連絡先

- 一般サポート / アカウント削除: `support@ourpins.app`
- プライバシー / 法務: `legal@ourpins.app`
- パートナー・掲載相談: `hello@ourpins.app`

## パートナーの受付

店舗・地域パートナーの相談は日英の募集ページから `hello@ourpins.app` 宛てのメールで受け付けます。

## ローカルで確認する

```bash
python -m http.server 8000
# http://localhost:8000 を開く
```

## GitHub Pages / 独自ドメイン

- リポジトリ: `ourpins/ourpins-web`、Pages は `main / root`。
- `CNAME` で apex ドメイン `ourpins.app` を指定。
- Cloudflare DNS（CNAME フラット化）:

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `@`（`ourpins.app`） | `ourpins.github.io` | DNS only（グレー雲） |
| CNAME | `www` | `ourpins.github.io` | DNS only（グレー雲） |

DNS 反映後、**Settings → Pages → Enforce HTTPS** をオンにします。

## メモ

- 新しい招待ページはHTTP 200で共通の1200×630画像をクローラーへ返す。グループ/メンバー情報は公開しない。クエリの招待コードはブラウザー内だけで扱い、参加はアプリで確認する。コードを失うcanonical/og:urlを設定しない。
- `/invite/`は旧アプリのUniversal Link対象`/join/*`と分け、ボタンから旧アプリも理解できる`ourpins://join/CODE`を開く。自動ストア転送は行わない。既存の`/join/CODE`と`/p/...`は404ページの既存導線を維持する。
- 招待ページ再生成: `node scripts/build-invite-pages.cjs`。画像再生成（Windows）: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-invite-card.ps1`。検証: `node --test tests/invite.test.mjs`。実際のLINEプレビュー表示はLINE側のキャッシュ/設定にも依存し、実機確認が必要。
- 招待ページは共通の `styles.css` / `guide-pages.css` の紙色・ドット・地図チケット・輪郭線を使う。共有カード画像はページ上の大きなヒーローとして使わず、OG情報として保持する。Google Playは5言語の「準備中」をリンクなしで表示し、従来の招待/場所共有ページも同じ配信状況へ揃える。

- 法務ページ（privacy / terms）は構成・可読性重視の骨子です。正式な条文は差し替え前提。
- 日英のトップページは配信情報を `#download` にまとめています。
- トップページのレイアウトは `landing.css`。地図・一覧・訪問投稿の画像（`assets/screen-*.webp`）は現行アプリのWebプレビューをデモデータで撮影しています。
