import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface VCardFormProps {
  data: {
    firstName: string;
    lastName: string;
    organization: string;
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  onChange: (data: any) => void;
}

export const VCardForm = ({ data, onChange }: VCardFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            value={data.firstName}
            onChange={(e) => onChange({ ...data, firstName: e.target.value })}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            value={data.lastName}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization">Organization</Label>
        <Input
          id="organization"
          placeholder="Company Name"
          value={data.organization}
          onChange={(e) => onChange({ ...data, organization: e.target.value })}
          className="h-11"
        />
      </div>

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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://example.com"
          value={data.website}
          onChange={(e) => onChange({ ...data, website: e.target.value })}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="123 Main St, City, State, ZIP"
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          className="h-11"
        />
      </div>
    </div>
  );
};

export const formatVCard = (data: VCardFormProps["data"]) => {
  if (!data.firstName && !data.lastName) return "";
  
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  let vcard = "BEGIN:VCARD\n";
  vcard += "VERSION:3.0\n";
  vcard += `FN:${fullName}\n`;
  vcard += `N:${data.lastName};${data.firstName};;;\n`;
  
  if (data.organization) vcard += `ORG:${data.organization}\n`;
  if (data.phone) vcard += `TEL:${data.phone}\n`;
  if (data.email) vcard += `EMAIL:${data.email}\n`;
  if (data.website) vcard += `URL:${data.website}\n`;
  if (data.address) vcard += `ADR:;;${data.address};;;;\n`;
  
  vcard += "END:VCARD";
  return vcard;
};
