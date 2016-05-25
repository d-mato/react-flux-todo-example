import {EventEmitter} from 'events';
const CHANGE_EVENT = 'change';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TodoConstants from '../constants/TodoConstants';

let _todos = {
};

const create = (text) => {
  let id = Math.max.apply(null, Object.keys(_todos)) + 1;
  _todos[id] = {id: id, text: text, complete: false};
  console.log(_todos);
}

const update = (id, params) => {
  _todos[id] = Object.assign(_todos[id], params);
}

const destroy = (id) => {
  delete  _todos[id];
}

class TodoStore extends EventEmitter {
  constructor() {
    super();
    AppDispatcher.register( action => {
      switch (action.type) {
        case TodoConstants.TODO_CREATE:
          create(action.text.trim());
          this.emitChange();
          break;
    
        case TodoConstants.TODO_COMPLETE:
          update(action.id, {complete: true});
          this.emitChange();
          break;
    
        case TodoConstants.TODO_UNDO_COMPLETE:
          update(action.id, {complete: false});
          this.emitChange();
          break;

        case TodoConstants.TODO_REMOVE:
          destroy(action.id);
          this.emitChange();
          break;

        case TodoConstants.TODO_FETCH:
          this.loading = true;
          this.emitChange();
          break;

        case TodoConstants.TODO_FETCH_SUCCESS:
          _todos = action.todos;
          this.loading = false;
          this.emitChange();
          break;
    
        default:
      }
    });
  }

  getAll() {
    return _todos;
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

export default new TodoStore();
