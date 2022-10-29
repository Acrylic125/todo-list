import NavBar from "../nav/NavBar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col w-screen h-screen">
      <NavBar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;
