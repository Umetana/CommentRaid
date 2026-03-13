// boss_title.js
// ボス称号テーブル（V1.0+）
// 「二つ名（属性）」＋「役職」を合成

window.BOSS_EPITHETS = [
  "雷鳴の",
  "嵐の",
  "炎獄の",
  "深淵の",
  "冥界の",
  "虚無の",
  "終焉の",
  "星喰いの",
  "破滅の"
];

window.BOSS_ROLES = [
  "支配者",
  "暴君",
  "覇王",
  "魔王",
  "大魔王",
  "終焉王",
  "放浪者" // ← ネタ枠。循環では出にくい
];

// レベルに応じて合成（循環）
// 例：Lv1 森の魔王 / Lv2 闇の覇王 … のように規則的になる
window.pickBossTitle = function (level) {
  const e = window.BOSS_EPITHETS || [];
  const r = window.BOSS_ROLES || [];
  if (!e.length && !r.length) return "魔王";
  if (!e.length) return r[(Math.max(0, (level | 0) - 1)) % r.length];
  if (!r.length) return e[(Math.max(0, (level | 0) - 1)) % e.length] + "魔王";

  const i = Math.max(0, (level | 0) - 1);
  const epithet = e[i % e.length];
  const role = r[(i * 3) % r.length]; // ずらして被りにくく
  return `${epithet}${role}`;
};

// ランダム
window.pickBossTitleRandom = function () {
  const e = window.BOSS_EPITHETS || [];
  const r = window.BOSS_ROLES || [];
  const epithet = e.length ? e[Math.floor(Math.random() * e.length)] : "";
  const role = r.length ? r[Math.floor(Math.random() * r.length)] : "魔王";
  return `${epithet}${role}`;
};