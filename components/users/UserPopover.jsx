import { Button, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import BanUserModal from "./BanUserModal";

export default function UserPopover({ onBan, username, profileId }) {
  const [opened, { close, open }] = useDisclosure(false);
  const [modal, setModal] = useState(null);

  return (
    <>
      <div onMouseEnter={open} onMouseLeave={close}>
        <Popover opened={opened}>
          <Popover.Target>
            <span>
              <FaEllipsisV className="opacity-50" />
            </span>
          </Popover.Target>
          <Popover.Dropdown px="sm">
            <div>
              <Button
                onClick={() => {
                  setModal("ban");
                }}
                fullWidth
                compact
                variant="subtle"
                color="red"
              >
                <p>Ban User</p>
              </Button>
            </div>
          </Popover.Dropdown>
        </Popover>
      </div>

      {modal === "ban" && <BanUserModal onBan={onBan} opened onClose={() => setModal(null)} username={username} profileId={profileId} />}
    </>
  );
}
