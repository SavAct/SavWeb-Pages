interface SrcAndBlob {
  src: string;
  blob: Blob;
}

interface UrlMap {
  [key: string]: SrcAndBlob | number;
}
const urlMap: UrlMap = {};

async function downloadFile(url: string, maxFileSize: number) {
  const response = await fetch(url);
  if (response.ok) {
    const blob = await response.blob();
    if (blob.size > maxFileSize) {
      return maxFileSize;
    } else {
      return blob;
    }
  } else {
    throw new Error(
      `Download failed: ${response.status} ${response.statusText}`
    );
  }
}

async function getFile(
  url: string,
  maxFileSize: number
): Promise<undefined | SrcAndBlob> {
  try {
    const blob = await downloadFile(url, maxFileSize);
    if (typeof blob !== "number") {
      const blob_str = URL.createObjectURL(blob);
      const bs = { src: blob_str, blob };
      urlMap[url] = bs;
      return bs;
    } else {
      urlMap[url] = blob;
    }
  } catch (error) {
    console.error(`Download error on ${url}`, error);
  }
  return undefined;
}

/**
 * Get a file from a URL and caches it in urlMap
 * @param url URL of the file to get
 * @param maxFileSize Maximum file size in bytes
 * @returns blob URL of the file
 */
export async function GetUrlFile(
  url: string,
  maxFileSize: number = 262144
): Promise<undefined | SrcAndBlob> {
  if (url in urlMap) {
    const blobUrl = urlMap[url];
    if (typeof blobUrl === "number") {
      if (maxFileSize > blobUrl) {
        // Check again if maxFileSize is now higher than before
        return await getFile(url, maxFileSize);
      }
    } else {
      return blobUrl;
    }
  } else {
    return await getFile(url, maxFileSize);
  }
  return undefined;
}
