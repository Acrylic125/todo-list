import { Button, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaEllipsisV } from "react-icons/fa";

export default function UserBanPopover({ revokeBan, banId }) {
  const [opened, { close, open }] = useDisclosure(false);

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
                  if (revokeBan) {
                    revokeBan(banId);
                  }
                }}
                fullWidth
                compact
                variant="subtle"
                color="gray"
              >
                <p>Revoke Ban</p>
              </Button>
            </div>
          </Popover.Dropdown>
        </Popover>
      </div>
    </>
  );
}
