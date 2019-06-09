
/****
 * 検索条件設定ページの定義
 * @since 2019/5/28
 ****/
var _s_form_inp = [
  {  type: 'inp-text'
   , name: 'search-word'
   , placeholder: '検索文字列を入力'
   , class: 'inp-required'
   , label: {text: '検索ワード', class: 'title'}
  }
, {  type: 'inp-date'
   , name: 'last-update'
   , class: 'inp-required'
   , label: {text: '更新日', class: 'title'}
  }
];
var _s_form_btn = [
  {  type: 'inp-submit'
   , id: 'btn-search', text: '検索'}
, {  type: 'inp-reset', text: 'クリア'}
];

var s_page_def = {
  title: 'search setting page'
, root: 's-page'
, child: [
     {type: 'h3', text: '全文検索システム'}
   , {type: 'form', action: '#',
      child: [
        {  type: 'block'
         , child: _s_form_inp
        }
      , {  type: 'block'
         , child: _s_form_btn
        }
      ]
    }
  , {  type: 'block'
     , id: 's-resp'
    }
  , {  type: 'pre'
     , class: 'string-transparence'
     , text: 'ここにクリップボードにコピーする文字列を設定'
     , id: 'clipboard-data'
    }
  ]
};


/****
 * 検索結果ページの定義
 * @since 2019/5/28
 ****/
var r_page_def = {
  title: 'search result page'
, root: 'r-page'
, child: []
};

var r_item_view = {root: 's-resp'};
var r_item      = {
   type: 'block'
 , class: 'result-item'
};
var r_item_link = {
   type: 'anchor'
 , class: 'resource-anchor'
};
var r_item_hl = {
   type: 'html'
 , position: 'beforeend'
 , content: ''
};


/****
 * 各ページの定義
 * @since 2019/5/28
 ****/
var page_list = [
  s_page_def, r_page_def
];

/****
 * 全ページの定義（外枠）
 * @since 2019/5/28
 ****/
var page_defs = [{
  title: 'page defs'
, root: 'ap_contents'
, child: [
    // 検索条件設定ページ
    {type: 'block', id: 's-page', class: 'page page_hidden'}
    // 検索結果表示ページ
  , {type: 'block', id: 'r-page', class: 'page page_hidden'}
  ]}
];

/****
 * ビューのルート定義
 * @since 2019/5/28
 ****/
var view_root = {
  title: 'view root'
  , root: 'body'
  , child: [
      {type: 'block', id: 'ap_contents'}
    ]
};



/** ***********************************
 * アプリケーション
 */
function MyApp(apConfig) {
  this.apConfig = apConfig;
  this.event = {};
  this.fw = undefined;
};
/**
 * アプリケーションを開始する.
 * @since 2019/4/11
 */
MyApp.prototype.start = function(self) {
  console.log('start app');
  var fw = self.fw;
  // ビューのルートを生成
  fw.make_views(fw, [view_root]);
  // ヘッダーを生成
  //fw.make_views(fw, [app_header]);
  // ページの定義
  fw.make_views(fw, page_defs);
  // 各ページの展開
  fw.make_views(fw, page_list);

  // アプリ定義で指定されたスタートページを表示
  var cf = self.apConfig;
  var elm = document.getElementById(cf.start_page_id);
  console.log(cf.start_page_id);
  elm.classList.toggle(cf.page_deactivate_class);
  cf.active_page = elm;

  // ポップアップメニューのイベントを処理させる設定
  //cf.other_view = document.getElementById('menu_body');
};
/**
 * 要素を隠す
 * @since 2019/4/16
 */
MyApp.prototype.hideElement = function(self, elmId) {
  var elm = document.querySelector('#'+elmId);
  elm.classList.add(self.apConfig.page_deactivate_class);
};
/**
 * 要素を表示する
 * @since 2019/4/16
 */
MyApp.prototype.showElement = function(self, elmId) {
  var elm = document.querySelector('#'+elmId);
  elm.classList.remove(self.apConfig.page_deactivate_class);
};
/**
 * 【アクティブページの切替】
 * data-page属性を持つ要素を指定して切替えを行う.
 * @since 2019/3/27
 */
MyApp.prototype.changePage = function(self, target) {
  // 切り替えるページIDをdata-page属性から取得
  var pgId = target.dataset.page;
  if (!pgId) {
    console.log('target not found(1) at changePage');
    return;
  }
  // ページ切り替え
  if (!self.changePageById(self, pgId)) {
    console.log('target not found(2) at changePage');
  }
};
/**
 * 【アクティブページの切替】
 * id属性を指定して切替えを行う.
 * @since 2019/4/28
 */
