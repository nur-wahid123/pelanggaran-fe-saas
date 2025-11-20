import ENDPOINT from "@/config/url";
import heic2any from 'heic2any'
import { axiosInstance } from "./request.util";

export function toTitleCase(str: string): string {
  return str
    .replace(/-/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );
}

export function truncateName(name: string, limit: number): string {
  const words = name.split(" ");

  // If only one word, don't truncate
  if (words.length === 1) {
    return name;
  }

  // Step 1: Try initial truncation from the end
  let result = words
    .map((word, index) => (index === words.length - 1 ? word[0] + "." : word))
    .join(" ");

  // Step 2: If still too long, start reducing earlier words
  for (let i = words.length - 2; i >= 0 && result.length > limit; i--) {
    words[i] = words[i][0] + ".";
    result = words.join(" ");
  }

  return result;
}

export function changeFavicon(iconUrl: string) {
  if (!iconUrl) return;

  // Find existing favicon link element
  const favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  if (favicon) {
    favicon.href = iconUrl;
  } else {
    // Create a new favicon link if not exists
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = iconUrl;
    document.head.appendChild(link);
  }
}

export async function getImage(imageLinkId: number){
  let imageId:number = 0;
  await axiosInstance.get(`${ENDPOINT.LIST_IMAGE}/${imageLinkId}`).then((res)=>{
    const result:number[] = res.data.data
    imageId = result[0]
  })
  return imageId;
}

export async function getImages(imageLinkId: number){
  let imageId:number[] = [];
  await axiosInstance.get(`${ENDPOINT.LIST_IMAGE}/${imageLinkId}`).then((res)=>{
    const result:number[] = res.data.data
    imageId = result
  })
  return imageId;
}

export function setDocumentTitle(title: string, prefix: string): void {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    document.title = `${title} - ${prefix}`;
  }
}

export async function convertHeic(file: File): Promise<File> {
  const blob = await heic2any({
      blob: file,
      toType: "image/jpeg",
  });

  return new File(
      [blob as Blob],
      file.name.replace(/\.heic$/i, ".jpg"),
      { type: "image/jpeg" }
  );
}


