window.CONFIG = {
  // === CommentRaid: Base Config ===
  // 導入したい「ルールパック」のメインプラグインを記述します
  PLUGINS: [
    "./plugins/raid_logic.js"
    //"./sample_plugins/simple_counter_plugin.js"
  ],

  HIDE_DEFAULT_COMMENTS: true, // trueで表示を消す
  MAX_ACTIVE: 30,
  FONT_SIZE: 36,
  FX_INTENSITY: 1.0,         // 演出強度倍率
  USE_USER_COLOR: true,      // ユーザーカラーを反映するか (falseで通常コメは白)
  SAVE_PROGRESS: false,       // 進行状況（Lv）を保存し、次回起動時に再開するか
  RESET_PROGRESS: true,      // trueにして保存・リロードすると進捗をリセットします
  DEBUG: false,

  // Window Config
  // ログウインドウ水平位置調整
  LOG_CENTER_OFFSET: -38, //% デフォルト-50(中央)
  LOG_PADDING_LEFT: 10,    // px ログの左余白（フレーム合わせ用）

};

// CSS変数制御
document.documentElement.style.setProperty(
  "--show-comments",
  CONFIG.HIDE_DEFAULT_COMMENTS ? "none" : "block"
);
