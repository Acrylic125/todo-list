import { Alert, Space, Stack, Text } from "@mantine/core";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import Section from "../Section";
import CreateTodo from "./CreateTodo";
import Todo from "./Todo";

export default function Todos({ defaultTodos, style, className }) {
  const { supabaseClient } = useSessionContext();
  const [todos, setTodos] = useState(defaultTodos);
  const queryClient = useQueryClient();
  const fetchTodos = async () => {
    const { data, error } = await supabaseClient.from("todos").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  const { mutate: createTodo } = useMutation({
    mutationFn: async ({ todo }) => {
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

      const { data, error } = await supabaseClient.from("todos").insert({ title: todo, user_id: user.id });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async () => {
      const fetched = await fetchTodos();
      setTodos(fetched);
    },
  });
  const { mutate: updateTodo } = useMutation(
    async (options) => {
      const { data, error } = await supabaseClient.from("todos").update(options).eq("id", options.id);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onMutate: async (options) => {
        await queryClient.cancelQueries(["update-todos", options.id]);
        const previous = queryClient.getQueryData(["update-todos", options.id]);
        queryClient.setQueryData(["update-todos", options.id], options);

        return {
          previous,
          options,
        };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(["update-todos", context.options.id], context.previous);
      },
      onSettled: (newTodo, error, variables, options) => {
        queryClient.invalidateQueries(["update-todos", options.options.id]);
      },
    }
  );
  const { mutate: deleteTodo } = useMutation(
    async (options) => {
      const { data, error } = await supabaseClient.from("todos").delete().eq("id", options.id);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onMutate: async (options) => {
        await queryClient.cancelQueries(["delete-todos", options.id]);
        const previous = queryClient.getQueryData(["delete-todos", options.id]);
        queryClient.setQueryData(["delete-todos", options.id], options);

        return {
          previous,
          options,
        };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(["delete-todos", context.options.id], context.previous);
      },
      onSettled: (newTodo, error, variables, options) => {
        queryClient.invalidateQueries(["delete-todos", options.options.id]);
      },
    }
  );

  return (
    <Stack style={style} className={className}>
      <Section>
        <Text className="font-bold">Create a todo</Text>
        <Space h="md" />
        <CreateTodo
          onRequestCreateTodo={(todo) => {
            createTodo({
              todo,
            });
          }}
        />
      </Section>
      {todos?.length > 0 ? (
        todos
          .sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
          })
          .map(({ id, title, created_at, completed }) => (
            <Todo
              key={id}
              id={id}
              onDelete={() => {
                deleteTodo({ id });
                setTodos(todos.filter((todo) => todo.id !== id));
              }}
              onUpdate={(options) => {
                updateTodo({
                  id,
                  ...options,
                });
              }}
              defaultTitle={title}
              defaultCompleted={completed}
              defaultCreatedAt={new Date(created_at)}
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
