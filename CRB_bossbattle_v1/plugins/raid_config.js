/**
 * Raid Logic Plugin Configuration
 * ボスのHP、名前、難易度プリセットなどのレイドバトル専用設定
 */
window.CONFIG_RAID = {
  BOSS_NAME: "配信者X",          // 任意入力（将来メタデータで上書き想定）
  BOSS_TITLE_MODE: "random",   // "byLevel" | "random" | "fixed"
  BOSS_TITLE_FIXED: "魔王",     // BOSS_TITLE_MODE="fixed" の時だけ使用
  NEXT_BOSS_INTERVAL_MS: 6000,  // 撃破→次ボスまでの間（演出用）

  // === CommentRaid: Balance (V1.0) ===
  BASE_HP: 100,               // Lv1の初期HP
  HP_PER_LEVEL: 500,           // レベルごとの追加HP
  GUARD_CHANCE: 0.10,          // ガード発生率 (0.00 - 1.00)
  GUARD_REDUCTION: 0.5,        // ガード時のダメージ軽減率 (0.5 = 50%軽減)

  // === CommentRaid: Presets ===
  PRESETS: {
    normal: {
      BASE_HP: 1000,
      HP_PER_LEVEL: 500,
      GUARD_CHANCE: 0.10,
    },
    hard: {
      BASE_HP: 3000,
      HP_PER_LEVEL: 1500,
      GUARD_CHANCE: 0.25,
    },
    nightmare: {
      BASE_HP: 10000,
      HP_PER_LEVEL: 5000,
      GUARD_CHANCE: 0.50,
    },
    impossible: {
      BASE_HP: 99999,
      HP_PER_LEVEL: 10000,
      GUARD_CHANCE: 0.80,
    }
  },

  DIFFICULTY: "custom",        // "normal" | "hard" | "nightmare" | "impossible" | "custom"

  // === CommentRaid: Effects & UI ===
  FLASH_DURATION: 0.25,         // 秒（画面フラッシュ）
  USE_STAMP: true,              // スタンプ演出を表示するか
  STAMP_START_URL: "./assets/stamp_start.png",   // 開始スタンプの画像パス
  STAMP_DEFEAT_URL: "./assets/stamp_defeat.png", // 撃破スタンプの画像パス

  // === CommentRaid Log (V1.0) ===
  LOG_FORMAT: "battle_1line",  // "name_comment" | "battle_1line"
  MAX_LOG_CHARS: 32,           // 長文は末尾…で省略（1行固定）
  MAX_LOG_LINES: 9,            // 表示行数（240px前後に収まる目安）
  LOG_SCROLL_SPEED: 90,        // px/sec（スクロール速度）
  LOG_SHOW_EMOJI: true,        // ログに絵文字を表示するか
  LOG_USE_USER_COLOR: false,    // ログにユーザー色を反映するか（通常コメ）
  LOG_USE_GIFT_COLOR: true,     // ログにギフト・スパチャ色を反映するか
};

// --- レイド専用設定の自動適用ロジック ---
(function applyRaidDifficulty() {
  const cfg = window.CONFIG_RAID;
  const mode = cfg.DIFFICULTY;

  if (mode !== "custom" && cfg.PRESETS[mode]) {
    const selectedPreset = cfg.PRESETS[mode];
    Object.keys(selectedPreset).forEach(key => {
      cfg[key] = selectedPreset[key];
    });
    console.log(`[RaidConfig] Applied difficulty: ${mode}`);
  }
})();
