// attack_table.js v1.0.1仕様
window.ATTACK_TABLE = [
  // 物理系
  { name: "Slash", power: 1.0, command: "!slash" },
  { name: "Pierce", power: 1.1, command: "!pierce" },
  { name: "Smash", power: 1.2, command: "!smash" },

  // 属性系（汎用）
  { name: "Fire", power: 1.1, command: "!fire" },
  { name: "Ice", power: 0.9, command: "!ice" },
  { name: "Thunder", power: 1.0, command: "!thunder" },
  { name: "Wind", power: 1.2, command: "!wind" },
  { name: "Earth", power: 1.0, command: "!earth" },

  // 特殊攻撃
  { name: "Poison Strike", power: 0.8, command: "!poison" },
  { name: "Shadow Blade", power: 1.3, command: "!shadow" },
  { name: "Holy Ray", power: 1.3, command: "!holy" },

  // 大技（演出映え）
  { name: "Meteor", power: 1.5, command: "!meteor" },
  { name: "Dragon Roar", power: 1.6, command: "!dragon" },
  { name: "Dark Nova", power: 1.4, command: "!dark" }
];