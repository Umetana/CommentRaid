# CommentRaid - Idol On Stage v1.0.1 Technical Spec

本文書は `CRB_idolonstage_v1` プラグインの内部設計、データ構造、および CommentRaid - Base のフック利用方法について解説します。

## 🪐 設計思想

本プラグインは、Baseエンジンの「HP/ダメージ」モデルを「ボルテージ/応援」モデルに外部から再定義することを目的としています。
コアシステムを変更せず、プラグイン層だけでゲーム性を反転させています。

## 🛠 コンポーネント構成

### 1. 進行管理: `idol_logic.js` (IdolLogicPlugin)
- **State:** `state.level`, `state.voltage`, `state.maxVoltage` を管理。
- **Hooks:**
    - `onInit`: `localStorage` からの進行状況復元、難易度プリセットの初期化。
    - `onResetBoss`: レベルアップ時の最大ボルテージ再計算（指数関数的に増加）。
    - `afterCalculateDamage`: `ctx.cheer` を `state.voltage` に加算。レベルアップ判定と待機状態の管理。
- **Persistence:** `comment_idol_level` / `comment_idol_voltage` キーで進捗を保存。

### 2. 数値計算: `cheer_plugin.js` (CheerPlugin)
- **Cheer Calculation:** 5〜20の乱数にアクション倍率（`cheer_table.js`）を乗算。
- **Hooks:**
    - `onProcessAttack`: アクションの選択（コマンド優先、なければランダム）。
    - `onCalculateDamage`: ギフト・スパチャ倍率の適用、および配信者スキルのバフ効果（`state.cheerMultiplier`）を適用。

### 3. バフシステム: `idol_skill.js` / `idol_skill_data.js`
- **Streamer Skills:** 配信者がコマンドを入力した際に、期間限定で応援力をブーストする仕組み。
- **Data Structure:**
    ```js
    {
      command: "!hypetime",
      name: "HYPE TIME",
      multiplier: 2.0,   // 応援力2倍
      duration: 30000,   // 30秒
      limit: 3,          // 回数制限
      cooldown: 60000    // クールダウン
    }
    ```
- **Execution:** `ctx.terminated = true` を設定することで、スキル発動時は通常のダメージ計算をスキップします。

### 4. 演出拡張: `idol_fx.js`
- **Heart FX:** Baseの `FX.push` をラップ（オーバーライド）し、`motion: "heart"` 時に大量のハートを生成。
- **Compatibility:** Baseエンジンの `motion: "float"` パーティクルに変換して渡すことで、描画ロジックの再実装を避けています。

## 📊 データ管理 (`data/` & `plugins/data/`)

### 集約管理の意図
ユーザーが触る可能性のある「基本設定」は `data/` に、プラグイン作者やパワーユーザーが触る「定義ファイル」は `plugins/data/` に分離しています。

- `data/config.js`: エンジン全体のプラグインロード設定。
- `data/idol_config.js`: `window.CONFIG_IDOL`。エンジンの `CONFIG_RAID` との互換性ブリッジもここで定義。
- `plugins/data/cheer_table.js`: `window.CHEER_TABLE`。
- `plugins/data/idol_profile.js`: `window.pickIdolTitle(level)` 関数を定義。
- `plugins/data/idol_skill_data.js`: `window.IDOL_SKILL`。

## 🎨 UI/UX 実装

- **Triangle Gauge:** `clip-path: polygon(0 100%, 100% 100%, 100% 0)` を使用。
- **Triangle Log:** 背景にグラデーションを適用。
- **Responsive:** 基本サイズ 1920x1080 を想定。

## 🔧 開発者向けアドバイス

- **互換性:** エンジン側の `ctx.dmg` を `cheerValue` にフォールバックさせるなど、他のプラグインとの共存を考慮しています。
- **デバッグ:** `config.js` の `DEBUG: true` で、コンソールに出力されるフック情報を確認できます。

---
Created by V-Creator Tools - Umetana
