import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EmailFormProps {
  data: {
    email: string;
    subject: string;
    body: string;
  };
  onChange: (data: any) => void;
}

export const EmailForm = ({ data, onChange }: EmailFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="contact@example.com"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject (Optional)</Label>
        <Input
          id="subject"
          placeholder="Email subject"
          value={data.subject}
          onChange={(e) => onChange({ ...data, subject: e.target.value })}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Message (Optional)</Label>
        <Textarea
          id="body"
          placeholder="Pre-filled message..."
          value={data.body}
          onChange={(e) => onChange({ ...data, body: e.target.value })}
          rows={4}
          className="resize-none"
        />
      </div>
    </div>
  );
};

export const formatEmail = (data: EmailFormProps["data"]) => {
  if (!data.email) return "";
  
  let mailto = `mailto:${data.email}`;
  const params = [];
  
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
  
  if (params.length > 0) {
    mailto += `?${params.join("&")}`;
  }
  
  return mailto;
};
