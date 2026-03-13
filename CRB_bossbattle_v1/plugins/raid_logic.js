/**
 * Raid Logic Plugin v1.0.0
 * Handles Boss HP, Levels, Cooldowns, and Persistence.
 */
(function () {
  if (!window.ENGINE) return;

  let inCooldown = false;
  let cooldownUntil = 0;
  let bossTitle = "魔王";

  const RaidLogicPlugin = {
    name: "RaidLogic",
    // すべての構成パーツ（Logic, Config, UI, Style）は manifest で一括管理します
    manifest: "./plugins/plugin_manifest.js",

    onInit(ctx, state, cfg) {
      const c = window.CONFIG_RAID || {};
      const difficulty = (c.DIFFICULTY || "normal").toLowerCase();
      const preset = c.PRESETS?.[difficulty] || {};

      // 1. Config merge (Raid specific)
      cfg.BASE_HP = Number(c.BASE_HP ?? preset.BASE_HP ?? 100);
      cfg.HP_PER_LEVEL = Number(c.HP_PER_LEVEL ?? preset.HP_PER_LEVEL ?? 500);
      cfg.GUARD_CHANCE = Number(c.GUARD_CHANCE ?? preset.GUARD_CHANCE ?? 0.1);
      cfg.GUARD_REDUCTION = Number(c.GUARD_REDUCTION ?? preset.GUARD_REDUCTION ?? 0.5);

      if (!cfg.BASE_HP || isNaN(cfg.BASE_HP)) cfg.BASE_HP = 1000;
      if (isNaN(cfg.HP_PER_LEVEL)) cfg.HP_PER_LEVEL = 500;
      if (isNaN(cfg.GUARD_CHANCE)) cfg.GUARD_CHANCE = 0.1;
      if (isNaN(cfg.GUARD_REDUCTION)) cfg.GUARD_REDUCTION = 0.5;

      // 2. State init
      state.level = 1;
      let savedHp = null;

      const baseCfg = window.CONFIG || {};
      if (baseCfg.RESET_PROGRESS === true) {
        localStorage.removeItem("comment_raid_level");
        localStorage.removeItem("comment_raid_hp");
      } else if (baseCfg.SAVE_PROGRESS !== false) {
        const savedLevel = localStorage.getItem("comment_raid_level");
        if (savedLevel) state.level = parseInt(savedLevel, 10) || 1;
        
        const savedHpRaw = localStorage.getItem("comment_raid_hp");
        if (savedHpRaw !== null) savedHp = parseFloat(savedHpRaw);
      }

      this.onResetBoss(ctx, state, cfg);
    },

    onResetBoss(ctx, state, cfg) {
      bossTitle = this.decideBossTitle(state.level);
      state.maxHp = cfg.BASE_HP + (state.level - 1) * cfg.HP_PER_LEVEL;
      state.hp = state.maxHp;

      // --- Generic UI Interface ---
      state.ui = state.ui || {};
      state.ui.status = {
        label: `Lv${state.level} ${bossTitle}：${window.CONFIG_RAID?.BOSS_NAME || "配信者"}`,
        progress: 1.0,
        text: `HP ${Math.floor(state.hp)} / ${Math.floor(state.maxHp)}`,
        color: null // Optional theme color
      };
    },

    decideBossTitle(level) {
      const c = window.CONFIG_RAID || {};
      const mode = c.BOSS_TITLE_MODE || "byLevel";
      if (mode === "fixed") return c.BOSS_TITLE_FIXED || "魔王";
      if (mode === "random" && typeof window.pickBossTitleRandom === "function") return window.pickBossTitleRandom(level);
      if (typeof window.pickBossTitle === "function") return window.pickBossTitle(level);
      return "魔王";
    },

    onUpdate(ctx, state, cfg) {
      if (inCooldown) {
        if (ctx.now >= cooldownUntil) {
          inCooldown = false;
          state.level++;
          // 直接更新
          this.onResetBoss(ctx, state, cfg);
          this.saveState(state);
        }
      }
    },

    beforeComment(ctx, state, cfg) {
      if (inCooldown) ctx.terminated = true;
    },

    afterCalculateDamage(ctx, state, cfg) {
      // ダメージの適用
      if (ctx.dmg > 0 && !ctx.isBossAction) {
        state.hp -= ctx.dmg;

        const defeat = state.hp <= 0;
        if (defeat) state.hp = 0;

        // UI情報の更新
        state.ui.status.progress = state.hp / state.maxHp;
        state.ui.status.text = `HP ${Math.floor(state.hp)} / ${Math.floor(state.maxHp)}`;

        const event = {
          type: "hit",
          motion: "pop",
          dmg: ctx.dmg,
          attack: ctx.attack?.name || "Attack",
          boostType: ctx.boostType
        };

        // --- Log formatting (Plugin side) ---
        const name = ctx.commentData?.user || "Anonymous";
        if (defeat) {
          event.log = `${name}の攻撃！ ${ctx.dmg} dmg 【DEFEAT!!】`;
        } else {
          const guardStr = ctx.events.some(e => e.type === "guard") ? " (GUARD)" : "";
          const boostStr = ctx.boostType ? ` ${ctx.boostType}` : "";
          event.log = `${name}の${event.attack}！ ${ctx.dmg} dmg${guardStr}${boostStr}`;
        }
        ctx.events.push(event);

        if (defeat) {
          ctx.events.push({ type: "defeat", motion: "shake", text: "DEFEAT!!" });
          ctx.events.push({ type: "flash", motion: "flash" });
          inCooldown = true;
          cooldownUntil = ctx.now + (window.CONFIG_RAID?.NEXT_BOSS_INTERVAL_MS ?? 1200);

          // 討伐スタンプの表示要請 (旧fx.jsから移動)
          setTimeout(() => {
            if (typeof window.showRaidStamp === "function") {
              window.showRaidStamp("./assets/stamp_defeat.png");
            }
          }, 2500);
        }
      }
    },

    afterComment(ctx, state, cfg) {
      this.saveState(state);
    },

    saveState(state) {
      if (window.CONFIG?.SAVE_PROGRESS === false) return;
      localStorage.setItem("comment_raid_level", state.level);
      localStorage.setItem("comment_raid_hp", state.hp);
    }
  };

  window.ENGINE.use(RaidLogicPlugin);
  console.log("[RaidPlugin] RaidLogic (Internal Game Rules) registered.");
})();
