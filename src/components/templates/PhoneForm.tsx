import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PhoneFormProps {
  data: {
    phone: string;
  };
  onChange: (data: any) => void;
}

export const PhoneForm = ({ data, onChange }: PhoneFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          className="h-11"
        />
        <p className="text-sm text-muted-foreground">
          Include country code for best results (e.g., +1 for US)
        </p>
      </div>
    </div>
  );
};

export const formatPhone = (data: PhoneFormProps["data"]) => {
  if (!data.phone) return "";
  return `tel:${data.phone}`;
};
