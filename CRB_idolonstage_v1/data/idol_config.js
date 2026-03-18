/**
 * Idol Logic Plugin Configuration
 * ボルテージ、名前、難易度プリセットなどの専用設定
 */
window.CONFIG_IDOL = {
  IDOL_NAME: "配信者",          // 任意入力
  IDOL_TITLE_MODE: "random",   // "byLevel" | "random" | "fixed"
  IDOL_TITLE_FIXED: "アイドル",     // IDOL_TITLE_MODE="fixed" の時だけ使用
  NEXT_STAGE_INTERVAL_MS: 6000,  // レベルアップ→次ステージまでの間（演出用）

  // === CommentIdol: Balance (V1.0) ===
  BASE_VOLTAGE: 500,               // Lv1の初期目標ボルテージ
  VOLTAGE_PER_LEVEL: 500,           // レベルごとの基本追加ボルテージ
  VOLTAGE_GROWTH_RATE: 1.2,         // 成長係数 (1.0で等倍、1.2で20%ずつ増加量アップ)

  // === CommentIdol: Presets ===
  PRESETS: {
    normal: {
      BASE_VOLTAGE: 1000,
      VOLTAGE_PER_LEVEL: 500
    },
    hard: {
      BASE_VOLTAGE: 3000,
      VOLTAGE_PER_LEVEL: 1500
    },
    nightmare: {
      BASE_VOLTAGE: 10000,
      VOLTAGE_PER_LEVEL: 5000
    },
    impossible: {
      BASE_VOLTAGE: 99999,
      VOLTAGE_PER_LEVEL: 10000
    }
  },

  DIFFICULTY: "custom",        // "normal" | "hard" | "nightmare" | "impossible" | "custom"

  // === CommentIdol: Effects & UI ===
  FLASH_DURATION: 0.25,         // 秒（画面フラッシュ）
  USE_STAMP: true,              // スタンプ演出を表示するか
  STAMP_START_URL: "./assets/stamp_start.png",   // 開始スタンプの画像パス
  STAMP_DEFEAT_URL: "./assets/stamp_clear.png", // レベルアップスタンプの画像パス (エンジン互換のため名称維持)
  CHEER_EMOJI: "♥",            // 応援時に浮き上がる絵文字 (💓, ✨, 💀 など)
  CHEER_EMOJI_COLOR: { r: 255, g: 100, b: 180 }, // 絵文字の色 (記号などの場合に反映)
  CHEER_EMOJI_COUNT: 5,         // 通常コメント時の最大出現数 (1〜設定値の間でランダム)
  CHEER_EMOJI_GIFT_COUNT: 15,   // ギフト・スパチャ時の最大出現数
  MAX_ACTIVE_EFFECTS: 64,       // 画面内に同時に表示できるエフェクトの最大数

  // === Comment Log (V1.0) ===
  LOG_FORMAT: "battle_1line",  // "name_comment" | "battle_1line"
  MAX_LOG_CHARS: 32,           // 長文は末尾…で省略（1行固定）
  MAX_LOG_LINES: 8,            // 表示行数（240px前後に収まる目安）
  LOG_SCROLL_SPEED: 90,        // px/sec（スクロール速度）
  LOG_SHOW_EMOJI: true,        // ログに絵文字を表示するか
  LOG_USE_USER_COLOR: false,    // ログにユーザー色を反映するか（通常コメ）
  LOG_USE_GIFT_COLOR: true,     // ログにギフト・スパチャ色を反映するか
};

// --- 専用設定の自動適用ロジック ---
(function applyIdolDifficulty() {
  const cfg = window.CONFIG_IDOL;
  const mode = cfg.DIFFICULTY;

  if (mode !== "custom" && cfg.PRESETS[mode]) {
    const selectedPreset = cfg.PRESETS[mode];
    Object.keys(selectedPreset).forEach(key => {
      cfg[key] = selectedPreset[key];
    });
    console.log(`[IdolConfig] Applied difficulty: ${mode}`);
  }

  // --- Engine compatibility bridge ---
  window.CONFIG_RAID = window.CONFIG_IDOL;
})();