MyApp.prototype.changePageById = function(self, elmId) {
  var elm = self.fw.findElement(elmId);
  if (!elm) {
    console.log(elmId + ' not found');
    return false;
  }
  // ページ切り替え
  self.changePageByElement(self, elm);
  return true;
};
/**
 * 【アクティブページの切替】
 * 要素オブジェクトを指定して切替えを行う.
 * @since 2019/4/28
 */
MyApp.prototype.changePageByElement = function(self, elm) {
  var cf = self.apConfig;
  // 指定のページをアクティブに設定
  elm.classList.toggle(cf.page_deactivate_class);
  // 現在のページを非アクティブに設定
  var curPg = self.apConfig.active_page;
  curPg.classList.toggle(cf.page_deactivate_class);
  // 指定のページ以外をディアクティブに設定
  cf.active_page = elm;
};
/**
 * 現在の表示しているページのリセットを行う.
 * @since 2019/4/20
 */
MyApp.prototype.resetActivateForm = function(self) {
  var forms = self.apConfig.active_page.getElementsByTagName('form');
  forms[0].reset();
};
/**
 * サーバ通信を行う
 * @since 2019/4/11
 */
MyApp.prototype.serverComm = function(self, path, proc) {
  var ac = self.apConfig;
  var url = 'http://' + location.hostname + ac.uri + '?' + path + ac.highlighting;
  console.log(url);
  self.fw.ajax(self.fw, {
    url: url
  , timeout: ac.comm_timer
  , method: 'GET'
  , req_data: null
  , success: function(data) {
      //console.log(data);
      proc(self, data);
    }
  , failure: function(message) {
      console.log('server request failure');
      // todo 20190530 エラー処理の実装
    }
  });
};
/**
 * URI文字列に変換する.
 * @since 2019/5/28
 */
MyApp.prototype.editSearchRequest = function(self, vals) {
  return 'q=' + encodeURI(vals['search-word']);
};
/**
 * 検索行う.
 * @since 2019/5/28
 */
MyApp.prototype.EM_doSearch = function(self, vals) {
  console.log(vals);
  // 入力を確認
  if (vals['search-word'] == '') {
    alert('[必須]検索文字列を入力して下さい');
    return;
  }
  // リクエストデータの編集
  req = self.editSearchRequest(self, vals);
  console.log(req);
  // サーバに検索要求
  self.serverComm(self, req, self.searchResult);
};
/**
 * 検索結果を一覧に表示する.
 * @since 2019/6/1
 */
MyApp.prototype.searchResult = function(self, rxData) {
  console.log(rxData);
  var list = document.getElementById('s-resp');
  list.textContent = '';
  var view = r_item_view;
  view['child'] = [];
  var fw = self.fw;
  for (var rec of rxData.response.docs) {
    var item = fw.deepCopy(r_item);
    item['child'] = [];
    if (!('attr_resourcename' in rec)) {
      console.log('no attr_resourcename\n' + rec);
      continue;
    }
    var path = rec.attr_resourcename[0];
    var wk = path.split('\\');
    var link = fw.deepCopy(r_item_link);
    link['href'] = '#';
    link['text'] = wk[wk.length-1];
    item['data'] = {resource: path};
    var hl = fw.deepCopy(r_item_hl);
    hl.content = self.editForResult(rxData.highlighting[rec.id].content[0]);
    item['child'].push(hl);
    item['child'].push(link);
    view['child'].push(item);
  }
  var elm = fw.make_view(fw, view);
};
/**
 * 検索結果一覧の項目を選択
 * @since 2019/6/1
 */
MyApp.prototype.EM_selectResultItem = function(self, target) {
  console.log(target.dataset.resource);

  var we = self.fw.findElement('#clipboard-data');
  we.textContent = target.dataset.resource;
  var selection = window.getSelection();
  var range = document.createRange();
  range.selectNodeContents(we);
  selection.removeAllRanges();
  selection.addRange(range);
  if (document.execCommand('copy')) {
    alert('ドキュメントのパスをクリップボードにコピーしました.');
  } else {
    alert('コピーに失敗しました.');
  }
  selection.removeAllRanges();
};

/**
 * 検索結果の編集を行う.
 * @since 2019/6/9
 */
MyApp.prototype.editForResult = function(str) {
  var wk = str.replace(/\n/g, '');
  wk = wk.replace(/　/g, ' ');
  return wk.replace(/( )\1+/g, '') + '<br/>';
};



/***************************************
 * イベントマップ
 */
var _evtMap = [];
/**
 * 【イベント定義】アプリケーションの開始
 * @since 2019/4/6
 */
_evtMap.push({
   type: 'load'
, process: function(fw, evt, app) {
    app.start(app);
  }
});
/**
 * 【イベント定義】「検索」ボタン押下
 * @since 2019/5/28
 */
