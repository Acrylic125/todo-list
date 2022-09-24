import { Alert, Button, Center, Space, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useSessionContext } from "@supabase/auth-helpers-react";
import React from "react";
import { useMutation } from "react-query";
import Section from "../components/Section";

function CreateTodo({ onRequestCreateTodo }) {
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
        onRequestCreateTodo(todo);
      })}
      className="flex flex-row gap-4"
    >
      <TextInput className="w-full" placeholder="Add a todo" required {...form.getInputProps("todo")} />
      <Button>Add</Button>
    </form>
  );
}

function Todos({ todos, style, className }) {
  const { supabaseClient } = useSessionContext();
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
  });

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
        todos.map((todo) => <p key={todo.id}>{todo.content}</p>)
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
        <Todos todos={todos} className="w-3/4 min-w-fit max-w-7xl" />
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
