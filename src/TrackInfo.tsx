import { h } from "preact";
import TrackMetadata from "./server/track";

/**
 * Display a track in a div block with title, author and optionally listener count.
 * @param track The track metadata to display.
 */
export default function Track({
  track,
  listeners,
}: {
  track: TrackMetadata;
  listeners?: number;
}) {
  return (
    <div class="flex flex-col justify-between text-white overflow-y-hidden">
      <a class="text-xl text-red truncate" href={ !!track.href ? track.href : "#" }>{track.title}</a>
      <p class="truncate">{track.artist}</p>
      {listeners === undefined || <p>Listeners: {listeners}</p>}
    </div>
  );
}