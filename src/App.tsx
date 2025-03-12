/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
// #region imports
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
// #endregion

export const App: React.FC = () => {
  // #region useState
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [selectedLink, setSelectedLink] = useState('All');
  const [errorButton, setErrorButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todosCounter, setTodosCounter] = useState(0);
  // #endregion

  // #region useEffect
  useEffect(() => {
    getTodos()
      .then(setAllTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    const notCompleted = allTodos.filter(todo => !todo.completed);

    setTodosCounter(notCompleted.length);
  }, [selectedTodos, todos, allTodos]);

  useEffect(() => {
    if (selectedLink === 'active') {
      setTodos(allTodos.filter(todo => !todo.completed));
    } else if (selectedLink === 'completed') {
      setTodos(allTodos.filter(todo => todo.completed));
    } else {
      setTodos(allTodos);
    }
  }, [selectedLink, allTodos]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);
  // #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={event => {
              event.preventDefault();
              setInputValue('');
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {todos.map(todo => {
            return (
              <div
                data-cy="Todo"
                className={classNames('todo', {
                  completed: selectedTodos.includes(todo.id) || todo.completed,
                })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className={classNames('todo__status')}
                    checked={todo.completed}
                    onChange={() => {
                      //toggle completed or not todo
                      if (selectedTodos.includes(todo.id) || todo.completed) {
                        const filteredTodos = selectedTodos.filter(
                          item => item !== todo.id,
                        );

                        setSelectedTodos(filteredTodos);
                      } else {
                        setSelectedTodos(prev => [...prev, todo.id]);
                      }
                    }}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => {
                    const deletedTodo = todo.id;
                    const filteredList = todos.filter(
                      todoItem => todoItem.id !== deletedTodo,
                    );

                    setAllTodos(filteredList);
                  }}
                >
                  ×
                </button>

                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}
         
        </section>

        {/* Hide the footer if there are no todos */}
        {allTodos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todosCounter} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: selectedLink === 'All',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setSelectedLink('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: selectedLink === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setSelectedLink('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: selectedLink === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setSelectedLink('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => {
                const activeTodos = todos.filter(todo => !todo.completed);

                setAllTodos(activeTodos);
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorButton || errorMessage.length === 0,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorButton(true)}
        />
        {/* show only one message at a time */}
        {errorMessage.length > 0 && errorMessage}
      </div>
    </div>
  );
};
