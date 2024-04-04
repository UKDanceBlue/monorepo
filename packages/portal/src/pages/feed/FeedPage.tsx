import { ImagePicker } from "@elements/components/ImagePicker";

export function FeedPage() {
  return <ImagePicker onSelect={(uuid) => console.log(uuid)} />;
}
