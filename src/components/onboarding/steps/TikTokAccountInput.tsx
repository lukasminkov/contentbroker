import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus } from "lucide-react";

const NICHES = [
  "Nutrition",
  "Fitness",
  "Tech",
  "Reviews",
  "Personal Brand",
  "Beauty",
  "Fashion",
  "Gaming",
  "Education",
  "Entertainment",
  "Lifestyle",
  "Travel",
  "Business",
  "General",
];

interface TikTokAccount {
  url: string;
  niche: string;
}

interface TikTokAccountInputProps {
  account: TikTokAccount;
  index: number;
  isRemovable: boolean;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const TikTokAccountInput: React.FC<TikTokAccountInputProps> = ({
  account,
  index,
  isRemovable,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="space-y-4 p-4 bg-muted rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">TikTok Account {index + 1}</h3>
        {isRemovable && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="text-destructive hover:text-destructive/80"
          >
            <Minus className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="form-label">Account URL</label>
          <Input
            value={account.url}
            onChange={(e) => onUpdate(index, "url", e.target.value)}
            className="form-input"
            placeholder="https://tiktok.com/@username"
            required={index === 0}
          />
        </div>

        <div>
          <label className="form-label">Account Niche</label>
          <Select
            value={account.niche}
            onValueChange={(value) => onUpdate(index, "niche", value)}
          >
            <SelectTrigger className="form-input">
              <SelectValue placeholder="Select a niche" />
            </SelectTrigger>
            <SelectContent>
              {NICHES.map((niche) => (
                <SelectItem key={niche} value={niche.toLowerCase()}>
                  {niche}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TikTokAccountInput;