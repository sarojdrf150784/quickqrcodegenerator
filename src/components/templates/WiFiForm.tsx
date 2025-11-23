import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface WiFiFormProps {
  data: {
    ssid: string;
    password: string;
    encryption: string;
    hidden: boolean;
  };
  onChange: (data: any) => void;
}

export const WiFiForm = ({ data, onChange }: WiFiFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ssid">Network Name (SSID)</Label>
        <Input
          id="ssid"
          placeholder="My WiFi Network"
          value={data.ssid}
          onChange={(e) => onChange({ ...data, ssid: e.target.value })}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter WiFi password"
          value={data.password}
          onChange={(e) => onChange({ ...data, password: e.target.value })}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="encryption">Encryption Type</Label>
        <Select
          value={data.encryption}
          onValueChange={(value) => onChange({ ...data, encryption: value })}
        >
          <SelectTrigger id="encryption" className="h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA">WPA/WPA2</SelectItem>
            <SelectItem value="WEP">WEP</SelectItem>
            <SelectItem value="nopass">None</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="hidden">Hidden Network</Label>
        <Switch
          id="hidden"
          checked={data.hidden}
          onCheckedChange={(checked) => onChange({ ...data, hidden: checked })}
        />
      </div>
    </div>
  );
};

export const formatWiFi = (data: WiFiFormProps["data"]) => {
  if (!data.ssid) return "";
  return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};H:${data.hidden};;`;
};
