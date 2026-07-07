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

共通: [`styles.css`](styles.css)（デザイントークン・全ページ共通スタイル）、
[`site.js`](site.js)（控えめなモーション：スクロール表示・ヒーロー演出・ピン演出。`prefers-reduced-motion` 対応）、
[`assets/`](assets/)（ロゴ・アイコン・スマホモック）。

> 拡張子なしURL（`/privacy` 等）のため、各ページは「フォルダ + index.html」で配置しています。
> `styles.css` / `site.js` はキャッシュ更新用に `?v=N` を付けて参照しています（更新時は番号を上げる）。

## 連絡先

- 一般サポート / アカウント削除: `support@ourpins.app`
- プライバシー / 法務: `legal@ourpins.app`
- パートナー・掲載相談: `hello@ourpins.app`

## パートナー募集フォーム

GitHub Pages は静的ホスティングのため、HTMLだけではメール送信できません。
`partners/index.html` と `partners/en/index.html` の `data-endpoint` にフォーム受信サービスのPOST URLを設定してください。

初期運用では Formspree / Basin / Getform などで `hello@ourpins.app` 宛てに通知するのが最短です。
長期運用では Cloudflare Worker + Resend / Postmark で `partners@ourpins.app` の専用窓口に送る構成が管理しやすいです。

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

- 法務ページ（privacy / terms）は構成・可読性重視の骨子です。正式な条文は差し替え前提。
- ストアバッジは商標に配慮したオリジナルの「近日公開（Coming soon）」表記。
- アプリのスクショは、各画面を切り出した透過 PNG（`assets/phone-*.png`）を使用。
