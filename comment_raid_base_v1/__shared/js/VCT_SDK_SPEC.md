# V-Creator Tools: OneComme Core SDK (VCT) Technical Spec v1.0.0

## 1. 概要
`vct_one_core.js` は、わんコメの `OneSDK` から送られてくる生データを、テンプレート開発で扱いやすい形式に解析・整形するための共有ライブラリです。
`DOMParser` による絵文字の分離、色の優先順位判定、システムメッセージの補完などを自動で行います。

## 2. 導入方法
テンプレートの `index.html` の `onesdk.js`（および `config.js`）の後、メインスクリプト（`main.js` 等）の前に読み込みます。

```html
<script src="../__origin/js/onesdk.js"></script>
<script src="./config.js"></script>
<!-- SDKの読み込み -->
<script src="../__shared/js/vct_one_core.js"></script>
<script src="./main.js"></script>
```

## 3. API リファレンス

### `window.VCT.parse(rawComment)`
OneSDKの `comments` アクション等で受け取った生のコメントオブジェクトを解析します。

**引数:**
- `rawComment` (Object): OneSDKから渡されるコメント1件分のデータ。

**戻り値:**
解析済みの `CommentObject`。構造は以下の通りです。

| プロパティ | 型 | 説明 |
| :--- | :--- | :--- |
| `id` | String | ユニークID（OneSDKのID優先、なければ自動生成） |
| `user` | String | 表示名（displayName > name） |
| `profileImage` | String | プロフィールアイコンのURL |
| `badges` | Array | メンバーバッジ等の配列 |
| `text` | String | 画像を除外した純粋なテキスト本文 |
| `parts` | Array | テキストと絵文字を分解した配列（後述） |
| `imgUrls` | Array | メッセージに含まれる画像URLのリスト |
| `color` | Object | 解析された色（`{r, g, b}`） |
| `colorStr` | String | `rgb(255, 255, 255)` 形式の色文字列 |
| `hasGift` | Boolean | ギフト・スパチャ判定 |
| `isSticky` | Boolean | 固定コメント判定 |
| `membership` | Boolean | メンバーシップ関連判定 |
| `raw` | Object | 解析前の生データ |

### `CommentObject.parts` の構造
リスト表示などで「テキストと絵文字を正しい並び順で出したい」場合に使用します。
```javascript
[
  { type: 'text', content: 'こんにちは！' },
  { type: 'emoji', url: 'https://...', alt: 'emoji_smile' },
  { type: 'text', content: '（わこつ！）' }
]
```

## 4. 特殊仕様
- **システムメッセージ補完**: メンギフやマイルストーンなど、本文が空でシステム情報だけがある場合、それらを結合して `text` および `parts` にセットします。
- **スパチャ金額**: 金額テキスト（`paidText`）が存在し、本文に含まれていない場合は自動的に末尾へ追加されます。
- **色判定ロジック**:
  1. ギフト背景色・文字色
  2. （`CONFIG.USE_USER_COLOR` が true の場合）ユーザーカラー
  3. 白 (`rgb(255, 255, 255)`)
  の順に優先されます。

## 5. 実装例
```javascript
OneSDK.subscribe({
  action: 'comments',
  callback: (comments) => {
    comments.forEach(raw => {
      // 解析の実行
      const data = VCT.parse(raw);
      
      console.log(`${data.user}: ${data.text}`);
      console.log('解析された色:', data.colorStr);
    });
  }
});
```