_evtMap.push({
  type: 'click'
, id_targets: ['btn-search']
, process: function(fw, evt, target, app) {
    // 検索処理
    var vals = fw.findFormValues(fw, target);
    app.EM_doSearch(app, vals);
  }
});
/**
 * 【イベント定義】検索結果一覧の項目選択
 * @since 2019/6/1
 */
_evtMap.push({
  type: 'click'
, class_targets: ['result-item']
, process: function(fw, evt, target, app) {
    //console.log(target);
    app.EM_selectResultItem(app, target);
  }
});



//_evtMap.push({});


/**
 * アプリの定義
 * @since 2019/3/5
 */
var _ap_config = {
  // 開始ページを定義する
  start_page_id: 's-page'
  // ページの表示／非表示を切り替えるスタイルを定義する
, page_deactivate_class: 'page_hidden'
  // イベントを定義する
, event_map: _evtMap
  // アクティブなページを保持する
, active_page: undefined
  // ポップアップビューを保持する
, popup_view: undefined
  // その他のビュー
, other_view: undefined

, uri: '/solr/files/select'
, highlighting: '&hl=on&hl.fl=content'
/*
, server_uri: 'http://192.168.3.4/solr/ykato/select'
, server_uri: 'http://localhost:8983/solr/ykato/select'
*/
, request_header: {}
, comm_timer: 10000

  // デバッグ
, isDebug: true
};

var myApp = new MyApp(_ap_config);






/**********************
 * フレームワークLite
 * @param {アプリケーションオブジェクト} app
 * @ver 0.0.2
 * 2019/3/2 イベントハンドラとフォーム自動生成をマージ
 */
function FwLite(app) {
  this.app = app;
  app.fw = this;
};
/**
 * ディープコピー.
 * @since 2019/6/1
 */
FwLite.prototype.deepCopy = function(source) {
  return JSON.parse(JSON.stringify(source));
};
/**
 * 先頭から指定行で分割する.
 * @since 2019/4/15
 */
FwLite.prototype.splitLine = function(source, lnCnt) {
  var wk = source.split(/\r\n|\n/);
  var wkln = wk.length;
  if (lnCnt == wkln) {
    return wk;
  } else if (wkln < lnCnt) {
    for (var i=0; i<(lnCnt-wkln); ++i) {
      wk.push('');
    }
    return wk;
  }
  var r = [];
  for (var i=1; i<lnCnt; ++i) {
    r.push(wk.shift());
  }
  r.push(wk.join('\n'));
  return r;
};
/**
 * formの値を取得する.
 * @param {このフレームワーク} self
 * @param {formタグまたは親タグ} pElm
 * @param {値を追加する連想配列} vals
 * @return キー(name)、値(value)の連想配列
 * @since 2019/4/16
 */
FwLite.prototype.getFormValues = function(self, pElm, vals) {
  for (var idx = 0; idx < pElm.children.length; ++idx) {
    var elm = pElm.children[idx];
    if (elm.name) {
      // console.log(elm.name + ' : ' + elm.value);
      if (elm.type.toLowerCase() === 'checkbox') {
        vals[elm.name] = elm.checked;
      } else {
        vals[elm.name] = elm.value;
      }
    }
    if (elm.firstElementChild) {
      vals = self.getFormValues(self, elm, vals);
    }
  }
  return vals;
};
/**
 * formに値を設定する.
 * @param {このフレームワーク} self
 * @param {formタグまたは親タグ} pElm
 * @param {値を設定する連想配列} vals
 * @since 2019/4/19
 */
FwLite.prototype.setFormValues = function(self, pElm, vals) {
  var list = pElm.querySelectorAll('[name]');
  list.forEach(function(elm) {
    if (elm.name in vals) {
      if (elm.type.toLowerCase() === 'checkbox') {
        elm.checked = vals[elm.name];
      } else {
        elm.value = vals[elm.name];
      }
    }
  });
};
/**
 * 指定のキーと値を持った連想配列を探す.
 * @param {このフレームワーク} self
 * @param {連想配列オブジェクトの配列} ary
 * @param {検索対象キー} key
 * @param {検索対象の値} val
 * @since 2019/4/8
 */
FwLite.prototype.findDictByKeyAndVal = function(self, ary, key, val) {
  for (var item of ary) {
    if (key in item) {
      if (item[key] == val) return item;
    }
  }
  if ('child' in item) {
    return self.findDictByKeyAndVal(self, item.child, key, val);
  }
  return undefined;
};
/**
 * タグを検索する.
 * @param {検索を開始するタグ} startTag
 * @param {検索するタグ名称} tagName
 * @since 2019/4/19
 */
