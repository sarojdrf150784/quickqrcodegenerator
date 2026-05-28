import { Label } from "@/components/ui/label";
import { DESIGN_PRESETS, BORDER_STYLES } from "@/lib/qrPresets";
import { cn } from "@/lib/utils";

interface QRStylePickerProps {
  designPreset: string | null;
  borderStyle: string;
  onPresetChange: (id: string, fg: string, bg: string) => void;
  onBorderChange: (id: string) => void;
}

const QRStylePicker = ({ designPreset, borderStyle, onPresetChange, onBorderChange }: QRStylePickerProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Design Preset</Label>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {DESIGN_PRESETS.map((p) => {
            const active = designPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPresetChange(p.id, p.fg, p.bg)}
                className={cn(
                  "shrink-0 rounded-lg border-2 transition-all p-1.5 flex flex-col items-center gap-1 w-16",
                  active ? "border-primary shadow-md" : "border-border/50 hover:border-border",
                )}
                title={p.label}
              >
                <div
                  className="w-10 h-10 rounded grid place-items-center"
                  style={{ background: p.bg }}
                >
                  <div className="w-5 h-5 rounded-sm" style={{ background: p.fg }} />
                </div>
                <span className="text-[10px] font-medium truncate w-full text-center">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Border Style</Label>
        <div className="grid grid-cols-4 gap-2">
          {BORDER_STYLES.map((b) => {
            const active = borderStyle === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onBorderChange(b.id)}
                className={cn(
                  "rounded-md border-2 p-2 flex flex-col items-center gap-1.5 transition-all",
                  active ? "border-primary bg-primary/5" : "border-border/50 hover:border-border",
                )}
                title={b.label}
              >
                <BorderPreview id={b.id} />
                <span className="text-[10px] font-medium truncate w-full text-center">{b.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const BorderPreview = ({ id }: { id: string }) => {
  const box = "w-7 h-7 bg-muted-foreground/20";
  if (id === "none") return <div className={box} />;
  if (id === "simple") return <div className={`${box} border border-foreground rounded-sm`} />;
  if (id === "thick") return <div className={`${box} border-[3px] border-foreground rounded-sm`} />;
  if (id === "rounded") return <div className={`${box} rounded-lg shadow-md`} />;
  if (id === "dashed") return <div className={`${box} border-2 border-dashed border-foreground rounded-sm`} />;
  if (id === "double") return <div className={`${box} border-4 border-double border-foreground`} />;
  if (id === "scanme")
    return (
      <div className="flex flex-col items-center">
        <div className="w-7 h-5 border-2 border-foreground" />
        <div className="w-7 h-2 bg-foreground text-[6px] text-background grid place-items-center font-bold">SCAN</div>
      </div>
    );
  if (id === "corners")
    return (
      <div className="relative w-7 h-7">
        <span className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-foreground" />
        <span className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-foreground" />
        <span className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-foreground" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-foreground" />
      </div>
    );
  return null;
};

export default QRStylePicker;
