import { Alert, Button, Center, Checkbox, Group, Modal, Space, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useSessionContext } from "@supabase/auth-helpers-react";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import Section from "../components/Section";

function CreateTodo({ onRequestCreateTodo, loading }) {
  const form = useForm({
    initialValues: {
      todo: "",
    },
    validate: {
      todo: (value) => (value.length > 0 ? null : "Please type out what you want to do"),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(({ todo }) => {
        if (loading) return;
        onRequestCreateTodo(todo);
      })}
      className="flex flex-row gap-4"
    >
      <TextInput className="w-full" placeholder="Add a todo" required {...form.getInputProps("todo")} />
      <Button type="submit" disabled={loading}>
        Add
      </Button>
    </form>
  );
}

function EditTodoForm({ defaultTitle, onEdit, onDelete }) {
  const form = useForm({
    initialValues: {
      title: defaultTitle,
    },
    validate: {
      title: (value) => (value.length > 0 ? null : "Please type out what you want to do"),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(({ title }) => {
        onEdit({
          title,
        });
      })}
    >
      <Stack my="md">
        <TextInput label="Title" className="w-full" placeholder="Title" required {...form.getInputProps("title")} />
        <div className="flex flex-row gap-2">
          <Button type="submit">Save</Button>
          <Button
            color="red"
            onClick={() => {
              if (onDelete) {
                onDelete();
              }
            }}
          >
            Delete
          </Button>
        </div>
      </Stack>
    </form>
  );
}

function Todo({ defaultTitle, defaultCompleted, onUpdate, onDelete, className }) {
  const [title, setTitle] = React.useState(defaultTitle);
  const [completed, setCompleted] = React.useState(defaultCompleted);
  const [editing, setEditing] = React.useState(false);

  const update = (newTodo) => {
    if (onUpdate) {
      onUpdate({ title, completed, ...newTodo });
    }
  };

  return (
    <>
      <Modal
        centered
        title="Edit todo"
        opened={editing}
        onClose={() => {
          setEditing(false);
        }}
      >
        <EditTodoForm
          defaultTitle={title}
          onDelete={() => {
            if (onDelete) {
              onDelete();
            }
          }}
          onEdit={({ title }) => {
            setTitle(title);
            update({ title });
            setEditing(false);
          }}
        />
      </Modal>
      <div
        onClick={() => {
          setEditing(true);
        }}
      >
        <Section py="sm" className={className}>
          <div className="w-full gap-4 flex flex-row ">
            <Checkbox
              checked={completed}
              onClick={(event) => {
                event.stopPropagation();
              }}
              onChange={(event) => {
                setCompleted(event.currentTarget.checked);
                update({ completed: event.currentTarget.checked });
              }}
            />
            <h5>{title}</h5>
          </div>
        </Section>
      </div>
    </>
  );
}

function Todos({ defaultTodos, style, className }) {
  const { supabaseClient } = useSessionContext();
  const [todos, setTodos] = React.useState(defaultTodos);
  const queryClient = useQueryClient();
  const fetchTodos = async () => {
    const { data, error } = await supabaseClient.from("todos").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  const { mutate: createTodo, isLoading } = useMutation({
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
        queryClient.setQueryData(["update-todos", context.options.id], context.previous);
      },
      onSettled: (newTodo, error, variables, options) => {
        queryClient.invalidateQueries(["update-todos", options.options.id]);
      },
    }
  );

  return (
    <Stack style={style} className={className}>
      <Section>
        <Text className="font-bold">Create a todo</Text>
        <Space h="md" />
        <CreateTodo
          loading={isLoading}
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

const Index = ({ todos }) => {
  const { supabaseClient } = useSessionContext();
  return (
    <div>
      <Button
        onClick={() => {
          supabaseClient.auth.signOut();
        }}
      >
        Logout
      </Button>
      <Center>
        <Todos defaultTodos={todos} className="w-3/4 max-w-7xl" />
      </Center>
    </div>
  );
};

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
  getServerSideProps: async ({ req, res }, supabaseClient) => {
    const { data: todos } = await supabaseClient.from("todos").select("*");
    return {
      props: {
        todos: todos || null,
      },
    };
  },
});

export default Index;
