/**
 * Standard Combat Plugin for Comment Raid
 * Handles:
 * - Random/Command-based attack selection
 * - Base damage calculation
 * - Gift/SuperChat damage boosts
 * - Random guard/mitigation
 */
(function () {
    if (!window.ENGINE) {
        console.error("ENGINE is not loaded. CombatPlugin must be loaded after engine.js");
        return;
    }

    function getAttack(commentText = "") {
        const table = window.ATTACK_TABLE;
        if (!Array.isArray(table) || table.length === 0) {
            return { name: "Attack", power: 1.0 };
        }

        // コマンド指定があるか確認
        if (commentText) {
            const found = table.find(a => a.command && commentText.includes(a.command));
            if (found) return found;
        }

        return table[Math.floor(Math.random() * table.length)];
    }

    function calcBaseDamage() {
        return 5 + Math.floor(Math.random() * 16); // 5〜20
    }

    const StandardCombatPlugin = {
        name: "StandardCombat",

        onProcessAttack(ctx) {
            ctx.attack = getAttack(ctx.commentData.text);
            ctx.dmg = calcBaseDamage();

            // 技倍率
            ctx.dmg = Math.floor(ctx.dmg * (ctx.attack.power ?? 1.0));
        },

        onCalculateDamage(ctx, state, cfg) {
            // 1. ギフト・スパチャバフ
            if (ctx.commentData.hasGift) {
                const gMult = window.CONFIG?.GIFT_DAMAGE_MULTIPLIER ?? 1.1;
                const sCoeff = window.CONFIG?.PRICE_BUFF_COEFFICIENT ?? 0.001;

                // 金額抽出 (エンジン内のヘルパーを利用)
                const price = (typeof ENGINE.extractGiftPrice === "function")
                    ? ENGINE.extractGiftPrice(ctx.commentData)
                    : (ctx.commentData.price ?? 0);

                const boostMult = gMult * (1 + price * sCoeff);
                ctx.dmg = Math.floor(ctx.dmg * boostMult);
                ctx.boostType = (price > 0) ? "GIFT BOOST!" : "BOOSTED!";
            }

            // 2. Guard判定
            if (Math.random() < cfg.GUARD_CHANCE) {
                ctx.dmg = Math.floor(ctx.dmg * (1 - cfg.GUARD_REDUCTION));
                ctx.events.push({ type: "guard", motion: "center_float", text: "GUARD" });
            }
        }
    };

    // エンジンに登録
    window.ENGINE.use(StandardCombatPlugin);
    console.log("[RaidPlugin] StandardCombat registered.");
})();
