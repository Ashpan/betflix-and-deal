"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ControlledTextInput from "@/components/form/ControlledTextInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { User } from "@supabase/supabase-js";

const FormSchema = z.object({
  sessionId: z.string().length(4, {
    message: "Session ID must be 4 characters.",
  }),
});

const JoinSessionForm = ({ user }: { user?: User }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sessionId: "",
    },
  });
  const { handleSubmit } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    console.log(user);
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <ControlledTextInput
          form={form}
          name="sessionId"
          label="Session ID"
          description="This is the unique identifier for the session you want to join."
        />
        <Button type="submit">Join Session</Button>
      </form>
    </Form>
  );
};

export default JoinSessionForm;