FwLite.prototype.findParentTag = function(startTag, tagName) {
  if (tagName === startTag.nodeName.toLowerCase()) {
    return startTag;
  } else {
    // form要素を検索
    var fElm = startTag.parentNode;
    while (tagName !== fElm.nodeName.toLowerCase())
      fElm = fElm.parentNode;
  }
  return fElm;
};
/**
 * 指定要素を含むformのデータを取得する.
 * @param {このフレームワーク} self
 * @param {formに含まれる要素} tag
 * @return キー(name)、値(value)の連想配列
 * @since 2019/4/16
 */
FwLite.prototype.findFormValues = function(self, tag) {
  // console.log('current nodeName : ' + tag.nodeName.toLowerCase());
  var fElm = self.findParentTag(tag, 'form');
  return self.getFormValues(self, fElm, {});
};
/**
 * 指定の値をformに設定する.
 * @since 2019/4/19
 */
FwLite.prototype.storeFormValues = function(self, tag, vals) {
  // console.log('current nodeName : ' + tag.nodeName.toLowerCase());
  var fElm = self.findParentTag(tag, 'form');
  return self.setFormValues(self, fElm, vals);
};
  /**
 * 指定の要素に属性を設定する.
 * @param elm 属性を設定する要素
 * @param attr 設定する属性
 * @return 要素（elm）
 * @since 2019/3/1
 */
FwLite.prototype.setAttributes = function(elm, attr) {
  if ('class' in attr) {
    elm.classList = attr.class;
  }
  if ('id' in attr) {
    elm.id = attr.id;
  }
  if ('data' in attr) {
    var dt = attr.data;
    for (key in dt) {
      elm.dataset[key] = dt[key];
    }
  }
  return elm;
};
/**
 * 指定の入力要素に属性を設定する.
 * @param elm 属性を設定する要素
 * @param attr 設定する属性
 * @return 要素（elm）
 * @since 2019/3/16
 */
FwLite.prototype.setInputAttributes = function(elm, attr) {
  if ('name' in attr) {
    elm.name = attr.name;
  }
  if ('readonly' in attr) {
    elm.readOnly = attr.readonly;
  }
  return elm;
};
/**
 * 要素を生成する.
 * @param {このフレームワーク} self
 * @param {生成する要素名称} elmName
 * @param {属性} attr
 * @return 生成した要素
 * @since 2019/3/1
 */
FwLite.prototype.createElement = function(self, elmName, attr) {
  var elm = document.createElement(elmName);
  if (attr) return self.setAttributes(elm, attr);
  return elm;
};
/**
 * ブロック要素を生成する.
 * @param {このフレームワーク} self
 * @param {ブロック要素に設定する属性} attr 
 * @return DIV要素
 * @since 2019/3/1
 */
FwLite.prototype.createBlockElement = function(self, attr) {
  var elm = self.createElement(self, 'div', attr);
  if ('text' in attr) elm.innerText = attr.text;
  return elm;
};
/**
 * アンカー要素を生成する.
 * @param {このフレームワーク} self
 * @param {アンカー要素に設定する属性} attr 
 * @return A要素
 * @since 2019/6/1
 */
FwLite.prototype.createAnchorElement = function(self, attr) {
  var elm = self.createElement(self, 'a', attr);
  if ('href' in attr) elm.href = attr.href;
  if ('text' in attr) elm.innerText = attr.text;
  return elm;
};
/**
 * フォーム要素を生成する.
 * @param {このフレームワーク} self
 * @param {フォーム要素に設定する属性} attr 
 * @return FORM要素
 * @since 2019/3/1
 */
FwLite.prototype.createFormElement = function(self, attr) {
  var elm = self.createElement(self, 'form', attr);
  if ('action' in attr) elm.action = attr.action;
  return elm;
};
/**
 * 入力要素を生成する.
 * @param {このフレームワーク} self
 * @param {入力要素に設定する属性} attr 
 * @param {入力要素タイプ} inpType 
 * @return INPUT要素
 * @since 2019/3/1
 */
FwLite.prototype.createInputElement = function(self, attr, inpType) {
  var elm = self.createElement(self, 'input', attr);
  self.setInputAttributes(elm, attr);
  elm.type = inpType;
  if ('placeholder' in attr) elm.placeholder = attr.placeholder;
  if ('value' in attr) elm.value = attr.value;
  if ('readonly' in attr) elm.readOnly = attr.readonly;
  return elm;
};
/**
 * 複数行入力要素を生成する.
 * @param {このフレームワーク} self
 * @param {入力要素に設定する属性} attr
 * @return TEXTAREA要素
 * @since 2019/4/1
 */
