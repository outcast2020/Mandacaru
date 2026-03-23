import { toBlob } from 'html-to-image';

export interface GeneratedCard {
  blob: Blob;
  fileName: string;
}

export async function generateCardImage(node: HTMLElement, fileName: string): Promise<GeneratedCard> {
  const blob = await toBlob(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#7c2517',
  });

  if (!blob) {
    throw new Error('card generation failed');
  }

  return {
    blob,
    fileName,
  };
}

export function downloadCardImage(card: GeneratedCard): void {
  const url = URL.createObjectURL(card.blob);
  const link = document.createElement('a');
  link.download = card.fileName;
  link.href = url;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function shareCardImage(card: GeneratedCard, shareText: string, title: string): Promise<boolean> {
  const file = new File([card.blob], card.fileName, { type: 'image/png' });

  if (navigator.canShare?.({ files: [file] }) && navigator.share) {
    await navigator.share({
      title,
      text: shareText,
      files: [file],
    });
    return true;
  }

  return false;
}
