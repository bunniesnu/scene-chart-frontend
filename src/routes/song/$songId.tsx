import { createFileRoute } from '@tanstack/react-router'

import { $api } from '@/api';
import { getImgUrl } from '@/utils/img';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Badge } from '@/components/ui/badge';
import { formatDate } from 'date-fns';
import { formatTime } from '@/utils/format';

export const Route = createFileRoute('/song/$songId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { songId } = Route.useParams()
  const songs = $api.useQuery(
    "get",
    "/artist/songs",
  )
  const song = songs.data?.songs.find((song) => song.song_id === songId)
  if (!song) {
    return <div className="w-full flex flex-col items-center justify-center gap-4 p-4">
      <Item variant="outline" className="w-full">
        <ItemContent>
          <ItemTitle className="text-2xl font-medium">
            Song Not Found
          </ItemTitle>
          <ItemDescription>The song with ID {songId} was not found.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  }
  return <div className="w-full flex flex-col items-center justify-center gap-4 p-4">
    <Item variant="outline" className="w-full">
      {song.album_cover_url && <ItemMedia variant="image" className="w-1/4 h-fit">
        <img src={getImgUrl(song.album_cover_url, 'm')} className="w-full" />
      </ItemMedia>}
      <ItemContent>
        <ItemTitle className="text-2xl font-medium">
          {song.is_title_song && <Badge variant="secondary" className="text-xs text-center min-w-11">TITLE</Badge>}
          {song.title}
        </ItemTitle>
        <ItemDescription>{song.album_name}</ItemDescription>
        {song.issue_date && <ItemDescription>{formatDate(new Date(song.issue_date), "yyyy-MM-dd")}</ItemDescription>}
        {song.play_time && <ItemDescription>{formatTime(song.play_time)}</ItemDescription>}
      </ItemContent>
    </Item>
  </div>
}
