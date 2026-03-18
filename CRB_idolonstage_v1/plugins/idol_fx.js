/**
 * Idol FX Plugin - Heart Effect Manager
 * Handles the '💓' floating animation without touching the base engine.
 */
(function() {
  if (!window.FX) return;

  const originalPush = window.FX.push;

  // 演出用アイテムの管理（ハート専用）
  // ※ベースの FX.push が使えない複雑な動きをしたい場合、
  // ここで独自に描画ループを回すことも可能ですが、
  // 今回はベースの FX.push に「変換」して渡すことで互換性を保ちます。

  window.FX.push = function(data) {
    const c = window.CONFIG_IDOL || {};
    
    // 画面全体の最大表示数を上書き
    if (window.CONFIG_RAID) window.CONFIG_RAID.MAX_ACTIVE = c.MAX_ACTIVE_EFFECTS || 64;

    if (data.motion === "heart") {
      const emoji = c.CHEER_EMOJI || "💓";
      const color = c.CHEER_EMOJI_COLOR || { r: 255, g: 100, b: 180 };

      // 数を決定 (ギフトなら多めに)
      const maxCount = data.isGift ? (c.CHEER_EMOJI_GIFT_COUNT || 15) : (c.CHEER_EMOJI_COUNT || 5);
      const minCount = Math.max(1, Math.floor(maxCount * 0.6)); // 設定値の60%〜100%の間でランダム
      const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

      for (let i = 0; i < count; i++) {
        const heartData = {
            type: "comment",
            text: emoji,
            // 画面内のランダムな位置（見切れても良い）
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            // 揺れながら上昇
            vx: (Math.random() - 0.5) * 120,
            vy: -150 - Math.random() * 150,
            duration: 2.0 + Math.random() * 2.0,
            scale: 0.8 + Math.random() * 1.5,
            color: color,
            motion: "float" // ベースが持っている float を利用
        };
        originalPush(heartData);
      }
      return;
    }

    // それ以外は通常の処理へ
    originalPush(data);
  };

  console.log("[IdolPlugin] Heart FX Extension loaded.");
})();
