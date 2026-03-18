// idol_skill.js v1.1.0 - Logic Only Edition
(function () {
  if (!window.ENGINE) return;

  // スキルの使用状況管理
  let skillState = {};

  const IdolSkillPlugin = {
    name: "IdolSkillPlugin",

    onResetBoss() {
      skillState = {}; // スキル使用回数をリセット
    },

    onInit() {
      if (!window.IDOL_SKILL) {
        console.warn("[IdolPlugin] IDOL_SKILL data is not loaded. IdolSkill plugin idle.");
      }
    },

    onProcessAttack(ctx, state, cfg) {
      if (!ctx.commentData.isOwner || !window.IDOL_SKILL) return;

      const skill = window.IDOL_SKILL.find(s => s.command && ctx.commentData.text.includes(s.command));
      if (!skill) return;

      const sState = skillState[skill.command] || { count: 0, lastUsed: 0 };
      const canUse = (sState.count < (skill.limit ?? Infinity)) &&
        (ctx.now - sState.lastUsed >= (skill.cooldown ?? 0));

      if (canUse) {
        sState.count++;
        sState.lastUsed = ctx.now;
        skillState[skill.command] = sState;

        // バフ効果の適用
        state.cheerMultiplier = skill.multiplier ?? 1.0;
        state.buffUntil = ctx.now + (skill.duration ?? 30000);

        ctx.events.push({
          type: "heal",       // エンジンの内蔵アニメを利用
          motion: "center_float",
          text: skill.name,
          color: { r: 255, g: 150, b: 200 }, // ピンク
          amount: 0,
          count: sState.count,
          limit: skill.limit,
          log: `${ctx.commentData.user}：スキル『${skill.name}』！ 応援力 x${skill.multiplier} (${sState.count}/${skill.limit ?? '∞'})`
        });
      } else {
        const reason = (sState.count >= (skill.limit ?? Infinity)) ? "回数切れ" : "連発制限中";
        ctx.events.push({
          type: "skill_fail",
          name: skill.name,
          reason: reason,
          log: `${ctx.commentData.user}：スキル『${skill.name}』失敗！ (${reason})`
        });
      }
      ctx.isBossAction = true;
      ctx.terminated = true; // 配信者アクション時は通常応援を行わない
    }
  };

  window.ENGINE.use(IdolSkillPlugin);
  console.log("[IdolPlugin] IdolSkill registered.");
})();
