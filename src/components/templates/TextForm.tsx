import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextFormProps {
  data: {
    text: string;
  };
  onChange: (data: any) => void;
}

export const TextForm = ({ data, onChange }: TextFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Your Text</Label>
        <Textarea
          id="text"
          placeholder="Enter any text, numbers, or data..."
          value={data.text}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
          rows={6}
          className="resize-none"
        />
        <p className="text-sm text-muted-foreground">
          Any text or data you enter will be encoded in the QR code
        </p>
      </div>
    </div>
  );
};

export const formatText = (data: TextFormProps["data"]) => {
  return data.text || "";
};
