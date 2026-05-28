import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Sparkles, Wifi, User, Mail, Phone, MessageSquare, Link2, Type, Save, LogOut, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AuthDialog from "./AuthDialog";
import QRHistory from "./QRHistory";
import { WiFiForm, formatWiFi } from "./templates/WiFiForm";
import { VCardForm, formatVCard } from "./templates/VCardForm";
import { EmailForm, formatEmail } from "./templates/EmailForm";
import { PhoneForm, formatPhone } from "./templates/PhoneForm";
import { SMSForm, formatSMS } from "./templates/SMSForm";
import { URLForm, formatURL } from "./templates/URLForm";
import { TextForm, formatText } from "./templates/TextForm";

type TemplateType = "text" | "url" | "wifi" | "vcard" | "email" | "phone" | "sms";

const QRGenerator = () => {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>("url");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [label, setLabel] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [textData, setTextData] = useState({ text: "" });
  const [urlData, setUrlData] = useState({ url: "" });
  const [wifiData, setWifiData] = useState({ ssid: "", password: "", encryption: "WPA", hidden: false });
  const [vcardData, setVcardData] = useState({
    firstName: "", lastName: "", organization: "", phone: "", email: "", website: "", address: "",
  });
  const [emailData, setEmailData] = useState({ email: "", subject: "", body: "" });
  const [phoneData, setPhoneData] = useState({ phone: "" });
  const [smsData, setSmsData] = useState({ phone: "", message: "" });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) {
      toast.error("Logo must be under 500KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const getTemplateData = () => {
    switch (activeTemplate) {
      case "text": return textData;
      case "url": return urlData;
      case "wifi": return wifiData;
      case "vcard": return vcardData;
      case "email": return emailData;
      case "phone": return phoneData;
      case "sms": return smsData;
      default: return {};
    }
  };

  const getQRValue = () => {
    switch (activeTemplate) {
      case "text": return formatText(textData);
      case "url": return formatURL(urlData);
      case "wifi": return formatWiFi(wifiData);
      case "vcard": return formatVCard(vcardData);
      case "email": return formatEmail(emailData);
      case "phone": return formatPhone(phoneData);
      case "sms": return formatSMS(smsData);
      default: return "";
    }
  };

  const qrValue = getQRValue();

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("qr_codes").insert([{
        user_id: user!.id,
        template_type: activeTemplate,
        template_data: getTemplateData() as any,
        qr_value: qrValue,
        fg_color: fgColor,
        bg_color: bgColor,
        size,
        label: label || null,
        logo_data_url: logoDataUrl,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-history"] });
      toast.success("QR code saved to history!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleRegenerate = (item: {
    template_type: string;
    template_data: Record<string, unknown>;
    fg_color: string;
    bg_color: string;
    size: number;
    label?: string | null;
    logo_data_url?: string | null;
  }) => {
    const type = item.template_type as TemplateType;
    setActiveTemplate(type);
    setFgColor(item.fg_color);
    setBgColor(item.bg_color);
    setSize(item.size);
    setLabel(item.label || "");
    setLogoDataUrl(item.logo_data_url || null);
    const d = item.template_data;
    switch (type) {
      case "text": setTextData(d as typeof textData); break;
      case "url": setUrlData(d as typeof urlData); break;
      case "wifi": setWifiData(d as typeof wifiData); break;
      case "vcard": setVcardData(d as typeof vcardData); break;
      case "email": setEmailData(d as typeof emailData); break;
      case "phone": setPhoneData(d as typeof phoneData); break;
      case "sms": setSmsData(d as typeof smsData); break;
    }
    toast.success("QR code loaded!");
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-code");
    if (!svg || !qrValue) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    canvas.width = size;
    canvas.height = size;
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `qrcode-${activeTemplate}.png`;
          link.click();
          URL.revokeObjectURL(url);
          toast.success("QR Code downloaded successfully!");
        }
      });
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const templates = [
    { id: "url", label: "URL", icon: Link2 },
    { id: "text", label: "Text", icon: Type },
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "vcard", label: "Contact", icon: User },
    { id: "email", label: "Email", icon: Mail },
    { id: "phone", label: "Phone", icon: Phone },
    { id: "sms", label: "SMS", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              QR Code Generator
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
                <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <AuthDialog />
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          {/* Controls Panel */}
          <Card className="lg:col-span-1 shadow-lg border-border/50 backdrop-blur-sm bg-card/95">
            <CardContent className="pt-6 space-y-6">
              <Tabs value={activeTemplate} onValueChange={(v) => setActiveTemplate(v as TemplateType)}>
                <TabsList className="grid grid-cols-4 lg:grid-cols-4 gap-1 h-auto p-1 bg-muted/50">
                  {templates.slice(0, 4).map((template) => {
                    const Icon = template.icon;
                    return (
                      <TabsTrigger key={template.id} value={template.id} className="flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{template.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                <TabsList className="grid grid-cols-3 gap-1 h-auto p-1 bg-muted/50 mt-1">
                  {templates.slice(4).map((template) => {
                    const Icon = template.icon;
                    return (
                      <TabsTrigger key={template.id} value={template.id} className="flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{template.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <div className="mt-4">
                  <TabsContent value="text" className="mt-0"><TextForm data={textData} onChange={setTextData} /></TabsContent>
                  <TabsContent value="url" className="mt-0"><URLForm data={urlData} onChange={setUrlData} /></TabsContent>
                  <TabsContent value="wifi" className="mt-0"><WiFiForm data={wifiData} onChange={setWifiData} /></TabsContent>
                  <TabsContent value="vcard" className="mt-0"><VCardForm data={vcardData} onChange={setVcardData} /></TabsContent>
                  <TabsContent value="email" className="mt-0"><EmailForm data={emailData} onChange={setEmailData} /></TabsContent>
                  <TabsContent value="phone" className="mt-0"><PhoneForm data={phoneData} onChange={setPhoneData} /></TabsContent>
                  <TabsContent value="sms" className="mt-0"><SMSForm data={smsData} onChange={setSmsData} /></TabsContent>
                </div>
              </Tabs>

              <div className="pt-4 border-t border-border/50 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="size-slider" className="text-base font-semibold">Size: {size}px</Label>
                  <Slider id="size-slider" min={128} max={512} step={32} value={[size]} onValueChange={(v) => setSize(v[0])} className="py-4" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Foreground</Label>
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 rounded-md border border-input cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Background</Label>
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-md border border-input cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleDownload} disabled={!qrValue} className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 disabled:opacity-50">
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>
                {user && (
                  <Button onClick={() => saveMutation.mutate()} disabled={!qrValue || saveMutation.isPending} variant="outline" className="h-12 px-4">
                    <Save className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* QR Code Display */}
          <Card className="shadow-lg border-border/50 backdrop-blur-sm bg-card/95">
            <CardContent className="pt-6 flex items-center justify-center min-h-[400px]">
              {qrValue ? (
                <div className="p-8 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-xl">
                  <QRCodeSVG id="qr-code" value={qrValue} size={Math.min(size, 300)} level="H" fgColor={fgColor} bgColor={bgColor} className="transition-all duration-300" />
                </div>
              ) : (
                <div className="text-center space-y-4 px-8">
                  <div className="w-32 h-32 mx-auto rounded-xl bg-muted/50 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold mb-2">Choose a template</p>
                    <p className="text-sm text-muted-foreground">Fill in the form to generate your QR code</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* History Panel */}
          <div className="lg:col-span-1">
            {user ? (
              <QRHistory onRegenerate={handleRegenerate} />
            ) : (
              <Card className="shadow-lg border-border/50 backdrop-blur-sm bg-card/95">
                <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px] text-center space-y-4">
                  <p className="text-muted-foreground text-sm">Sign in to save and access your QR code history</p>
                  <AuthDialog />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
