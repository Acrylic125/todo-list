import { Alert, clsx, Space, Stack, Text } from "@mantine/core";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Section from "../Section";
import CreateTodo from "./CreateTodo";
import Todo from "./Todo";

export default function Todos({ style, className }) {
  /**
   * We need to store the todos as a state rather than using the returned data
   * from the useQuery hook because we need to update the todos when the user
   * updates or deletes a todo for optimistic update.
   */
  const { supabaseClient } = useSessionContext();
  const queryClient = useQueryClient();
  const { data: todosData } = useQuery(["todos"], async () => {
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
  const todos = todosData || [];

  const { mutate: createTodo } = useMutation(
    async (newTodo) => {
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();
      if (userError) {
        throw new userError();
      }
      if (!user) {
        throw new Error("No user found");
      }

      const { data, error } = await supabaseClient.from("todos").insert({ title: newTodo.title, user_id: user.id });
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

        // console.log(newTodo);
        queryClient.setQueryData(["todos"], (old) => {
          return [
            ...old,
            {
              id: Math.random(),
              title: newTodo.title,
              completed: false,
              isLoading: true,
            },
          ];
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

  return (
    <Stack style={style} className={className}>
      <Section>
        <Text className="font-bold">Create a todo</Text>
        <Space h="md" />
        <CreateTodo
          onRequestCreateTodo={(title) => {
            createTodo({
              title,
            });
          }}
        />
      </Section>
      {todos?.length > 0 ? (
        todos
          .sort((a, b) => {
            if (a.isLoading) {
              return -1;
            }
            return new Date(b.created_at) - new Date(a.created_at);
          })
          .map(({ id, title, created_at, completed, isLoading }) => (
            <Todo
              key={id}
              id={id}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
              title={title}
              canEdit={!isLoading}
              completed={completed}
              createdAt={created_at}
              className={isLoading ? "opacity-20" : ""}
            />
          ))
      ) : (
        <Alert title="No Todos Yet">
          Create your first todo by typing out what you want to do then click {'"'}Add{'"'}.
        </Alert>
      )}
    </Stack>
  );
}
