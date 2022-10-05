import { Center } from "@mantine/core";
import AdminDashboarNavBar from "../nav/AdminDashboardNavBar";

export default function UsersDashboardLayout({ defaultActive, children }) {
  return (
    <div className="flex flex-row">
      <AdminDashboarNavBar defaultActive={defaultActive} />
      <Center px="sm" py="md" className="w-full h-full">
        {children}
      </Center>
    </div>
  );
}
