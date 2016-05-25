React + Flux を使ってみた感じのTODOリスト

## 主要なファイル

### components/App.js

Reactコンポーネントをこのファイルにまとめている。本来はコンポーネント毎に別ファイルにしてimportするべきかもしれない。
コンポーネントで発生するonClickなどのイベントを拾って ``TodoActions.remove(this.props.todo)`` のようにTodoActionsに丸投げする。

### actions/TodoActions.js

TodoActionsは純粋なクラス。各種アクションを発生させるメソッドを保持し、アクション内容をオブジェクトとして整理してAppDispatcherに渡す。

### dispatcher/AppDispatcher.js

npmでインストールしたfluxのDispatcherをnewするだけ。

### stores/TodoStore.js

データ本体。データを直接操作するcreate()やupdate()は外からは呼べないようになっていることがポイントだろうか。
その代わりTodoStoreクラス内で、AppDispatcherが持ってきたアクションに応じて適切なデータ操作がなされるように、AppDispatcher.register()関数で登録している。

またEventEmitterを継承しており、addListenerインターフェイスをもっているとともに、データに変更があった場合はemitして変更を通知するようになっている。

### constants/TodoConstants.js

アクションの定義リスト。アプリケーションを作る時まずはConstantsを羅列すれば整理しやすいかも。

## 機能追加例

例として、一つのTODOを削除する機能を追加する場合の手順を述べる。

### 1. App.jsを編集し、削除ボタンのonClickでTodoActionsを動作させる

render()のreturnの一部。.bind(this)しないと_onClick()内でthis.propsが取れない。

```
<button onClick={this._onRemoveClick.bind(this)}>削除</button>
```

```
_onClick() {
  TodoActions.remove(this.props.todo)
}
```

### 2. TodoActions.jsを編集し、remove関数を作成する

removeアクションをオブジェクトとしてまとめたものをAppDispatcher.dispatch()で渡す。

```
remove(todo) {
  AppDispatcher.dispatch({
    type: TodoConstants.TODO_REMOVE,
    id: todo.id
  });
}
```

### 3. TodoConstants.jsを編集し、TODO_REMOVEアクションを定義する

定数を追加するだけなので省略。

### 4. TodoStore.jsを編集し、実質的なデータ操作を定義する

まずTodoStoreクラスの外側に純粋なdestroy関数を作成する。

```
const destroy = (id) => {
  delete  _todos[id];
}
```

TodoStoreクラスのコンストラクタに、アクションタイプに応じてどのような操作するのかを示すswitch文があるので、そこにTODO_REMOVEアクションを追加する。データ変更を通知するためにemit()を呼んでいる。


```
case TodoConstants.TODO_REMOVE:
  destroy(action.id);
  this.emitChange();
  break;
```


以上で削除ボタン機能を追加できる。
