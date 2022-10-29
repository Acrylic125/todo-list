import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { DateTime } from "luxon";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Todo from "./Todo";

const Todos = () => {
  const queryClient = useQueryClient();
  const supabaseClient = useSupabaseClient();
  const { data: todos } = useQuery(["todos"], async () => {
    const {
      data: { user },
      error: getUserError,
    } = await supabaseClient.auth.getUser();
    if (getUserError) {
      throw getUserError;
    }

    const { data: todos, error: getTodosError } = await supabaseClient.from("todos").select("*").eq("user_id", user.id);
    if (getTodosError) {
      throw getTodosError;
    }

    return todos;
  });
  const { mutate: updateTodo } = useMutation(
    async (newTodo) => {
      const { data, error } = await supabaseClient.from("todos").update(newTodo).eq("id", newTodo.id);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onMutate: async (newTodo) => {
        // We are NOT cancelling the request to delete the todo, we are cancelling
        // any requests to REFETCH the todos. We will always want to refetch the
        // once after any set of mutations.
        await queryClient.cancelQueries(["todos"]);
        const previous = queryClient.getQueryData(["todos"]);

        queryClient.setQueryData(["todos"], (old) => {
          return old.map((todo) => {
            if (todo.id === newTodo.id) {
              return { ...todo, ...newTodo };
            }
            return todo;
          });
        });

        return {
          previous,
        };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(["todos"], context.previous);
      },
      onSettled: (newTodo, error, variables, options) => {
        // Refetch the todos after the mutation is done.
        queryClient.invalidateQueries(["todos"]);
      },
    }
  );
  const { mutate: deleteTodo } = useMutation(
    async (todoId) => {
      const { data, error } = await supabaseClient.from("todos").delete().eq("id", todoId);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onMutate: async (todoId) => {
        // We are NOT cancelling the request to delete the todo, we are cancelling
        // any requests to REFETCH the todos. We will always want to refetch the
        // once after any set of mutations.
        await queryClient.cancelQueries(["todos"]);
        const previous = queryClient.getQueryData(["todos"]);

        // We optimistically update the todos by removing the todo that is being deleted.
        queryClient.setQueryData(
          ["todos"],
          todos.filter((todo) => todo.id !== todoId)
        );

        return {
          previous,
        };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(["todos"], context.previous);
      },
      onSettled: (newTodo, error, variables, options) => {
        // Refetch the todos after the mutation is done.
        queryClient.invalidateQueries(["todos"]);
      },
    }
  );

  if (todos === undefined || todos.length === 0) {
    return (
      <div className="flex justify-center justi">
        <p className="py-4">You don't have any todos yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div>
      {todos
        .sort((a, b) => DateTime.fromISO(a.due_on).toMillis() - DateTime.fromISO(b.due_on).toMillis())
        .map((todo) => {
          return (
            <Todo
              key={todo.id}
              id={todo.id}
              defaultTitle={todo.title}
              defaultCompleted={todo.completed}
              dueOn={todo.due_on}
              completed={todo.completed}
              onRequestEdit={updateTodo}
              onRequestDelete={deleteTodo}
              className="p-4"
            />
          );
        })}
    </div>
  );
};

export default Todos;
