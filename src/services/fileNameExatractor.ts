export default function fileNameExtractor(url: string) {
  return url.split("/").pop();
}