# CommentRaid - BossBattle v1.1.0

`CRB_bossbattle_v1` は `CommentRaid Base v1.1.0` 向けのボスバトル用プラグインです。  
コメントを攻撃として扱い、ボスHP、レベル進行、ガード、撃破演出をまとめて提供します。

## 前提

- `comment_raid_base_v1/` が同じ階層にあること
- わんコメのカスタムテンプレートとして本フォルダを読み込むこと
- 推奨表示サイズ: 1920x1080

本テンプレートは `index.html` から `../comment_raid_base_v1/js/core/*` を参照します。  
そのため、`CRB_bossbattle_v1` 単体ではなく Base とセットで配置してください。

## 導入手順

1. `comment_raid_base_v1/` と `CRB_bossbattle_v1/` を同じ階層に配置します。
2. わんコメで `CRB_bossbattle_v1/index.html` をテンプレートとして指定します。
3. 必要に応じて `config.js` と `plugins/raid_config.js` を調整します。
4. OBS で表示している場合は、変更後にブラウザソースのキャッシュを更新します。

## 主な機能

- コメントを攻撃として処理
- ボスHPとレベルの管理
- 難易度プリセット切り替え
- ガード、スキル、無敵演出などの追加ロジック
- UI / CSS / 追加スクリプトを manifest で動的ロード

## 主要設定

### `config.js`

- `PLUGINS`
  - 既定値は `./plugins/raid_logic.js`
- `HIDE_DEFAULT_COMMENTS`
  - 既定コメント表示の ON/OFF
- `SAVE_PROGRESS`
  - `true` でレベルとHPを保存
- `RESET_PROGRESS`
  - `true` にして再読み込みすると保存進行をリセット
- `LOG_CENTER_OFFSET`, `LOG_PADDING_LEFT`
  - ログ表示位置の微調整

### `plugins/raid_config.js`

- `BOSS_NAME`
  - UI に表示するボス名
- `BOSS_TITLE_MODE`
  - `"byLevel"` / `"random"` / `"fixed"`
- `BOSS_TITLE_FIXED`
  - 固定称号を使う場合の表示名
- `NEXT_BOSS_INTERVAL_MS`
  - 撃破後に次ボスへ切り替わるまでの待機時間
- `DIFFICULTY`
  - `"normal"` / `"hard"` / `"nightmare"` / `"impossible"` / `"custom"`
- `BASE_HP`, `HP_PER_LEVEL`, `GUARD_CHANCE`, `GUARD_REDUCTION`
  - `custom` 運用時の基礎バランス
- `STAMP_START_URL`, `STAMP_DEFEAT_URL`
  - 開始 / 撃破スタンプ画像
- `LOG_FORMAT`, `MAX_LOG_LINES` など
  - バトルログ表示の調整

`DIFFICULTY` を `custom` 以外にすると、`PRESETS` の値が自動適用されます。

## 読み込み構成

`raid_logic.js` がエントリープラグインです。  
追加資産は `plugins/plugin_manifest.js` から次の順で読み込まれます。

1. `plugins/data/boss_title.js`
2. `plugins/data/attack_table.js`
3. `plugins/data/boss_skill_data.js`
4. `plugins/raid_config.js`
5. `plugins/boss_skill.js`
6. `plugins/combat_plugin.js`
7. `plugins/invincible_plugin.js`
8. `plugins/style.css`
9. `plugins/ui.html`

## フォルダ構成

```text
CRB_bossbattle_v1/
├── index.html
├── config.js
├── style.css
├── assets/
├── plugins/
│   ├── raid_logic.js
│   ├── raid_config.js
│   ├── combat_plugin.js
│   ├── boss_skill.js
│   ├── invincible_plugin.js
│   ├── plugin_manifest.js
│   ├── style.css
│   ├── ui.html
│   └── data/
│       ├── attack_table.js
│       ├── boss_skill_data.js
│       └── boss_title.js
└── template.json
```

## ライセンスについて

- このフォルダ内のコードは MIT ライセンス対象として扱えます
- `assets/` 内の PNG / MP4 などのアセットは MIT ライセンスではありません
- 再利用や再配布を行う場合は、コードとアセットを分けて扱ってください

## 補足

- OBSに追加したindex.htmlにフィルタでクロマキーを追加しないと動画がグリーンバックのままになります。
- 進行保存は `localStorage` を利用します
- Base 側コアは直接編集せず、プラグイン側で拡張する前提です
- 開発者向け仕様は `comment_raid_base_v1/README.md` を参照してください
