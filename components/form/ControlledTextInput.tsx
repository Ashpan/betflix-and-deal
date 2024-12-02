import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const ControlledTextInput = <TFieldValues extends FieldValues>({
  form,
  name,
  placeholder,
  label,
  description,
}: {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  placeholder?: string;
  label?: string;
  description?: string;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input placeholder={placeholder ?? ""} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ControlledTextInput;
