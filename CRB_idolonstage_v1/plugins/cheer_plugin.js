/**
 * Cheer Plugin for Idol On Stage
 * Handles:
 * - Random/Command-based action selection
 * - Base cheer calculation
 * - Gift/SuperChat cheer boosts
 * - Streamer Buff calculation
 */
(function () {
    if (!window.ENGINE) {
        console.error("ENGINE is not loaded. CheerPlugin must be loaded after engine.js");
        return;
    }

    function getAction(commentText = "") {
        const table = window.CHEER_TABLE;
        if (!Array.isArray(table) || table.length === 0) {
            return { name: "Cheer", power: 1.0 };
        }

        // コマンド指定があるか確認
        if (commentText) {
            const found = table.find(a => a.command && commentText.includes(a.command));
            if (found) return found;
        }

        return table[Math.floor(Math.random() * table.length)];
    }

    function calcBaseCheer() {
        return 5 + Math.floor(Math.random() * 16); // 5〜20
    }

    const CheerPlugin = {
        name: "CheerPlugin",

        onProcessAttack(ctx) {
            ctx.action = getAction(ctx.commentData.text);
            ctx.cheer = calcBaseCheer();

            // 技倍率
            ctx.cheer = Math.floor(ctx.cheer * (ctx.action.power ?? 1.0));
        },

        onCalculateDamage(ctx, state, cfg) {
            // 1. ギフト・スパチャバフ
            if (ctx.commentData.hasGift) {
                const gMult = window.CONFIG?.GIFT_DAMAGE_MULTIPLIER ?? 1.1;
                const sCoeff = window.CONFIG?.PRICE_BUFF_COEFFICIENT ?? 0.001;

                // 金額抽出
                const price = (typeof ENGINE.extractGiftPrice === "function")
                    ? ENGINE.extractGiftPrice(ctx.commentData)
                    : (ctx.commentData.price ?? 0);

                const boostMult = gMult * (1 + price * sCoeff);
                ctx.cheer = Math.floor(ctx.cheer * boostMult);
                ctx.boostType = (price > 0) ? "SUPER CHEER!" : "BOOSTED!";
            }

            // 2. 配信者スキル（バフ）判定
            if (state.cheerMultiplier && state.buffUntil && ctx.now <= state.buffUntil) {
                ctx.cheer = Math.floor(ctx.cheer * state.cheerMultiplier);
                ctx.boostType = ctx.boostType ? `${ctx.boostType} + BUFF!` : "BUFF!";
            } else if (state.buffUntil && ctx.now > state.buffUntil) {
                state.cheerMultiplier = 1;
                state.buffUntil = 0;
            }
        }
    };

    // エンジンに登録
    window.ENGINE.use(CheerPlugin);
    console.log("[IdolPlugin] CheerPlugin registered.");
})();
