import AppDispatcher from '../dispatcher/AppDispatcher';
import TodoConstants from '../constants/TodoConstants';

class TodoActions {
  addTodo(text) {
    AppDispatcher.dispatch({
      type: TodoConstants.TODO_CREATE,
      text: text
    });
    console.log('Add '+text);
  }

  toggleComplete(todo) {
    let type = todo.complete ? TodoConstants.TODO_UNDO_COMPLETE : TodoConstants.TODO_COMPLETE;

    AppDispatcher.dispatch({
      type: type,
      id: todo.id
    });
    console.log('toggle '+todo.id);
  }

  remove(todo) {
    AppDispatcher.dispatch({
      type: TodoConstants.TODO_REMOVE,
      id: todo.id
    });
    console.log('remove '+todo.id);
  }

  fetch() {
    AppDispatcher.dispatch({
      type: TodoConstants.TODO_FETCH
    });
    console.log('fetch');
    setTimeout( () => {
      let todos = {
        '1': {id: 1, text: "todo10", complete: false},
        '2': {id: 2, text: "todo20", complete: false},
      };
      AppDispatcher.dispatch({
        type: TodoConstants.TODO_FETCH_SUCCESS,
        todos: todos
      });
      console.log('fetch-success');
    }, 2000);
  }
}

export default new TodoActions()
