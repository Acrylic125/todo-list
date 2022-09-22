import React, { useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import useUser from "../components/user-provider/useUser";
import { useRouter } from "next/router";
import { getSupabase, supabase } from "../utils/supabase-client";
import { useMutation } from "react-query";
import Link from "next/link";
// import { useSession } from "../hooks/useSession";

function TodoInput() {
  const [todo, setTodo] = useState("");

  return (
    <div className="flex flex-row">
      <TextInput value={todo} onChange={(e) => setTodo(e.currentTarget.value)} placeholder="Add a todo" />
      <Button variant="light">Add</Button>
    </div>
  );
}

const Index = ({ user }) => {
  React.useEffect(() => {
    supabase.auth.getSession().then((s) => {
      console.log(s);
    });
    supabase
      .from("profiles")
      .select("*")
      .then((s) => {
        console.log(s);
      });
  }, []);
  return (
    <div>
      <Link href="/api/auth/logout">
        <Button variant="light">Logout</Button>
      </Link>

      <TodoInput />
      {/* {todos?.length > 0 ? todos.map((todo) => <p key={todo.id}>{todo.content}</p>) : <p>You have completed all todos!</p>} */}
    </div>
  );
};

// export const getServerSideProps = withPageAuth({
//   redirectTo: "/login",
//   async getServerSideProps(ctx) {
//     // Access the user object
//     const { user } = await getUser(ctx);
//     console.log(user);
//     return { props: { user } };
//   },
// });

/** @type {import("next").GetServerSideProps} */
export async function getServerSideProps({ req }) {
  // console.log(req.cookies["refresh_token"]);
  // const { data: user, error } = await supabase.auth.getUser(req.cookies["access_token"]);
  // console.log(user);
  console.log(req.cookies["access_token"]);
  // supabase.auth.setSession(req.cookies["access_token"]);

  // console.log(req.cookies["access_token"]);
  const client = getSupabase(req.cookies["access_token"]);
  console.log(await client.auth.getSession());

  // const {
  //   data: { session },
  // } = await client.auth.getSession();
  // console.log(session);
  // if (user === null) {
  //   return {
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }
  // supabase.auth.admin.
  // const session = await supabase.auth.setSession(req.cookies["refresh_token"]);
  // console.log(session);

  // const todo = await client.from("profiles").select("*");
  // console.log(todo);
  // console.log(await supabase.auth.getSession());
  // const { data: user, error } = await supabase.auth.getUser();
  // console.log(user);

  // console.log(user);
  // if (!user) {
  //   return { props: {}, redirect: { destination: "/sign-in" } };
  // }

  // return { props: { user } };
  // supabase.auth.setSession()
  // console.log(access_token);

  return {
    props: {
      // todo: todo.data || null,
      // user: session.user || null,
    },
  };
}

export default Index;
