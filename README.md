
## ファイルの説明

|ファイル名|説明|
|--- |--- |
|app.js|nodeのメインファイル（ここでAPIを実装）|
|public|Webサーバーが返すルートディレクトリ|

## 概要図

## セットアップ(For Mac)

```
$ brew update
$ brew install mongodb
$ brew install pkgconfig | brew update pkgconfig
$ brew install cairo
$ ln -s /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents/
$ launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist
$ mongod
```

```
$ git clone xxxx
$ cd xxxx
$ npm install
$ node ./db/seeds.js
$ node-dev app.js
```
