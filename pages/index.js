import { useState } from "react";
import { withPageAuth, getUser } from "@supabase/auth-helpers-nextjs";
import { Button, TextInput } from "@mantine/core";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
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

const Index = ({}) => {
  
  // console.log(user);
  return (
    <div>
      {/* Welcome {user.email}!{" "} */}
      <Button onClick={() => supabaseClient.auth.signOut()} variant="light">
        <a>Logout</a>
      </Button>
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

export default Index;
