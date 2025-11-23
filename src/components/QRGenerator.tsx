import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

const QRGenerator = () => {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");

  const handleDownload = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

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
          link.download = "qrcode.png";
          link.click();
          URL.revokeObjectURL(url);
          toast.success("QR Code downloaded successfully!");
        }
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              QR Code Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create custom QR codes instantly. Enter any text, URL, or data and generate a
            professional QR code with customizable colors and size.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          {/* Controls Panel */}
          <Card className="shadow-lg border-border/50 backdrop-blur-sm bg-card/95">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text-input" className="text-base font-semibold">
                  Enter Your Data
                </Label>
                <Input
                  id="text-input"
                  type="text"
                  placeholder="Enter URL, text, or any data..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="text-base h-12 transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
                <p className="text-sm text-muted-foreground">
                  Try a URL like https://example.com or any text
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size-slider" className="text-base font-semibold">
                  Size: {size}px
                </Label>
                <Slider
                  id="size-slider"
                  min={128}
                  max={512}
                  step={32}
                  value={[size]}
                  onValueChange={(value) => setSize(value[0])}
                  className="py-4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fg-color" className="text-base font-semibold">
                    Foreground
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="fg-color"
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-16 h-12 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="flex-1 h-12"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bg-color" className="text-base font-semibold">
                    Background
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-16 h-12 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 h-12"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDownload}
                disabled={!text}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 disabled:opacity-50"
              >
                <Download className="w-5 h-5 mr-2" />
                Download QR Code
              </Button>
            </CardContent>
          </Card>

          {/* QR Code Display */}
          <Card className="shadow-lg border-border/50 backdrop-blur-sm bg-card/95">
            <CardContent className="pt-6 flex items-center justify-center min-h-[400px]">
              {text ? (
                <div className="p-8 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-xl">
                  <QRCodeSVG
                    id="qr-code"
                    value={text}
                    size={size}
                    level="H"
                    fgColor={fgColor}
                    bgColor={bgColor}
                    className="transition-all duration-300"
                  />
                </div>
              ) : (
                <div className="text-center space-y-4 px-8">
                  <div className="w-32 h-32 mx-auto rounded-xl bg-muted/50 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                  <p className="text-lg text-muted-foreground">
                    Enter some data to generate your QR code
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground animate-in fade-in duration-700 delay-300">
          <p>
            Created with precision • Scan with any QR code reader • Works with URLs, text,
            and more
          </p>
        </footer>
      </div>
    </div>
  );
};

export default QRGenerator;
