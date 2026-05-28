import { ReactNode } from "react";

interface QRFrameProps {
  borderStyle: string;
  fgColor: string;
  bgColor: string;
  children: ReactNode;
}

const QRFrame = ({ borderStyle, fgColor, bgColor, children }: QRFrameProps) => {
  const pad = "p-3";

  if (borderStyle === "none") {
    return <div className={`${pad} inline-block`} style={{ background: bgColor }}>{children}</div>;
  }

  if (borderStyle === "simple") {
    return (
      <div className={`${pad} inline-block rounded-md`} style={{ background: bgColor, border: `1px solid ${fgColor}` }}>
        {children}
      </div>
    );
  }

  if (borderStyle === "thick") {
    return (
      <div className={`${pad} inline-block rounded-lg`} style={{ background: bgColor, border: `4px solid ${fgColor}` }}>
        {children}
      </div>
    );
  }

  if (borderStyle === "rounded") {
    return (
      <div className={`${pad} inline-block rounded-2xl shadow-xl`} style={{ background: bgColor }}>
        {children}
      </div>
    );
  }

  if (borderStyle === "dashed") {
    return (
      <div className={`${pad} inline-block rounded-md`} style={{ background: bgColor, border: `2px dashed ${fgColor}` }}>
        {children}
      </div>
    );
  }

  if (borderStyle === "double") {
    return (
      <div className={`${pad} inline-block rounded-md`} style={{ background: bgColor, border: `6px double ${fgColor}` }}>
        {children}
      </div>
    );
  }

  if (borderStyle === "scanme") {
    return (
      <div
        className="inline-block rounded-lg overflow-hidden"
        style={{ background: bgColor, border: `3px solid ${fgColor}` }}
      >
        <div className="p-3">{children}</div>
        <div
          className="text-center py-1.5 text-sm font-bold tracking-widest"
          style={{ background: fgColor, color: bgColor }}
        >
          SCAN ME
        </div>
      </div>
    );
  }

  if (borderStyle === "corners") {
    const cornerSize = 18;
    const thickness = 3;
    const cornerBase: React.CSSProperties = {
      position: "absolute",
      width: cornerSize,
      height: cornerSize,
      borderColor: fgColor,
      borderStyle: "solid",
    };
    return (
      <div className="relative inline-block p-4" style={{ background: bgColor }}>
        <span style={{ ...cornerBase, top: 0, left: 0, borderWidth: `${thickness}px 0 0 ${thickness}px` }} />
        <span style={{ ...cornerBase, top: 0, right: 0, borderWidth: `${thickness}px ${thickness}px 0 0` }} />
        <span style={{ ...cornerBase, bottom: 0, left: 0, borderWidth: `0 0 ${thickness}px ${thickness}px` }} />
        <span style={{ ...cornerBase, bottom: 0, right: 0, borderWidth: `0 ${thickness}px ${thickness}px 0` }} />
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default QRFrame;
