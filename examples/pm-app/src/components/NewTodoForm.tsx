import * as React from "react";
import { useFetcher } from "remix";
import { TodoList as TTodoList } from "src/models";
import { Field, FieldProvider, Label } from "src/ui/form";
import { Button } from "src/ui/button";

export function NewTodoForm({ listId }: { listId: TTodoList["id"]; }) {
  const todoFetcher = useFetcher();

  const [value, setValue] = React.useState("");
  const submissionAction = todoFetcher.submission?.action;
  React.useEffect(() => {
    if (submissionAction?.startsWith("/dashboard/todos/new")) {
      setValue("");
    }
  }, [submissionAction]);

  return (
    <todoFetcher.Form
      action="/dashboard/todos/new"
      className="flex flex-col gap-4"
      method="post"
    >
      <input type="hidden" name="listId" value={listId} />
      <FieldProvider
        name="name"
        id="new-todo"
        required
        disabled={todoFetcher.state !== "idle"}
      >
        <Label>New Todo</Label>
        <Field value={value} onChange={e => setValue(e.target.value)} />
      </FieldProvider>
      <div>
        <Button className="flex-shrink-0">Create Todo</Button>
      </div>
    </todoFetcher.Form>
  );
}
