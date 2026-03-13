# Comment Raid Base v1.1.0

Comment Raid Base v1.1.0 は、わんコメ向けリアルタイム演出を **Core** と **Rule Pack (Plugin)** に分離した開発基盤です。  
本ドキュメントは「現在の実装」に合わせて、plugin author が `ctx / hook / manifest` を理解しやすい形で整理しています。

## 1. 目的

- Core を変更せずに、ルールやUIをプラグイン側で差し替える
- プラグインは hook で処理を差し込み、`state` と `ctx.events` で動作を構成する
- UI/CSS/追加JS は manifest で宣言して動的ロードする

## 2. 最小構成

```text
comment_raid_base_v1/
├── index.html
├── config.js
├── style.css
├── js/
│   ├── core/
│   │   ├── engine.js
│   │   ├── script.js
│   │   └── fx.js
│   └── plugins/
│       ├── _starter_kit/
│       │   ├── starter_logic.js
│       │   ├── starter_config.js
│       │   ├── plugin_manifest.js
│       │   ├── ui.html
│       │   └── style.css
│       ├── sample_counter/
│       │   ├── sample_counter_logic.js
│       │   ├── sample_counter_config.js
│       │   ├── plugin_manifest.js
│       │   ├── ui.html
│       │   └── style.css
│       └── raid_battle/
│           └── ...
```

## 3. プラグイン有効化

`config.js` の `window.CONFIG.PLUGINS` に、エントリープラグイン（通常は `*_logic.js`）を設定します。

```js
window.CONFIG = {
  PLUGINS: [
    "./js/plugins/raid_battle/raid_logic.js"
  ]
};
```

## 4. plugin author 向け要点

- hook 実行順: `onInit` -> `onUpdate`(毎フレーム) -> コメントごとに `beforeComment` -> `onProcessAttack` -> `onCalculateDamage` -> `afterCalculateDamage` -> `afterComment`
- コメント処理用 `ctx` 主要フィールド: `commentData`, `events`, `dmg`, `attack`, `terminated`, `isBossAction`, `now`
- `ctx.events` に event を push すると `script.js` 経由で `FX.push()` に渡される
- `state` は全プラグイン共有。UI同期は `state.ui.status` を利用可能

詳細は以下を参照:
- `BASE_DEVELOPMENT_GUIDE.md`
- `BASE_TECHNICAL_SPEC.md`

`sample_counter` は Raid 非依存の最小サンプルです。  
`_starter_kit` が拡張用テンプレートであるのに対し、`sample_counter` は最小完成例として参照できます。

## 5. Manifest 運用方針

本 Base では、プラグインの追加資産は manifest ベースで管理します。

- 標準構成（`js/plugins/<plugin_name>/`）でも `plugin_manifest.js` で管理する
- **標準ディレクトリから外れる構成にする場合は、manifest で自己管理すること**
  - 例: `data/`, `assets/`, `ui/` を別階層に置く
  - 例: 複数JS/CSS/HTMLを段階的に読み込む
- Core はパス解決を自動補正しないため、manifest のパスは実際に読み込める相対/絶対指定にする

## 6. 実装上の注意

- 推奨表示サイズ: 1920x1080
- 変更後は OBS 側でキャッシュ更新を行う
- Base の JS (`js/core/*`) は変更せず、プラグイン側で拡張する

## 7. 更新履歴

- v1.1.0 (2026-03-12)
  - 動的 UI/CSS/Script ロード（manifest 方式）を正式化
  - plugin author 向けに責務分離を強化
