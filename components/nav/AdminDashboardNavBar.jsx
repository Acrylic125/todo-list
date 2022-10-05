import { createStyles, Group, Navbar, Text } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

const useStyles = createStyles((theme, _params, getRef) => {
  return {
    header: {
      marginBottom: theme.spacing.md * 1.5,
      fontSize: theme.fontSizes.xl,
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },

    linkIcon: {
      color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
      },
    },
  };
});

const data = [
  { link: "/users", label: "Users" },
  { link: "/users/bans", label: "Bans" },
];

export default function AdminDashboarNavBar({ defaultActive }) {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(defaultActive);

  const links = data.map((item) => (
    <Link href={item.link} key={item.label}>
      <span
        onClick={(event) => {
          setActive(item.label);
        }}
        className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      >
        {item.label}
      </span>
    </Link>
  ));

  return (
    <Navbar height={700} width={{ sm: 300 }} p="md">
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <Text weight="bold">Users</Text>
        </Group>
        {links}
      </Navbar.Section>
    </Navbar>
  );
}
