import React from 'react';
import TodoActions from '../actions/TodoActions';

import TodoStore from '../stores/TodoStore';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {todos: {}};
  }
  componentDidMount() {
    TodoStore.addChangeListener(this.setTodoState.bind(this));
    TodoStore.addChangeListener(this.setLoadingState.bind(this));
    TodoActions.fetch()
  }
  setTodoState() {
    this.setState({todos: TodoStore.getAll()});
  }
  setLoadingState() {
    this.setState({loading: TodoStore.loading});
  }
  render() {
    let loading = this.state.loading ? <p>loading ...</p> : null;
    return (
      <div>
        <h1>Hello!</h1>
        <NewTodoInput onResult={this.handleNewTodo} disabled={this.state.loading} />
        <TodoList todos={this.state.todos}/>
        {loading}
      </div>
    )
  }
  handleNewTodo(text) {
    TodoActions.addTodo(text);
  }
}

class TodoList extends React.Component {
  render() {
    let todos_array = [];
    for (let id in this.props.todos) {
      todos_array.push(this.props.todos[id]);
    }
    return (
      <div>
        {todos_array.map( (todo) => {
          return <Todo todo={todo} key={todo.id} />
        })}
      </div>
    );
  }
}

class Todo extends React.Component {
  render() {
    let style = this.props.todo.complete ? {textDecoration: 'line-through'} : {}
    return (
      <li style={style} >
        <span onClick={this._onClick.bind(this)} >{this.props.todo.text}</span>
        <button onClick={this._onRemoveClick.bind(this)} >x</button>
      </li>
    )
  }
  _onClick() {
    TodoActions.toggleComplete(this.props.todo);
  }
  _onRemoveClick() {
    TodoActions.remove(this.props.todo);
  }
}

class NewTodoInput extends React.Component {
  render() {
    return (
      <input type="text" onKeyDown={this._onKeyDown.bind(this)} disabled={this.props.disabled} />
    )
  }
  _onKeyDown(e) {
    if (e.keyCode == 13) {
      this.props.onResult(e.target.value);
      e.target.value = "";
    }
  }
}