FwLite.prototype.createTextareaElement = function(self, attr, inpType) {
  var elm = self.createElement(self, 'textarea', attr);
  self.setInputAttributes(elm, attr);
  if ('placeholder' in attr) elm.placeholder = attr.placeholder;
  if ('value' in attr) elm.value = attr.value;
  if ('readonly' in attr) elm.readOnly = attr.readonly;
  elm.rows = attr.rows;
  return elm;
};
/**
 * チェックボックス要素を生成する.
 * @param {このフレームワーク} self
 * @param {入力要素に設定する属性} attr
 * @return {親要素}
 * @since 2019/3/12
 */
FwLite.prototype.createCheckboxElement = function(self, attr) {
  var pElm = self.createBlockElement(self, {});
  var elm = self.createElement(self, 'input', attr);
  elm.type = 'checkbox';
  self.setInputAttributes(elm, attr);
  if (attr.checked) elm.checked = true;
  pElm.appendChild(elm);
  if ('cbx_label' in attr) {
    var lblAttr = {text: attr.cbx_label.text};
    if ('id' in attr) lblAttr['for'] = attr.id;
    pElm.appendChild(self.createLabelElement(self, lblAttr));
  }
  return pElm;
};
/**
 * ラベル要素を生成する.
 * @param {このフレームワーク} self
 * @param {ラベル要素に設定する属性} attr 
 * @return LABEL要素
 * @since 2019/3/1
 */
FwLite.prototype.createLabelElement = function(self, attr) {
  var elm = self.createElement(self, 'label', attr);
  if ('for' in attr) elm.htmlFor = attr.for;
  elm.innerText = attr.text;
  return elm;
};
/**
 * ラベル要素を生成する.
 * @param {このフレームワーク} self
 * @param {ラベル要素に設定する属性} attr 
 * @return LABEL要素
 * @since 2019/3/12
 */
FwLite.prototype.createFormLabelElement = function(self, attr) {
  var lblAttr = attr.label;
  if ('id' in attr) lblAttr.for = attr.id;
  return self.createLabelElement(self, lblAttr);
};
/**
 * 日付入力要素を生成する.
 * @param {このフレームワーク} self
 * @param {日付入力要素に設定する属性} attr
 * @return 日付入力要素
 * @since 2019/3/13
 */
FwLite.prototype.createInputDateElement = function(self, attr) {
  var elm = self.createElement(self, 'input', attr);
  elm.type = 'date';
  self.setInputAttributes(elm, attr);
  if ('placeholder' in attr) {
    elm.placeholder = attr.placeholder;
  }
  if ('value' in attr) {
    elm.value = attr.value;
  }
  return elm;
};
/**
 * ボタン要素を生成する.
 * @param {このフレームワーク} self
 * @param {ボタンに設定する属性} attr 
 * @param {ボタンの種類（submit, reset）} type 
 * @return ボタン要素
 * @since 2019/3/1
 */
FwLite.prototype.createButtonElement = function(self, attr, type) {
  var elm = self.createElement(self, 'button', attr);
  elm.type = type;
  if ('text' in attr) elm.innerText = attr.text;
  return elm;
};
/**
 * 定義・説明リストを生成する.
 * @param {このフレームワーク} self
 * @param {定義・説明リストに設定する属性} attr 
 * @return 定義・説明リスト
 * @since 2019/3/3
 */
FwLite.prototype.createDefinitionList = function(self, attr) {
  // リストの親要素を生成
  var elm = self.createElement(self, 'dl', attr);
  // タイトルとタイトルに紐づく項目を生成
  for (chunk of attr.child) {
    // タイトルを生成
    var dt = self.createElement(self, 'dt', chunk);
    dt.innerText = chunk.text;
    elm.appendChild(dt);
    // 項目を生成
    for (item of chunk.items) {
      var dd = self.createElement(self, 'dd', item);
      dd.innerText = item.text;
      elm.appendChild(dd);
    }
  }
  return elm;
};
/**
 * オプション要素を生成する.
 * @since 2019/4/28
 */
FwLite.prototype.createSelectorOption = function(self, attr) {
  var opt = self.createElement(self, 'option', attr);
  opt.value = attr.value;
  opt.innerText = attr.text;
  return opt;
};
/**
 * セレクタ（コンボボックス）を生成する.
 * @param {このフレームワーク} self
 * @param {属性} attr
 * @since 2019/4/2
 */
FwLite.prototype.createSelectorElement = function(self, attr) {
  var elm = self.createElement(self, 'select', attr);
  self.setInputAttributes(elm, attr);
  for (var optItm of attr.options) {
    var opt = self.createSelectorOption(self, optItm);
    // var opt = self.createElement(self, 'option', optItm);
    // opt.value = optItm.value;
    // opt.innerText = optItm.text;
    elm.appendChild(opt);
  }
  return elm;
};
/**
 * ビューを生成する.
 * @param {このフレームワーク} self
 * @param {ビュー定義} vw
 * @param {親要素} pelm
 * @since 2019/3/1
 */
