import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const NavBar = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { data: user } = useQuery(["user"], async () => {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) throw new Error(error.message);
    return data;
  });

  return (
    <nav className="navbar bg-base-100 px-8">
      <div className="navbar-start">
        <p className="font-bold text-xl">Todo</p>
      </div>
      <div className="navbar-end">
        {user ? (
          <button
            onClick={async () => {
              await supabaseClient.auth.signOut();
              router.push("/login");
            }}
            className="btn btn-secondary rounded-btn"
          >
            Logout
          </button>
        ) : (
          <div className="flex gap-2">
            <Link href="/register">
              <button className="btn btn-primary rounded-btn">Register</button>
            </Link>
            <Link href="/login">
              <button className="btn btn-primary btn-outline rounded-btn">Login</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
