import NavBar from "./nav/NavBar";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen w-full">
      <NavBar />
      <main className="grow overflow-y-auto">{children}</main>
    </div>
  );
}