FwLite.prototype.make_view = function(self, vw, pelm) {
  var rootElm;
  if ('root' in vw) {
    rootElm = document.getElementById(vw.root);
  } else{
    rootElm = pelm;
  }
  var elm;
  for (pt of vw.child) {
    var ptTyp = pt.type;
    if (ptTyp == 'block') {
      elm = self.createBlockElement(self, pt);
    } else if (ptTyp == 'form') {
      elm = self.createFormElement(self, pt);
    } else if (ptTyp == 'inp-text') {
      if ('rows' in pt) {
        elm = self.createTextareaElement(self, pt);
      } else {
        elm = self.createInputElement(self, pt, 'text');
      }
    } else if (ptTyp == 'inp-passwd') {
      elm = self.createInputElement(self, pt, 'password');
    } else if (ptTyp == 'inp-cbx') {
      elm = self.createCheckboxElement(self, pt);
    } else if (ptTyp == 'inp-date') {
      elm = self.createInputDateElement(self, pt);
    } else if (ptTyp == 'inp-submit') {
      elm = self.createButtonElement(self, pt, 'button');
    } else if (ptTyp == 'inp-reset') {
      elm = self.createButtonElement(self, pt, 'reset');
    } else if (ptTyp == 'inp-button') {
      elm = self.createButtonElement(self, pt, 'button');
    } else if (ptTyp == 'inp-select') {
      elm = self.createSelectorElement(self, pt);
    } else if (ptTyp == 'anchor') {
      elm = self.createAnchorElement(self, pt);
    } else if (ptTyp == 'html') {
      rootElm.insertAdjacentHTML(pt.position, pt.content);
      continue;

    } else if (ptTyp == 'def-list') {
      elm = self.createDefinitionList(self, pt);
      rootElm.appendChild(elm);
      continue;   /* dl内のChildは、処理済み */
    } else {
      elm = self.createElement(self, ptTyp, pt);
      if ('text' in pt) elm.innerText = pt.text;
    }
    if ('label' in pt) {
      var lblElm = self.createFormLabelElement(self, pt);
      rootElm.appendChild(lblElm);
    }
    if ('child' in pt) {
      // 再帰呼び出し
      self.make_view(self, pt, elm);
    }
    rootElm.appendChild(elm);
  }
};
/**
 * ビューを生成する.
 * @param {このフレームワーク} self
 * @param {全てのビュー定義} defs
 * @since 2019/3/1
 */
FwLite.prototype.make_views = function(self, defs) {
  for (vw of defs) {
    console.log('make [' + vw.title + ']');
    self.make_view(self, vw);
  }
};
/**
 * 指定領域に座標が含まれるかを判定する.
 * @param {x 座標} x
 * @param {y 座標} y
 * @param {領域を表すオブジェクト} elmRect
 * @since 2019/3/10
 */
FwLite.prototype.inRect = function(x, y, elmRect) {
  var x2 = elmRect.left + elmRect.width;
  var y2 = elmRect.top  + elmRect.height;
  if ((elmRect.left <= x) && (x <= x2)
   && (elmRect.top  <= y) && (y <= y2)) {
     return true;
   }
   return false;
};
/**
 * イベント情報とイベント処理マップが一致する
 * 関数を起動する.
 * @param {このフレームワーク} self
 * @param {イベントオブジェクト} evt
 * @param {要素オブジェクト} elm
 * @since 0.0.1 (2019/02/16)
 */
FwLite.prototype.evtExecuterById = function(self, evt, elm) {
  var id = elm.id;
  for (var item of self.app.apConfig.event_map) {
    if ('id_targets' in item) {
      if (item.id_targets.indexOf(id) != -1) {
        console.log('start id:'+id);
        item.process(self, evt, elm, self.app);
        self.evtExecFlag = true;
      }
    }
  }
};
/**
 * イベント情報とイベント処理マップが一致する
 * 関数を起動する.
 * @param {このフレームワーク} self
 * @param {イベントオブジェクト} evt
 * @param {要素オブジェクト} elm
 * @since 0.0.1 (2019/02/16)
 */
FwLite.prototype.evtExecuterByClass = function(self, evt, elm) {
  var clsList = elm.classList;
  for (var item of self.app.apConfig.event_map) {
    if ('class_targets' in item) {
      for (var cls of item.class_targets) {
        if (clsList.contains(cls)) {
          item.process(self, evt, elm, self.app);
          self.evtExecFlag = true;
        }
      }
    }
  }
};
/**
 * 座標系によるイベントを処理する.
 * @param {このフレームワーク} self
 * @param {イベントオブジェクト} evt
 * @param {親要素} pElm
 * @since 2019/3/10
 */
