import { Button, Stack, Textarea } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import moment from "moment";

export default function BanUserForm({ isLoading, onBan }) {
  const form = useForm({
    initialValues: {
      expires: new Date(),
      time: new Date(),
      reason: "",
    },
    validate: {
      reason: (value) => (value.length >= 65535 ? "Reason must be less than 65535 characters" : null),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(({ expires, time, reason }) => {
        onBan({
          expires: moment(expires).set("hours", time.getHours()).set("minutes", time.getMinutes()).toDate(),
          reason,
        });
      })}
    >
      <Stack my="md">
        <div className="w-full gap-4 items-end flex flex-row">
          <DatePicker required className="w-full" label="Expires On" {...form.getInputProps("expires")} />
          <TimeInput required format="24" {...form.getInputProps("time")} />
        </div>
        <Textarea autosize minRows={1} maxRows={5} label="Reason" {...form.getInputProps("reason")} />
        <div>
          <Button loading={isLoading} color="red" type="submit">
            Ban User
          </Button>
        </div>
      </Stack>
    </form>
  );
}
