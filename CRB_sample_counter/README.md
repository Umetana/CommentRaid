# CommentRaid - Sample Counter

`CRB_sample_counter` は `CommentRaid Base v1.1.0` 向けの最小サンプルプラグインです。  
コメント数をカウントし、一定件数ごとに簡単な演出イベントを出します。

## 前提

- `comment_raid_base_v1/` が同じ階層にあること
- わんコメのカスタムテンプレートとして本フォルダを読み込むこと
- 推奨表示サイズ: 1920x1080

本テンプレートは `index.html` から `../comment_raid_base_v1/js/core/*` を参照します。  
そのため、`CRB_sample_counter` 単体ではなく Base とセットで配置してください。

## 導入手順

1. `comment_raid_base_v1/` と `CRB_sample_counter/` を同じ階層に配置します。
2. わんコメで `CRB_sample_counter/index.html` をテンプレートとして指定します。
3. 必要に応じて `config.js` と `plugins/sample_counter_config.js` を調整します。
4. OBS で表示している場合は、変更後にブラウザソースのキャッシュを更新します。

## 主な機能

- コメント件数のカウント
- UI への現在件数表示
- しきい値到達時の簡易イベント発火
- manifest を使った UI / CSS / 設定ファイルのロード例

## 主要設定

### `config.js`

- `PLUGINS`
  - 既定値は `./plugins/sample_counter_logic.js`
- `HIDE_DEFAULT_COMMENTS`
  - 既定コメント表示の ON/OFF
- `MAX_ACTIVE`, `FONT_SIZE`, `FX_INTENSITY`
  - ベース側演出パラメータ

### `plugins/sample_counter_config.js`

- `TITLE`
  - UI に表示するタイトル
- `THRESHOLD`
  - 何コメントごとにイベントを出すか

既定では 5 コメントごとに `count_milestone` イベントを発火し、`"5 comments!"` のようなテキストを表示します。

## 読み込み構成

`sample_counter_logic.js` がエントリープラグインです。  
追加資産は `plugins/plugin_manifest.js` から次の順で読み込まれます。

1. `plugins/sample_counter_config.js`
2. `plugins/style.css`
3. `plugins/ui.html`

## フォルダ構成

```text
CRB_sample_counter/
├── index.html
├── config.js
├── style.css
├── plugins/
│   ├── sample_counter_logic.js
│   ├── sample_counter_config.js
│   ├── plugin_manifest.js
│   ├── style.css
│   └── ui.html
└── template.json
```

## ライセンスについて

- このフォルダはコード中心のサンプルです
- リポジトリ全体のライセンス注意は親フォルダの `README.md` を参照してください

## 補足

- プラグインの最小サンプルとして使えます
- 新規プラグインの作り始めは、この構成を複製して調整するのが簡単です
- 開発者向け仕様は `comment_raid_base_v1/README.md` を参照してください
