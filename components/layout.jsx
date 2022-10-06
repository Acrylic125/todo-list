import NavBar from "./nav/NavBar";

export default function Layout({ user, children }) {
  return (
    <div className="flex flex-col h-screen w-full">
      <NavBar user={user} />
      <main className="grow overflow-y-auto">{children}</main>
    </div>
  );
}
