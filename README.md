# OurPins Web

共同マップアプリ **OurPins** のランディングページ（公式サイト）です。GitHub Pages でホスティングし、カスタムドメイン `ourpins.app` で公開します。

ポリシー類は別サイト [`ourpins-legal`](https://github.com/ourpins/ourpins-legal)（`legal.ourpins.app`）に置き、同じデザイン言語でつながるようにしています。

## ページ・ファイル

| ファイル | 内容 |
| --- | --- |
| [`index.html`](index.html) | ランディングページ（ヒーロー / 機能 / 使い方 / CTA） |
| [`styles.css`](styles.css) | スタイル（OurPins-legal と共通のデザイントークン） |
| [`assets/`](assets/) | アプリアイコン・ファビコン |
| `CNAME` | カスタムドメイン（`ourpins.app`）の指定 |

## ローカルで確認する

ビルド不要の静的サイトです。

```bash
python -m http.server 8000
# http://localhost:8000 を開く
```

## GitHub Pages での公開手順

1. GitHub の `ourpins` org にリポジトリ `ourpins-web` を用意する。
2. このディレクトリを push する。
3. リポジトリの **Settings → Pages** を開く。
4. **Build and deployment → Source** を「Deploy from a branch」にする。
5. Branch を `main`（フォルダは `/root`）に設定して保存する。

## カスタムドメイン（ourpins.app）

`CNAME` ファイルで apex ドメイン `ourpins.app` を指定しています。apex（サブドメインなし）は CNAME ではなく **A / AAAA レコード**で GitHub Pages の IP を指す必要があります。

DNS 管理画面で次を設定してください。

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

> `www.ourpins.app` も使う場合は、別途 `CNAME www → ourpins.github.io` を追加します。
> 最新の GitHub Pages の IP は公式ドキュメントで確認してください。

### Cloudflare を使う場合（推奨）

Cloudflare は **CNAME フラット化**に対応しているため、apex でも A/AAAA を並べる代わりに次の 1 レコードで済みます。

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `@` (`ourpins.app`) | `ourpins.github.io` | DNS only（グレー雲） |

- GitHub が証明書を発行できるよう、**最初は「DNS only（グレー雲）」**にしておきます。
- 反映後、GitHub の **Settings → Pages → Enforce HTTPS** をオンにします。
- HTTPS 証明書の発行が完了したら、必要に応じて Proxy（オレンジ雲）を有効にし、SSL/TLS を **Full** にします。
- `legal.ourpins.app` と同様の設定です（あちらは `CNAME legal → ourpins.github.io`）。

DNS 反映後、**Settings → Pages → Enforce HTTPS** をオンにします。公開 URL は `https://ourpins.app/` です。

> `.nojekyll` を置いているため、Jekyll の処理をスキップしてファイルをそのまま配信します。

## デザインについて

- ブランドカラーは Rausch `#ff385c`、白基調・ソフトな角丸という OurPins のデザインシステム（`OurPins/DESIGN.md`）に準拠。
- ヘッダー / フッター / カードのトーンを `OurPins-legal` と揃え、両サイトが「同じサイト」として感じられるようにしています。
- アプリのスクリーンショットは、アプリ完成後に `#screens` セクションへ差し込みます（現在は Coming soon プレースホルダ）。
