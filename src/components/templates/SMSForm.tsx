import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SMSFormProps {
  data: {
    phone: string;
    message: string;
  };
  onChange: (data: any) => void;
}

export const SMSForm = ({ data, onChange }: SMSFormProps) => {
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Pre-filled SMS message..."
          value={data.message}
          onChange={(e) => onChange({ ...data, message: e.target.value })}
          rows={4}
          className="resize-none"
        />
      </div>
    </div>
  );
};

export const formatSMS = (data: SMSFormProps["data"]) => {
  if (!data.phone) return "";
  
  let sms = `sms:${data.phone}`;
  if (data.message) {
    sms += `?body=${encodeURIComponent(data.message)}`;
  }
  
  return sms;
};
