# 奇文字生成・復号ツール
## そもそも奇文字って何?
全てあなたの所以です。氏によって作られた「奇」という楽曲などに使用された暗号文です。<br>
https://youtu.be/CEWY8STNciE
## 奇文字の解読方法は?
この動画の最初で分かりやすく説明されています。<br>
https://www.youtube.com/watch?v=dS9GFNaXZuY <br>
簡単に説明すると、<br>
①文字列をUTF-16でデコード <br>
②デコードしたものを16進数として2文字分ずつ足していく <br>
③足した結果をUTF-16でエンコードする <br>
## このツールの使い方
基本的には暗号化or解読したい文字列を入力して平文⇒奇文字もしくは奇文字⇒平文ボタンを押すだけです。<br>
「ランダム生成」はチェックを外すと出力結果が固定になります。<br>
「表示できない文字も含める」にチェックを付けると通常表示できない文字も含めて暗号文を生成します。<br>

※このツールはChatGPTなどを参考に超適当に作られているのでおそらくバグが大量にあります。
ご了承ください。
