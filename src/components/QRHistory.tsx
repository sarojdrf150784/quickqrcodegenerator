import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Trash2, RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";

interface QRHistoryItem {
  id: string;
  template_type: string;
  template_data: Record<string, unknown>;
  qr_value: string;
  fg_color: string;
  bg_color: string;
  size: number;
  label: string | null;
  created_at: string;
}

interface QRHistoryProps {
  onRegenerate: (item: QRHistoryItem) => void;
}

const QRHistory = ({ onRegenerate }: QRHistoryProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ["qr-history", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qr_codes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as QRHistoryItem[];
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("qr_codes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-history"] });
      toast.success("QR code deleted");
    },
  });

  const handleDownload = (item: QRHistoryItem) => {
    const svgEl = document.getElementById(`qr-history-${item.id}`);
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    canvas.width = item.size;
    canvas.height = item.size;
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `qrcode-${item.template_type}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (!user) return null;

  return (
    <Card className="shadow-lg border-border/50 backdrop-blur-sm bg-card/95">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="w-5 h-5 text-primary" />
          History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No saved QR codes yet. Generate and save one!
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="shrink-0 bg-white rounded p-1">
                    <QRCodeSVG
                      id={`qr-history-${item.id}`}
                      value={item.qr_value}
                      size={48}
                      level="H"
                      fgColor={item.fg_color}
                      bgColor={item.bg_color}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium capitalize truncate">
                      {item.label || item.template_type}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onRegenerate(item)}
                      title="Regenerate"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleDownload(item)}
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => deleteMutation.mutate(item.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QRHistory;
