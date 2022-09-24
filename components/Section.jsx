import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, { px = "md", py = "md", radius = "md" }) => {
  return {
    wrapper: {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]}`,

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

export default function Section({ px, py, radius, style, className, children }) {
  const { classes, cx } = useStyles({ px, py, radius });
  return (
    <div style={style} className={cx(classes.wrapper, className)}>
      {children}
    </div>
  );
}
