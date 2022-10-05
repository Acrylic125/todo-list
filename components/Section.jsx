import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, { variant = "filled", px = "md", py = "md", radius = "md" }) => {
  return {
    wrapper: {
      backgroundColor: variant === "filled" ? (theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]) : "transparent",
      border: variant === "outline" && `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]}`,

      // Padding
      paddingLeft: theme.spacing[px],
      paddingRight: theme.spacing[px],
      paddingTop: theme.spacing[py],
      paddingBottom: theme.spacing[py],

      // Radius
      borderRadius: theme.radius[radius],
    },
  };
});

export default function Section({ variant, px, py, radius, style, className, children }) {
  const { classes, cx } = useStyles({ variant, px, py, radius });
  return (
    <div style={style} className={cx(classes.wrapper, className)}>
      {children}
    </div>
  );
}
