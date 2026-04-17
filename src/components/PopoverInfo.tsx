import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { LucideIcon } from "lucide-react";

type SideType = "top" | "right" | "bottom" | "left"

interface PopoverProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  iconColor?: string;
  side?: SideType;
};

export function PopoverInfo({
  children,
  icon: Icon,
  iconColor,
  side,

}: PopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {Icon && <Icon className={`w-5 h-5 ${iconColor} cursor-pointer`} />}
      </PopoverTrigger>
      <PopoverContent className="w-80" side={side}>
        {children}
      </PopoverContent>
    </Popover>
  )
}
