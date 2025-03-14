import { InputProps } from "@/components/ui";
import Input from "@/components/ui/Input";

const NumberInput = (props: InputProps) => {
  return <Input {...props} value={props.field.value} />;
};

export default NumberInput;
