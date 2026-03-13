// boss_skill_data.js v1.0.0
window.BOSS_SKILL = [
  {
    command: "!heal",
    name: "自己修復",
    power: -5.0,
    limit: 3,          // 1戦闘での最大使用回数
    cooldown: 30000    // 再使用までの待機時間 (ms)
  },
  {
    command: "!greater-heal",
    name: "真・完全回復",
    power: -20.0,
    limit: 1,
    cooldown: 60000
  }
];
