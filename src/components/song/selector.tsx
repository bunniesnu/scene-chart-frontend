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

interface SongSelectorProps {
  songs: Song[]
  value: string[]
  onValueChange: (songIds: string) => void
}

export function SongSelector({
  songs,
  value,
  onValueChange,
}: SongSelectorProps) {
  const [open, setOpen] = useState(false)

  const selectedSongs = songs.filter((song) => value.includes(song.song_id))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedSongs.length === 0
            ? "Select songs..."
            : `${selectedSongs.length} songs selected`}
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
                        value.includes(song.song_id)
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