/**
 * Raid Battle Rule Pack Manifest
 */
window.RULE_MANIFEST = {
  // スクリプト（読み込み順序が重要なものは上に書く）
  scripts: [
    "./plugins/data/idol_profile.js",
    "./plugins/data/cheer_table.js",
    "./plugins/data/idol_skill_data.js",
    "./data/idol_config.js",
    "./plugins/idol_fx.js",
    "./plugins/idol_skill.js",
    "./plugins/cheer_plugin.js"
  ],

  // デザイン（CSS）
  styles: [
    "./plugins/style.css"
  ],

  // ユーザーインターフェース（HTML断片）
  ui: [
    "./plugins/ui.html"
  ]
};
