import React from "react";
import { Input } from "@/components/ui/input";

interface GMVInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GMVInput: React.FC<GMVInputProps> = ({ value, onChange }) => {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <label className="form-label">Total TikTok Shop GMV</label>
      <div className="text-sm text-muted-foreground mb-2">
        Enter your total GMV across all TikTok Shop accounts
      </div>
      <div className="relative flex items-center">
        <span className="absolute left-3 text-muted-foreground">$</span>
        <Input
          value={value}
          onChange={onChange}
          className="form-input pl-7"
          placeholder="0.00"
          required
        />
      </div>
    </div>
  );
};

export default GMVInput;