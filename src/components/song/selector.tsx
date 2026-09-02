import { useState } from "react"
import {
  Check,
  ChevronsUpDown,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import type { Song } from "@/types/chart";

interface SongSelectorPropsMultiple {
  songs: Song[]
  value: string[]
  onValueChange: (songId: string) => void
}

interface SongSelectorPropsSingle {
  songs: Song[]
  value: string
  onValueChange: (songId: string) => void
}

export function SongSelectorMultiple({
  songs,
  value,
  onValueChange,
}: SongSelectorPropsMultiple) {
  const selectedSongs = songs.filter((song) => value.includes(song.song_id))
  const message = selectedSongs.length === 0 ? "Select songs..." : `${selectedSongs.length} songs selected`
  return <SongSelector
    songs={songs}
    value={value}
    onValueChange={onValueChange}
    message={message}
    closeOnSelect={false}
  />
}

export function SongSelectorSingle({
  songs,
  value,
  onValueChange,
}: SongSelectorPropsSingle) {
  const selectedSong = songs.find((song) => song.song_id === value)
  const message = selectedSong ? selectedSong.title : "Select a song..."
  return <SongSelector
    songs={songs}
    value={value}
    onValueChange={onValueChange}
    message={message}
    closeOnSelect={true}
  />
}

interface SongSelectorProps {
  songs: Song[]
  value: string | string[]
  onValueChange: (songId: string) => void
  message: string
  closeOnSelect: boolean
}

function SongSelector({
  songs,
  value,
  onValueChange,
  message,
  closeOnSelect,
}: SongSelectorProps) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {message}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="center"
      >
        <Command>
          <CommandInput placeholder="Search songs..." />
          <CommandList>
            <CommandEmpty>No songs found.</CommandEmpty>
            <CommandGroup>
              {songs.map((song) => (
                <CommandItem
                  key={song.song_id}
                  value={`${song.title}`}
                  onSelect={() => {
                    closeOnSelect && setOpen(false)
                    onValueChange(song.song_id)
                  }}
                >
                  <div className="flex min-w-full items-center gap-3">
                    {song.album_cover_url && (
                      <img
                        src={song.album_cover_url}
                        alt=""
                        className="size-10 shrink-0 rounded"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {song.title}
                      </p>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto size-4",
                        (Array.isArray(value) ? value.includes(song.song_id) : value === song.song_id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}