"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Field } from "@/components/ui/field"

type DatePickerWithRangeProps = {
  from: Date
  to: Date
  onFromChange: (date: Date) => void
  onToChange: (date: Date) => void
}

export function DatePickerWithRange(props: DatePickerWithRangeProps) {
  const [from, setFrom] = React.useState<Date>(props.from)
  const [to, setTo] = React.useState<Date>(props.to)

  return (
    <Field className="w-fit" orientation="horizontal">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" id="date-picker-range" className="justify-start px-2.5 font-normal"><CalendarIcon data-icon="inline-start" />{from ? (
            to ? (
              <>
                {format(from, "LLL dd, y")} -{" "}
                {format(to, "LLL dd, y")}
              </>
            ) : (
              format(from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}</Button>} />
        <PopoverContent className="w-auto p-0" align="center">
          <div className="flex">
            {/* Start date */}
            <div>
              <div className="px-4 py-2 text-sm font-medium">
                Start date
              </div>

              <Calendar
                mode="single"
                selected={from}
                onSelect={setFrom}
                captionLayout="dropdown"
                required
              />
            </div>

            {/* End date */}
            <div>
              <div className="px-4 py-2 text-sm font-medium">
                End date
              </div>

              <Calendar
                mode="single"
                selected={to}
                onSelect={setTo}
                captionLayout="dropdown"
                required
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        variant={from && to && from < to ? "default" : "destructive"}
        onClick={() => {
          if (from && to && from < to) {
            props.onFromChange(from)
            props.onToChange(to)
          }
        }}
      >
        Apply
      </Button>
    </Field>
  )
}
