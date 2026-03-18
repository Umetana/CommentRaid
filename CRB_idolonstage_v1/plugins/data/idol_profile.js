// idol_profile.js
// アイドル称号テーブル（V1.0+）
// 「二つ名」＋「役職」を合成

window.IDOL_EPITHETS = [
  "駆け出しの",
  "注目の",
  "話題の",
  "人気の",
  "輝く",
  "夢見る",
  "笑顔の",
  "奇跡の",
  "伝説の"
];

window.IDOL_ROLES = [
  "アイドル",
  "シンガー",
  "ダンサー",
  "パフォーマー",
  "エンターテイナー",
  "スター",
  "スーパーアイドル"
];

// レベルに応じて合成（循環）
window.pickIdolTitle = function (level) {
  const e = window.IDOL_EPITHETS || [];
  const r = window.IDOL_ROLES || [];
  if (!e.length && !r.length) return "アイドル";
  if (!e.length) return r[(Math.max(0, (level | 0) - 1)) % r.length];
  if (!r.length) return e[(Math.max(0, (level | 0) - 1)) % e.length] + "アイドル";

  const i = Math.max(0, (level | 0) - 1);
  const epithet = e[i % e.length];
  const role = r[(i * 3) % r.length]; // ずらして被りにくく
  return `${epithet}${role}`;
};

// ランダム
window.pickIdolTitleRandom = function () {
  const e = window.IDOL_EPITHETS || [];
  const r = window.IDOL_ROLES || [];
  const epithet = e.length ? e[Math.floor(Math.random() * e.length)] : "";
  const role = r.length ? r[Math.floor(Math.random() * r.length)] : "アイドル";
  return `${epithet}${role}`;
};