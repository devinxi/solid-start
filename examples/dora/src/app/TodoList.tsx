import { createEffect, Show, For, createResource, refetchResources } from "solid-js";
import { createStore } from "solid-js/store";
import { prisma } from "~/db.server";
import server from "solid-start/server";
import { Link } from "solid-app-router";

import { startTransition } from "~/root";

const clearCompleted = () =>
  server(() =>
    prisma.todo.deleteMany({
      where: {
        completed: true
      }
    })
  )().then(() => startTransition(refetchResources));

const toggleAll = (completed: any) =>
  server(
    async (completed: boolean) =>
      await prisma.todo.updateMany({
        data: {
          completed
        }
      })
  )(completed).then(() => startTransition(refetchResources));

const removeTodo = (todoId: string) =>
  server(
    async (todoId: string) =>
      await prisma.todo.delete({
        where: {
          id: todoId
        }
      })
  )(todoId).then(() => startTransition(refetchResources));

const editTodo = server(
  async (todo: { id: string; name?: string; completed?: boolean }) =>
    await prisma.todo.update({
      where: {
        id: todo.id
      },

      data: {
        name: todo.name,
        completed: todo.completed
      }
    })
);

const toggle = (todoId: any, { target: { checked } }: any) =>
  editTodo({ id: todoId, completed: checked }).then(() => startTransition(refetchResources));

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

declare module "solid-js" {
  namespace JSX {
    interface HTMLAttributes<T> {
      "use:setFocus"?: any;
    }
  }
}

const setFocus = (el: { focus: () => void }) => setTimeout(() => el.focus());
setFocus;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function TodoList(params: { show: string }) {
  const [data] = createResource(
    server(async () => {
      await sleep(1000);
      return await prisma.todo.findMany();
    })
  );

  createEffect(() => {
    console.log(data());
  });

  const [state, setState] = createStore({
    editingTodoId: null as string | null
  });

  const filterList = (todos: any[]) => {
    if (params.show === "active")
      return todos.filter((todo: { completed: any }) => !todo.completed);
    else if (params.show === "completed")
      return todos.filter((todo: { completed: any }) => todo.completed);
    else return todos;
  };

  const setEditing = (todoId: string | null) => setState("editingTodoId", todoId);

  const save = (todoId: any, { target: { value } }: any) => {
    const title = value.trim();
    if (state.editingTodoId === todoId && title) {
      editTodo({ id: todoId, name: title }).then(() => {
        refetchResources();
      });
      setEditing(null);
    }
  };

  const doneEditing = (todoId: any, e: { keyCode?: any; target?: any }) => {
    if (e.keyCode === ENTER_KEY) save(todoId, e);
    else if (e.keyCode === ESCAPE_KEY) setEditing(null);
  };

  const remainingCount = () =>
    data()
      ? data()!.length - data()!.filter((todo: { completed: any }) => todo.completed).length
      : 0;

  return (
    <>
      <section class="main">
        <input
          id="toggle-all"
          class="toggle-all"
          type="checkbox"
          checked={!Number(remainingCount())}
          onInput={({ target }) => toggleAll(remainingCount() ? true : false)}
        />
        <label for="toggle-all" />
        <ul class="todo-list">
          <For each={filterList(data() ?? [])}>
            {todo => (
              <li
                class="todo"
                classList={{
                  editing: state.editingTodoId === todo.id,
                  completed: todo.completed
                }}
              >
                <div class="view">
                  <input
                    class="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onInput={[toggle, todo.id]}
                  />
                  <label onDblClick={[setEditing, todo.id]}>{todo.name}</label>
                  <button class="destroy" onClick={[removeTodo, todo.id]} />
                </div>
                <Show when={state.editingTodoId === todo.id}>
                  <input
                    class="edit"
                    value={todo.name}
                    onFocusOut={[save, todo.id]}
                    onKeyUp={[doneEditing, todo.id]}
                    use:setFocus
                  />
                </Show>
              </li>
            )}
          </For>
        </ul>
      </section>

      <footer class="footer">
        <span class="todo-count">
          <strong>{remainingCount()}</strong> {remainingCount() === 1 ? " item " : " items "} left
        </span>
        <ul class="filters">
          <li>
            <Link href="/todo/" classList={{ selected: params.show === "all" }}>
              All
            </Link>
          </li>
          <li>
            <Link href="/todo/active" classList={{ selected: params.show === "active" }}>
              Active
            </Link>
          </li>
          <li>
            <Link href="/todo/completed" classList={{ selected: params.show === "completed" }}>
              Completed
            </Link>
          </li>
        </ul>
        <Show when={remainingCount() !== data()?.length}>
          <button class="clear-completed" onClick={clearCompleted}>
            Clear completed
          </button>
        </Show>
      </footer>
    </>
  );
}
