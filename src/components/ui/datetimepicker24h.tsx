'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ru } from 'react-day-picker/locale';

interface DatePicker24HProps {
  placeholder?: string;
  value?: Date | null;
  onChange?: (value: Date | undefined | null) => void;
  onBlur?: () => void;
}
const hours = Array.from({ length: 24 }, (_, i) => i);

export function DateTimePicker24h({ placeholder, value, onChange, onBlur }: DatePicker24HProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange?.(selectedDate);
    }
  };

  const handleTimeChange = (type: 'hour' | 'minute', newValue: string) => {
    if (value) {
      const newDate = new Date(value);
      if (type === 'hour') {
        newDate.setHours(parseInt(newValue));
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(newValue));
      }
      onChange?.(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
          onBlur={onBlur}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPPppp', { locale: ru }) : <span>{placeholder ?? ''}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar mode="single" selected={value || undefined} onSelect={handleDateSelect} />
          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={value && value.getHours() === hour ? 'default' : 'ghost'}
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange('hour', hour.toString())}
                    onBlur={onBlur}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={value && value.getMinutes() === minute ? 'default' : 'ghost'}
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange('minute', minute.toString())}
                    onBlur={onBlur}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
