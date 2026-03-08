import { toPng, toSvg } from "html-to-image";
import { jsPDF } from "jspdf";

export async function exportAsPng(element: HTMLElement, filename: string = "swaymaps-export") {
  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 2,
    backgroundColor: "#030712",
    filter: (node) => {
      // Exclude UI controls from export
      if (node instanceof HTMLElement) {
        const cls = node.className?.toString() || "";
        if (cls.includes("react-flow__controls") || cls.includes("react-flow__minimap") || cls.includes("react-flow__attribution")) {
          return false;
        }
      }
      return true;
    },
  });

  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

export async function exportAsSvg(element: HTMLElement, filename: string = "swaymaps-export") {
  const dataUrl = await toSvg(element, {
    backgroundColor: "#030712",
    filter: (node) => {
      if (node instanceof HTMLElement) {
        const cls = node.className?.toString() || "";
        if (cls.includes("react-flow__controls") || cls.includes("react-flow__minimap") || cls.includes("react-flow__attribution")) {
          return false;
        }
      }
      return true;
    },
  });

  const link = document.createElement("a");
  link.download = `${filename}.svg`;
  link.href = dataUrl;
  link.click();
}

export async function exportAsPdf(element: HTMLElement, filename: string = "swaymaps-export") {
  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 2,
    backgroundColor: "#030712",
    filter: (node) => {
      if (node instanceof HTMLElement) {
        const cls = node.className?.toString() || "";
        if (cls.includes("react-flow__controls") || cls.includes("react-flow__minimap") || cls.includes("react-flow__attribution")) {
          return false;
        }
      }
      return true;
    },
  });

  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });

  const pdf = new jsPDF({
    orientation: img.width > img.height ? "landscape" : "portrait",
    unit: "px",
    format: [img.width / 2, img.height / 2],
  });

  pdf.addImage(dataUrl, "PNG", 0, 0, img.width / 2, img.height / 2);
  pdf.save(`${filename}.pdf`);
}

export function exportAsJson(mapData: any, filename: string = "swaymaps-export") {
  const json = JSON.stringify(mapData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = `${filename}.json`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
