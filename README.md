# CommentRaid

わんコメ向け `CommentRaid` テンプレート一式のリポジトリです。  
このリポジトリには、Base 本体と、その Base を利用する派生テンプレート / プラグイン例が含まれます。

## 構成

- `comment_raid_base_v1/`
  - CommentRaid Base 本体
- `CRB_sample_counter/`
  - Base を利用する最小サンプルプラグイン
- `CRB_bossbattle_v1/`
  - Base を利用する BossBattle プラグイン
- `CRB_idolonstage_v1/`
  - Base を利用する アイドル応援風演出 プラグイン

各プラグインは、`comment_raid_base_v1` と同じ階層に置いて使う前提です。  
派生フォルダ単体では動作しません。

## ライセンスについて

このリポジトリ全体は単一ライセンスではありません。

- コードの一部は MIT ライセンスで利用できます
- 画像、動画、その他アセット類は MIT ライセンスではありません
- 再利用、改変、再配布の可否は、各フォルダや各ファイルに付随する条件を確認してください

そのため、このリポジトリのルートにはリポジトリ全体を一律に表す `LICENSE` ファイルを置いていません。

## 補足

- 導入方法や設定項目は各フォルダ内の `README.md` を参照してください
- 開発の基準仕様は `comment_raid_base_v1/README.md` を参照してください
