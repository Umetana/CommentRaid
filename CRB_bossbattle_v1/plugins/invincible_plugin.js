/**
 * Invincible Plugin for Comment Raid
 * Boss becomes immune to damage for a limited time.
 * Command: !invincible (Owner only)
 */
(function () {
    if (!window.ENGINE) return;

    // --- Plugin Internal Settings (Defaults) ---
    const PLUGIN_SETTINGS = {
        duration: 10000,
        cooldown: 6000,
        videoUrl: [
            "./assets/invincible_plugin/invincible_cutin01.mp4",
            "./assets/invincible_plugin/invincible_cutin02.mp4",
            "./assets/invincible_plugin/invincible_cutin03.mp4",
        ],
    };

    let lastUsed = 0;

    const InvinciblePlugin = {
        name: "InvinciblePlugin",

        onResetBoss(ctx, state) {
            state.invincibleUntil = 0;
        },

        onProcessAttack(ctx, state) {
            if (!ctx.commentData.isOwner) return;
            if (!ctx.commentData.text.includes("!invincible")) return;

            const now = ctx.now;
            const config = window.CONFIG || {};

            // 設定の解決 (Config > Plugin Defaults)
            const cooldown = config.INVINCIBLE_COOLDOWN ?? PLUGIN_SETTINGS.cooldown;
            const duration = config.INVINCIBLE_DURATION ?? PLUGIN_SETTINGS.duration;
            const videoUrl = config.INVINCIBLE_VIDEO_URL ?? PLUGIN_SETTINGS.videoUrl;

            if (now - lastUsed < cooldown) {
                ctx.events.push({
                    type: "skill_fail",
                    name: "鉄壁の構え",
                    reason: "再使用待機中"
                });
                ctx.terminated = true;
                return;
            }

            // 無敵発動
            state.invincibleUntil = now + duration;
            lastUsed = now;

            ctx.events.push({
                type: "heal",
                name: "鉄壁の構え",
                amount: 0,
                count: "ACTIVATE",
                limit: (duration / 1000) + "s"
            });

            ctx.events.push({ type: "boss_skill_effect", name: "invincible" });

            // 動画演出再生
            if (typeof window.playVideoEffect === "function") {
                // 配列ならランダムに選ぶ
                const finalUrl = Array.isArray(videoUrl)
                    ? videoUrl[Math.floor(Math.random() * videoUrl.length)]
                    : videoUrl;
                window.playVideoEffect(finalUrl);
            }

            ctx.isBossAction = true;
            ctx.terminated = true;
        },

        onCalculateDamage(ctx, state) {
            // 無敵時間内ならダメージを0にする
            if (ctx.now < (state.invincibleUntil || 0)) {
                ctx.dmg = 0;
                ctx.events.push({
                    type: "guard",
                    reason: "INVINCIBLE"
                });
            }
        }
    };

    window.ENGINE.use(InvinciblePlugin);
    console.log("[RaidPlugin] Invincible registered.");
})();
