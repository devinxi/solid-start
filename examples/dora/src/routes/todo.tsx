import { refetchResources } from "solid-js";
import { prisma } from "~/db.server";
import server from "solid-start/server";
import { Outlet } from "solid-app-router";
import { startTransition } from "~/root";
const ENTER_KEY = 13;

export default function TodoApp() {
  const addTodo = async ({ target, keyCode }: any) => {
    const title = target.value.trim();
    if (keyCode === ENTER_KEY && title) {
      await server(async ({ name }: { name: string }) => {
        return await prisma.todo.create({
          data: {
            name
          }
        });
      })({ name: title });
      target.value = "";
      startTransition(refetchResources);
    }
  };

  return (
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo" placeholder="What needs to be done?" onKeyDown={addTodo} />
      </header>
      <Outlet />
    </section>
  );
}
