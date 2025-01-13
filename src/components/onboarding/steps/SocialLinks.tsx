import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";

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

interface SocialLinksProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
}) => {
  const addTikTokAccount = () => {
    updateFormData({
      tiktokAccounts: [...formData.tiktokAccounts, { url: "", niche: "" }],
    });
  };

  const removeTikTokAccount = (index: number) => {
    const newAccounts = formData.tiktokAccounts.filter((_: any, i: number) => i !== index);
    updateFormData({ tiktokAccounts: newAccounts });
  };

  const updateTikTokAccount = (index: number, field: string, value: string) => {
    const newAccounts = formData.tiktokAccounts.map((account: any, i: number) =>
      i === index ? { ...account, [field]: value } : account
    );
    updateFormData({ tiktokAccounts: newAccounts });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const isValid = formData.tiktokAccounts[0]?.url && 
                  formData.tiktokAccounts[0]?.niche && 
                  formData.gmv;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">Social Media Links</h2>

      {formData.tiktokAccounts.map((account: any, index: number) => (
        <div key={index} className="space-y-4 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">TikTok Account {index + 1}</h3>
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTikTokAccount(index)}
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
                onChange={(e) => updateTikTokAccount(index, "url", e.target.value)}
                className="form-input"
                placeholder="https://tiktok.com/@username"
                required={index === 0}
              />
            </div>

            <div>
              <label className="form-label">Account Niche</label>
              <Select
                value={account.niche}
                onValueChange={(value) => updateTikTokAccount(index, "niche", value)}
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
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addTikTokAccount}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another TikTok Account
      </Button>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <label className="form-label">Total TikTok Shop GMV</label>
        <div className="text-sm text-muted-foreground mb-2">
          Enter your total GMV across all TikTok Shop accounts
        </div>
        <Input
          value={formData.gmv}
          onChange={(e) => updateFormData({ gmv: e.target.value })}
          className="form-input"
          placeholder="Enter your total TikTok Shop GMV"
          required
        />
      </div>

      <div>
        <label className="form-label">Instagram (Optional)</label>
        <Input
          value={formData.instagram}
          onChange={(e) => updateFormData({ instagram: e.target.value })}
          className="form-input"
          placeholder="https://instagram.com/username"
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          onClick={onPrev}
          className="form-button-secondary flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="form-button flex-1"
          disabled={!isValid}
        >
          Next
        </Button>
      </div>
    </form>
  );
};