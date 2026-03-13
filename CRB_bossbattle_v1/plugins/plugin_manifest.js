/**
 * Raid Battle Rule Pack Manifest
 */
window.RULE_MANIFEST = {
  // スクリプト（読み込み順序が重要なものは上に書く）
  scripts: [
    "./plugins/data/boss_title.js",
    "./plugins/data/attack_table.js",
    "./plugins/data/boss_skill_data.js",
    "./plugins/raid_config.js",
    "./plugins/boss_skill.js",
    "./plugins/combat_plugin.js",
    "./plugins/invincible_plugin.js"
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
