// boss_skill.js v1.1.0 - Logic Only Edition
(function () {
  if (!window.ENGINE) return;

  // ボススキルの使用状況管理
  let skillState = {};

  const BossSkillPlugin = {
    name: "BossSkillPlugin",

    onResetBoss() {
      skillState = {}; // スキル使用回数をリセット
    },

    onInit() {
      if (!window.BOSS_SKILL) {
        console.warn("[RaidPlugin] BOSS_SKILL data is not loaded. BossSkill plugin idle.");
      }
    },

    onProcessAttack(ctx, state, cfg) {
      if (!ctx.commentData.isOwner || !window.BOSS_SKILL) return;

      const skill = window.BOSS_SKILL.find(s => s.command && ctx.commentData.text.includes(s.command));
      if (!skill) return;

      const sState = skillState[skill.command] || { count: 0, lastUsed: 0 };
      const canUse = (sState.count < (skill.limit ?? Infinity)) &&
        (ctx.now - sState.lastUsed >= (skill.cooldown ?? 0));

      if (canUse) {
        sState.count++;
        sState.lastUsed = ctx.now;
        skillState[skill.command] = sState;

        const healAmount = Math.floor(state.maxHp * Math.abs(skill.power ?? 0) / 100);
        state.hp = Math.min(state.maxHp, state.hp + healAmount);

        ctx.events.push({
          type: "heal",
          motion: "center_float",
          text: skill.name,
          color: { r: 100, g: 255, b: 100 }, // 回復用の緑色を明示
          amount: healAmount,
          count: sState.count,
          limit: skill.limit,
          log: `${ctx.commentData.user}：スキル『${skill.name}』！ +${healAmount} HP (${sState.count}/${skill.limit ?? '∞'})`
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
      ctx.terminated = true; // ボスアクション時は通常攻撃を行わない
    }
  };

  window.ENGINE.use(BossSkillPlugin);
  console.log("[RaidPlugin] BossSkill registered.");
})();
