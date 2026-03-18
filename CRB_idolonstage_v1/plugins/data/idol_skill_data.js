// idol_skill_data.js v1.0.0
// 配信者スキル（バフ）定義
window.IDOL_SKILL = [
  {
    command: "!hypetime",
    name: "HYPE TIME",
    multiplier: 2.0,
    duration: 30000,   // バフ効果時間 (ms)
    limit: 3,          // 1枠での最大使用回数
    cooldown: 60000    // 再使用までの待機時間 (ms)
  },
  {
    command: "!encore",
    name: "Encore",
    multiplier: 3.0,
    duration: 15000,
    limit: 1,
    cooldown: 120000
  }
];
