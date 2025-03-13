import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todosCounter: number;
  selectedLink: string;
  setSelectedLink: (arg: string) => void;
  todos: Todo[];
  setAllTodos: (arg: Todo[]) => void;
};

export const Footer: React.FC<Props> = ({
  todosCounter,
  selectedLink,
  setSelectedLink,
  todos,
  setAllTodos,
}) => {
  return (
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
  );
};
