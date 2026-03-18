/**
 * Idol Logic Plugin v1.0.0
 * Handles Voltage, Levels, Cooldowns, and Persistence.
 */
(function () {
  if (!window.ENGINE) return;

  let inCooldown = false;
  let cooldownUntil = 0;
  let idolTitle = "アイドル";

  const IdolLogicPlugin = {
    name: "IdolLogic",
    // すべての構成パーツ（Logic, Config, UI, Style）は manifest で一括管理します
    manifest: "./plugins/plugin_manifest.js",

    onInit(ctx, state, cfg) {
      const c = window.CONFIG_IDOL || {};
      const difficulty = (c.DIFFICULTY || "normal").toLowerCase();
      const preset = c.PRESETS?.[difficulty] || {};

      // 1. Config merge
      cfg.BASE_VOLTAGE = Number(c.BASE_VOLTAGE ?? preset.BASE_VOLTAGE ?? 100);
      cfg.VOLTAGE_PER_LEVEL = Number(c.VOLTAGE_PER_LEVEL ?? preset.VOLTAGE_PER_LEVEL ?? 500);
      cfg.VOLTAGE_GROWTH_RATE = Number(c.VOLTAGE_GROWTH_RATE ?? 1.0);

      if (!cfg.BASE_VOLTAGE || isNaN(cfg.BASE_VOLTAGE)) cfg.BASE_VOLTAGE = 1000;
      if (isNaN(cfg.VOLTAGE_PER_LEVEL)) cfg.VOLTAGE_PER_LEVEL = 500;

      // 2. State init
      state.level = 1;
      let savedVoltage = null;

      const baseCfg = window.CONFIG || {};
      if (baseCfg.RESET_PROGRESS === true) {
        localStorage.removeItem("comment_idol_level");
        localStorage.removeItem("comment_idol_voltage");
      } else if (baseCfg.SAVE_PROGRESS !== false) {
        const savedLevel = localStorage.getItem("comment_idol_level");
        if (savedLevel) state.level = parseInt(savedLevel, 10) || 1;

        const savedVoltageRaw = localStorage.getItem("comment_idol_voltage");
        if (savedVoltageRaw !== null) savedVoltage = parseFloat(savedVoltageRaw);
      }

      this.onResetBoss(ctx, state, cfg, savedVoltage === null);
      // RESTORE SAVED VOLTAGE IF AVAILABLE
      if (savedVoltage !== null) {
        state.voltage = savedVoltage;
        if (state.voltage >= state.maxVoltage) state.voltage = state.maxVoltage - 0.1;
        // UIを同期
        state.ui.status.progress = state.voltage / state.maxVoltage;
        state.ui.status.text = `VOLTAGE ${Math.floor(state.voltage)} / ${Math.floor(state.maxVoltage)}`;
      }
    },

    onResetBoss(ctx, state, cfg, levelReset = false) {
      idolTitle = this.decideIdolTitle(state.level);

      // 指数関数的な成長計算
      let totalMax = cfg.BASE_VOLTAGE;
      let growthRate = cfg.VOLTAGE_GROWTH_RATE ?? 1.0;
      let addedAmount = cfg.VOLTAGE_PER_LEVEL;

      for (let i = 2; i <= state.level; i++) {
        totalMax += addedAmount;
        addedAmount *= growthRate;
      }
      state.maxVoltage = totalMax;

      // レベルアップ時は数値をリセットせず保持（新規開始時やリセット時のみ0）
      if (levelReset) {
        state.voltage = 0;
      }

      // --- Generic UI Interface ---
      state.ui = state.ui || {};
      state.ui.status = {
        title: `STAGE Lv${state.level}：${idolTitle}`,
        label: `${window.CONFIG_IDOL?.IDOL_NAME || "配信者"}`,
        progress: state.voltage / state.maxVoltage,
        text: `VOLTAGE ${Math.floor(state.voltage)} / ${Math.floor(state.maxVoltage)}`,
        color: null // Optional theme color
      };
    },

    decideIdolTitle(level) {
      const c = window.CONFIG_IDOL || {};
      const mode = c.IDOL_TITLE_MODE || "byLevel";
      if (mode === "fixed") return c.IDOL_TITLE_FIXED || "アイドル";
      if (mode === "random" && typeof window.pickIdolTitleRandom === "function") return window.pickIdolTitleRandom(level);
      if (typeof window.pickIdolTitle === "function") return window.pickIdolTitle(level);
      return "アイドル";
    },

    onUpdate(ctx, state, cfg) {
      if (inCooldown) {
        if (ctx.now >= cooldownUntil) {
          inCooldown = false;
          state.level++;
          // 直接更新 (第四引数 false で voltage をリセットしない)
          this.onResetBoss(ctx, state, cfg, false);
          this.saveState(state);
        }
      }
    },

    beforeComment(ctx, state, cfg) {
      if (inCooldown) ctx.terminated = true;
    },

    afterCalculateDamage(ctx, state, cfg) {
      // 応援（Cheer）の適用
      let cheerValue = ctx.cheer || 0; // CheerPluginで計算された値

      // ctx.dmg がセットされていた場合フォールバック(コア起因など用)
      if (cheerValue === 0 && ctx.dmg > 0) cheerValue = ctx.dmg;

      if (cheerValue > 0 && !ctx.isBossAction) {
        state.voltage += cheerValue;

        const levelUp = state.voltage >= state.maxVoltage;
        if (levelUp) state.voltage = state.maxVoltage;

        // UI情報の更新
        state.ui.status.progress = state.voltage / state.maxVoltage;
        state.ui.status.text = `VOLTAGE ${Math.floor(state.voltage)} / ${Math.floor(state.maxVoltage)}`;

        const event = {
          type: "hit",
          motion: "heart",
          dmg: "", // 数値は表示しない
          attack: ctx.action?.name || "Cheer",
          boostType: ctx.boostType,
          isGift: !!ctx.commentData?.hasGift
        };

        // --- Log formatting (Plugin side) ---
        const logFormat = window.CONFIG_IDOL?.LOG_FORMAT || "battle_1line";
        if (logFormat === "battle_1line") {
          const name = ctx.commentData?.user || "Anonymous";
          if (levelUp) {
            event.log = `${name}の応援！ +${cheerValue} 【LEVEL UP!!】`;
          } else {
            // guard判定はないが、表示文字列の構築
            const boostStr = ctx.boostType ? ` ${ctx.boostType}` : "";
            event.log = `${name}の ${event.attack}！ +${cheerValue} VOLTAGE${boostStr}`;
          }
        } else {
          // name_comment の場合はログを生成せず、エンジンのデフォルト出力に任せる
          event.log = null;
        }
        ctx.events.push(event);

        if (levelUp) {
          ctx.events.push({ type: "defeat", motion: "shake", text: "LEVEL UP!!" });
          ctx.events.push({ type: "flash", motion: "flash" });
          inCooldown = true;
          cooldownUntil = ctx.now + (window.CONFIG_IDOL?.NEXT_STAGE_INTERVAL_MS ?? 6000);

          // レベルアップスタンプの表示要請
          setTimeout(() => {
            if (typeof window.showRaidStamp === "function") {
              window.showRaidStamp("./assets/stamp_clear.png");
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
      localStorage.setItem("comment_idol_level", state.level);
      localStorage.setItem("comment_idol_voltage", state.voltage);
    }
  };

  window.ENGINE.use(IdolLogicPlugin);
  console.log("[IdolPlugin] IdolLogic registered.");
})();