FwLite.prototype.executeEventByXY = function(self, evt , pElm) {
  for (var idx = 0; idx < pElm.children.length; ++idx) {
    var elm = pElm.children[idx];
    if (elm.clientHeight == 0 || elm.clientWidth == 0) continue;
    var rect = elm.getBoundingClientRect();
    if (self.inRect(evt.clientX, evt.clientY, rect)) {
      if (elm.id) {
        self.evtExecuterById(self, evt, elm);
      } else if (elm.classList.length > 0) {
        self.evtExecuterByClass(self, evt, elm);
      }
    }
    if (elm.children) {
      self.executeEventByXY(self, evt, elm);
    }
  }
};
/**
 * addEventListenerから呼び出され、
 * イベント処理マップに従った処理を実行する.
 * @param {このフレームワーク} self
 * @param {イベントオブジェクト} evt
 * @since 0.0.1 (2019/02/16)
 */
FwLite.prototype.evtCatcher = function(self, evt) {
  // console.log(evt.type);
  if (evt.type == 'load') {
    self.executeEventByType(self, evt);
  } else {
    //var elm = document.querySelector('#body');
    //self.executeEventByXY(self, evt, elm);
    self.evtExecFlag = false;
    // ポップアップメニューの対象要素を処理
    var elm = self.app.apConfig.popup_view;
    if (elm) {
      self.executeEventByXY(self, evt, elm);
      if (self.evtExecFlag)  return;
    }
    // アクティブページの対象要素を処理
    var elm = self.app.apConfig.active_page;
    if (elm) {
      self.executeEventByXY(self, evt, elm);
      if (self.evtExecFlag)  return;
    }
    // その他ビューの対象要素を処理
    var elm = self.app.apConfig.other_view;
    if (elm) {
      self.executeEventByXY(self, evt, elm);
      if (self.evtExecFlag)  return;
    }
  }
};
/**
 * イベントタイプによるイベントの処理を行う.
 * @param {このフレームワーク} self
 * @param {イベントオブジェクト} evt
 * @since 2019/3/10
 */
FwLite.prototype.executeEventByType = function(self, evt) {
  for (var item of self.app.apConfig.event_map) {
    // イベント処理マップを検索
    if (evt.type == item.type) {
      // イベントの種類で実行
      item.process(self, evt, self.app);
    }
  }
};
/**
 * イベントの準備を行う.
 * @param {このフレームワーク} self
 * @since 0.0.1 (2019/02/16)
 * 2019/03/07 イベントマップからイベントの種類を取得
 */
FwLite.prototype.prepare = function(self) {
  // 通信に関する設定
  self._ajax = {
      status: 'idle'
    , que: new Array()
  };
  // 操作イベントに関する設定
  tl = self.keyList(self.app.apConfig.event_map, 'type');
  //console.log(tl);
  var bodyElm = document.querySelector('#body');
  if (tl.indexOf('load') >= 0) {
    // loadイベント
    addEventListener('load', function(evt) {
      setTimeout(function() {
        self.evtCatcher(self, evt);
      }, 0);
    }, false);
  }
  if (tl.indexOf('click') >= 0) {
    // clickイベント
    bodyElm.addEventListener('click', function(evt) {
      setTimeout(function() {
        self.evtCatcher(self, evt);
      }, 0);
    }, false);
  }


  if (tl.indexOf('touchstart') >= 0) {
    // touchstartイベント
    bodyElm.addEventListener('touchstart', function(evt) {
      setTimeout(function() {
        self.evtCatcher(self, evt);
      }, 0);
    }, false);
  }
};
/**
 * mapのキー一覧を作成する.
 * @param {map配列} l
 * @param {キー} k
 * @return キー一覧
 * @since 0.0.2 (2019/03/07)
 */
FwLite.prototype.keyList = function(l, k) {
  var r = [];
  for (i of l) {
    if (r.indexOf(i[k]) < 0) r.push(i[k]);
  }
  return r;
};
/**
 * 指定の単一要素を検索する.
 * @param {検索要素のキー名称} tgtNm
 * @return 要素オブジェクト
 * @since 0.0.1 (2019/02/16)
 */
FwLite.prototype.findElement = function(tgtNm) {
  return document.querySelector(tgtNm);
};
/**
 * 指定の要素を検索する.
 * @param {このフレームワーク} self
 * @param {検索要素のキー名称} tgtNm
 * @return 要素オブジェクト（一覧）
 * @since 0.0.1 (2019/02/21)
 */
