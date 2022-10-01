import { Button, Center } from "@mantine/core";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useSessionContext } from "@supabase/auth-helpers-react";
import React from "react";
import Todos from "../components/todo/Todos";

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
    const {
      data: { user },
      getUserError,
    } = await supabaseClient.auth.getUser();
    if (getUserError) {
      throw getUserError;
    }
    const { data: todos } = await supabaseClient.from("todos").select("*").eq("user_id", user.id);
    return {
      props: {
        todos: todos || null,
      },
    };
  },
});

export default Index;
