import CreateTodo from "../components/todo/CreateTodo";
import Todos from "../components/todo/Todos";
import banProtected from "../utils/banProtected";
import withPageAuthWrap from "../utils/withPageAuthWrap";

const Page = () => {
  return (
    <div className="w-full flex flex-col gap-4 max-w-7xl mx-auto px-4">
      <h1 className="font-bold text-lg px-4">My Todos</h1>
      <CreateTodo className="px-4" />
      <Todos />
    </div>
  );
};

export default Page;

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
