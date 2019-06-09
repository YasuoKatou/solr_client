# Apahce Solr client

全文検索サーバのクライアントアプリケーション

##### システムの構成

クライアントアプリケーション（このアプリ）

↓　↑

NGINX

↓　↑

・Apache Solr（全文検索サーバ）

・このアプリケーション



##### クライアントの設定

```
396：, uri: '/solr/files/select'
```

「files」は、Solrのコレクション名を設定する

##### NGINXの設定

```
        # Solrへのリバースプロキシを定義
        location /solr {
            rewrite /(.*)   /$1 break;
            proxy_pass  http://localhost:8983/;
        }
        # クライアントの設定
        location /solrcl {
            root   html;
            index  index.html index.htm;
        }

```



##### Apache Solrの設定

コアは、「SOLR_HOME/example/files」にあるスキーマを使用して作成する。

```
Windowsでのコア作成例
bin\solr.cmd create -c files -d example\files\conf
```

