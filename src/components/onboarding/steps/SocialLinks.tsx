import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TikTokAccountInput from "./TikTokAccountInput";
import GMVInput from "./GMVInput";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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

  const handleGMVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    const formattedValue = parts.length > 2 ? `${parts[0]}.${parts[1]}` : value;
    
    const number = parseFloat(formattedValue);
    if (!isNaN(number)) {
      const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(number);
      updateFormData({ gmv: formatted });
    } else if (formattedValue === '') {
      updateFormData({ gmv: '' });
    }
  };

  const validateTikTokUrl = (url: string): boolean => {
    return url.toLowerCase().includes('tiktok.com');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate TikTok URL format
    if (!validateTikTokUrl(formData.tiktokAccounts[0].url)) {
      toast({
        title: "Invalid TikTok URL",
        description: "Please enter a valid TikTok URL (must include tiktok.com)",
        variant: "destructive",
      });
      return;
    }

    onNext();
  };

  const isValid = formData.tiktokAccounts[0]?.url && 
                  validateTikTokUrl(formData.tiktokAccounts[0].url) &&
                  formData.tiktokAccounts[0]?.niche && 
                  formData.gmv;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">Social Media Links</h2>

      {formData.tiktokAccounts.map((account: any, index: number) => (
        <TikTokAccountInput
          key={index}
          account={account}
          index={index}
          isRemovable={index > 0}
          onUpdate={updateTikTokAccount}
          onRemove={removeTikTokAccount}
        />
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

      <GMVInput value={formData.gmv} onChange={handleGMVChange} />

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