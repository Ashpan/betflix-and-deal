"use client";

import { Combobox } from "@/components/ui/combobox";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { addMemberToSession } from "@/lib/supabase/queries";
import { IMember } from "@/lib/types/types";

interface AddMemberComboboxProps {
  members: IMember[] | null;
  sessionCode: string;
}

export const AddMemberCombobox = ({
  members,
  sessionCode,
}: AddMemberComboboxProps) => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const userId = profile ? profile.id : "";

  return (
    <Combobox
      items={
        members
          ? members
              .filter((member) => member.id !== userId)
              .map((member) => ({
                label: member.display_name || member.email,
                value: member.id,
              }))
          : []
      }
      placeholder="Add member to session..."
      onSelect={async (value) => {
        const { error } = await addMemberToSession(value, sessionCode);
        if (error) {
          console.error(error);
          toast({
            title: "Error Adding Member",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Member Added",
          });
        }
      }}
    />
  );
};
