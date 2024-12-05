"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ControlledTextInput from "@/components/form/ControlledTextInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { User } from "@supabase/supabase-js";
import { joinSession } from "@/lib/supabase/queries";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FormSchema = z.object({
  sessionId: z.string().length(6, {
    message: "Session ID must be 6 characters.",
  }),
});

export const JoinSessionForm = ({ user }: { user?: User }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sessionId: "",
    },
  });
  const { handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { data: res, error } = await joinSession(data.sessionId);
    if (error) {
      console.error(error);
      return toast({
        title: "Error",
        description: "Unable to join session.",
      });
    } else {
      toast({
        title: "Success",
        description: "Session joined successfully.",
      });
      form.reset();
      redirect(`/session/${data.sessionId}/lobby`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join a Session</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
