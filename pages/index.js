import { Button, Center } from "@mantine/core";
import { useSessionContext } from "@supabase/auth-helpers-react";
import React from "react";
import Todos from "../components/todo/Todos";
import banProtected from "../utils/banProtected";
import withPageAuthWrap from "../utils/withPageAuthWrap";

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
        <Todos className="w-3/4 max-w-7xl" />
      </Center>
    </div>
  );
};

/**
 * We will not be prefetching the data here because as suggested by the NextJS docs,
 * https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#when-should-i-use-getserversideprops
 *
 * we should not be prefetching data that is not required for the initial page load.
 *
 * Furthermore, client side rendering is preferred if the data fetched
 * is frequently updated which is the case with our todos.
 * https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#fetching-data-on-the-client-side
 */
export const getServerSideProps = withPageAuthWrap({}, [banProtected()]);

export default Index;
