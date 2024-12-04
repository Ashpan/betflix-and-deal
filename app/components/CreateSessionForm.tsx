"use client";

import ControlledNumberInput from "@/components/form/ControlledNumberInput";
import ControlledTextInput from "@/components/form/ControlledTextInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createSession } from "@/lib/supabase/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  buyIn: z.coerce.number().gt(0, {
    message: "Buy-In amount must be greater than 0.",
  }),
});

export const CreateSessionForm = ({ user }: { user: User }) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      buyIn: 5,
    },
  });
  const { handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const payload = {
      name: data.name,
      buy_in_amount: data.buyIn,
      code: code,
      created_by: user.id,
    };
    const { data: response, error } = await createSession(payload);
    if (error) {
      console.error(error);
      return toast({
        title: "Error",
        description: "There was an error creating the session.",
      });
    } else {
      toast({
        title: "Success",
        description: "Session created successfully.",
      });
      form.reset();
      redirect(`/session/${code}/lobby`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <ControlledTextInput
          form={form}
          name="name"
          label="Name of Session"
          description="This is the name of the session that will be displayed to other players."
        />
        <ControlledNumberInput
          form={form}
          name="buyIn"
          label="Amount for initial Buy-In"
          description="This is the amount of money that each player will need to pay to join the session."
        />
        <Button type="submit">Create Session</Button>
      </form>
    </Form>
  );
};
