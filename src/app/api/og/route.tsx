import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Aditya Jadhav Portfolio";
  const subtitle = searchParams.get("subtitle") || "Engineer, Builder, Explorer";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#06060b",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              background: "#00c8e0",
              borderRadius: "50%",
            }}
          />
          <span
            style={{
              color: "#00c8e0",
              fontSize: "28px",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            Aditya Jadhav
          </span>
        </div>
        <div
          style={{
            color: "#e8e8ec",
            fontSize: title.length > 40 ? "56px" : "72px",
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#8888a0",
            fontSize: "32px",
            marginTop: "24px",
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
