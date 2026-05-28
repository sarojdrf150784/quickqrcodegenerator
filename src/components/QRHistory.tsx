import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { History, Trash2, RotateCcw, Download, FolderPlus, Folder, FolderOpen, Pencil, MoreVertical, Check, X } from "lucide-react";
import { toast } from "sonner";
import QRFrame from "./QRFrame";

interface QRHistoryItem {
  id: string;
  template_type: string;
  template_data: Record<string, unknown>;
  qr_value: string;
  fg_color: string;
  bg_color: string;
  size: number;
  label: string | null;
  logo_data_url: string | null;
  folder_id: string | null;
  border_style: string | null;
  design_preset: string | null;
  created_at: string;
}

interface QRFolder {
  id: string;
  name: string;
}

interface QRHistoryProps {
  onRegenerate: (item: QRHistoryItem) => void;
}

const ALL = "__all__";
const UNFILED = "__unfiled__";

const QRHistory = ({ onRegenerate }: QRHistoryProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedFolder, setSelectedFolder] = useState<string>(ALL);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  const { data: folders = [] } = useQuery({
    queryKey: ["qr-folders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qr_folders")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data as QRFolder[];
    },
    enabled: !!user,
  });

  const { data: history = [], isLoading } = useQuery({
    queryKey: ["qr-history", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qr_codes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as QRHistoryItem[];
    },
    enabled: !!user,
  });

  const filtered = history.filter((i) => {
    if (selectedFolder === ALL) return true;
    if (selectedFolder === UNFILED) return !i.folder_id;
    return i.folder_id === selectedFolder;
  });

  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from("qr_folders")
        .insert([{ user_id: user!.id, name }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-folders"] });
      setNewFolderName("");
      setCreatingFolder(false);
      toast.success("Folder created");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("qr_folders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-folders"] });
      queryClient.invalidateQueries({ queryKey: ["qr-history"] });
      setSelectedFolder(ALL);
      toast.success("Folder deleted");
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: { label?: string | null; folder_id?: string | null } }) => {
      const { error } = await supabase.from("qr_codes").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-history"] });
    },
    onError: (err: Error) => toast.error(err.message),
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
      ctx?.drawImage(img, 0, 0, item.size, item.size);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `qrcode-${item.label || item.template_type}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const startEdit = (item: QRHistoryItem) => {
    setEditingId(item.id);
    setEditingLabel(item.label || "");
  };

  const saveEdit = (id: string) => {
    updateItemMutation.mutate(
      { id, patch: { label: editingLabel || null } },
      {
        onSuccess: () => {
          setEditingId(null);
          toast.success("Label updated");
        },
      },
    );
  };

  if (!user) return null;

  return (
    <Card className="shadow-lg border-border/50 backdrop-blur-sm bg-card/95">
      <CardHeader className="pb-3 space-y-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="w-5 h-5 text-primary" />
          History
        </CardTitle>

        <div className="flex items-center gap-2">
          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
            <SelectTrigger className="h-9 flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All QR codes</SelectItem>
              <SelectItem value={UNFILED}>Unfiled</SelectItem>
              {folders.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setCreatingFolder((v) => !v)}
            title="New folder"
          >
            <FolderPlus className="w-4 h-4" />
          </Button>
          {selectedFolder !== ALL && selectedFolder !== UNFILED && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-destructive"
              onClick={() => deleteFolderMutation.mutate(selectedFolder)}
              title="Delete folder"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {creatingFolder && (
          <div className="flex gap-2">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newFolderName.trim()) {
                  createFolderMutation.mutate(newFolderName.trim());
                }
              }}
              className="h-9"
            />
            <Button
              size="sm"
              onClick={() => newFolderName.trim() && createFolderMutation.mutate(newFolderName.trim())}
              disabled={!newFolderName.trim()}
            >
              Add
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No QR codes here yet.
            </p>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => {
                const folder = folders.find((f) => f.id === item.folder_id);
                const isEditing = editingId === item.id;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="shrink-0">
                      <QRFrame borderStyle={item.border_style || "none"} fgColor={item.fg_color} bgColor={item.bg_color}>
                        <QRCodeSVG
                          id={`qr-history-${item.id}`}
                          value={item.qr_value}
                          size={item.size}
                          level="H"
                          fgColor={item.fg_color}
                          bgColor={item.bg_color}
                          style={{ width: 44, height: 44 }}
                          imageSettings={
                            item.logo_data_url
                              ? { src: item.logo_data_url, height: item.size * 0.2, width: item.size * 0.2, excavate: true }
                              : undefined
                          }
                        />
                      </QRFrame>
                    </div>
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={editingLabel}
                            onChange={(e) => setEditingLabel(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveEdit(item.id)}
                            className="h-7 text-sm"
                            autoFocus
                          />
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => saveEdit(item.id)}>
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingId(null)}>
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium capitalize truncate">
                            {item.label || item.template_type}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {folder ? (
                              <>
                                <FolderOpen className="w-3 h-3" />
                                <span className="truncate">{folder.name}</span>
                                <span>·</span>
                              </>
                            ) : null}
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                          </div>
                        </>
                      )}
                    </div>
                    {!isEditing && (
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => startEdit(item)}>
                              <Pencil className="w-3.5 h-3.5 mr-2" />
                              Rename label
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs">Move to folder</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                updateItemMutation.mutate({ id: item.id, patch: { folder_id: null } })
                              }
                            >
                              <Folder className="w-3.5 h-3.5 mr-2" />
                              No folder
                            </DropdownMenuItem>
                            {folders.map((f) => (
                              <DropdownMenuItem
                                key={f.id}
                                onClick={() =>
                                  updateItemMutation.mutate({ id: item.id, patch: { folder_id: f.id } })
                                }
                              >
                                <Folder className="w-3.5 h-3.5 mr-2" />
                                {f.name}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => deleteMutation.mutate(item.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QRHistory;