FwLite.prototype.findElements = function(self, tgtNm) {
  return document.querySelectorAll(tgtNm);
};

/***************************************
 * jsonでajax通信を行う.
 * @param {このフレームワーク} self
 * @param {リクエスト} req
 * @since 2019/3/17
 */
FwLite.prototype.ajax = function(self, req) {
  // リクエストをスタックにプッシュ
  self._ajax.que.push(req);
  // リクエストを処理
  self.ajax_S100(self);
};
FwLite.prototype.ajax_S100 = function(self) {
  if (self._ajax.que.length == 0) {
    self._ajax.status = 'idle';
    console.log('no more ajax request');
    return;
  }
  setTimeout(function() {
    self._ajax.status = 'tx-101';
    self.ajax_S200(self);
  }, 0);
};
FwLite.prototype.ajax_S200 = function(self) {
  if (self._ajax.status === 'tx-101') {
    console.log('send request');
    var req = self._ajax.que[0];
    var xhr = self._ajax_getXHR(self, req);
    if (req.req_data) {
      xhr.send(JSON.stringify(req.req_data));
    } else {
      xhr.send(null);
    }
  } else {
    console.log('not supportted status : ' + self._ajax.status);
  }
};
/**
 * XMLHttpRequestを生成し、初期設定を行う.
 * @param {このフレームワーク} self
 * @param {httpリクエスト} req
 * @since 2019/3/17
 */
FwLite.prototype._ajax_getXHR = function(self, req) {
  var xhr = new XMLHttpRequest();
  if ('method' in req && req.method == 'GET') {
    xhr.open('GET', req.url, true);
  } else {
    xhr.open('POST', req.url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
  }
  xhr.timeout = req.timeout;
  xhr.onload = function() {
    self.ajax_onload(self, xhr);
  };
  xhr.onerror = function() {
    self.ajax_onerror(self, xhr);
  };
  xhr.onabort = function() {
    self.ajax_onabort(self, xhr);
  };
  xhr.ontimeout = function() {
    self.ajax_ontimeout(self, xhr);
  };
  return xhr;
};
/**
 * ajaxの処理結果を判定する.
 * @param {このフレームワーク} self
 * @param {終了状態文字列(OK/ERROR)} status
 * @param {XMLHttpRequestオブジェクト} xhr
 * @since 2019/3/17
 */
FwLite.prototype.ajax_S300 = function(self, status, xhr) {
  if (status === 'OK') {
    var req = self._ajax.que[0];
    setTimeout(function() {
      var data = xhr.responseText;
      req.success(JSON.parse(data));
    });
  } else {
    var req = self._ajax.que[0];
    setTimeout(function() {
      req.failure(status);
    });
  }
  self._ajax.que.pop();
  self._ajax.statis = 'idle';
  // キュー待ちのリクエストを処理
  self.ajax_S100(self);
};
/**
 * ajaxで応答を受信した時の処理を行う.
 * @param {このフレームワーク} self
 * @param {XMLHttpRequestオブジェクト} xhr
 * @since 2019/3/17
 */
FwLite.prototype.ajax_onload = function(self, xhr) {
  console.log('ajax_onload');
  if (xhr.status == 200) {
    self.ajax_S300(self, 'OK', xhr);
  } else {
    self.ajax_S300(self, xhr.statusText, xhr);
  }
};
/**
 * ajaxでエラーを検出した時の処理を行う.
 * @param {このフレームワーク} self
 * @param {XMLHttpRequestオブジェクト} xhr
 * @since 2019/3/17
 */
FwLite.prototype.ajax_onerror = function(self, xhr) {
  console.log('ajax_onerror');
  self.ajax_S300(self, 'ERROR', xhr);
};
/**
 * ajaxでabortを検出した時の処理を行う.
 * @param {このフレームワーク} self
 * @param {XMLHttpRequestオブジェクト} xhr
 * @since 2019/3/17
 */
FwLite.prototype.ajax_onabort = function(self, xhr) {
  console.log('ajax_onabort');
  self.ajax_S300(self, 'ERROR', xhr);
};
/**
 * ajaxでタイムアウトを検出した時の処理を行う.
 * @param {このフレームワーク} self
 * @param {XMLHttpRequestオブジェクト} xhr
 * @since 2019/3/17
 */
FwLite.prototype.ajax_ontimeout = function(self, xhr) {
  console.log('ajax_ontimeout');
  self.ajax_S300(self, 'TIMEOUT', xhr);
};

/***************************************
 * フレームワークLiteを起動
 */
var myFw = new FwLite(myApp);
myFw.prepare(myFw);

// end of framework