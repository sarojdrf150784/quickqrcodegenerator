import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface URLFormProps {
  data: {
    url: string;
  };
  onChange: (data: any) => void;
}

export const URLForm = ({ data, onChange }: URLFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={data.url}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          className="h-11"
        />
        <p className="text-sm text-muted-foreground">
          Make sure to include https:// or http://
        </p>
      </div>
    </div>
  );
};

export const formatURL = (data: URLFormProps["data"]) => {
  return data.url || "";
};
