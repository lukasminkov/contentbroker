import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface ProfileProps {
  formData: any;
  updateFormData: (data: any) => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  formData,
  updateFormData,
  onPrev,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({ profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>

      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={formData.profilePicture} />
            <AvatarFallback className="bg-muted">
              {formData.firstName?.[0]}
              {formData.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute bottom-0 right-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <div>
        <label className="form-label">About (Optional)</label>
        <Textarea
          value={formData.about}
          onChange={(e) => updateFormData({ about: e.target.value })}
          className="form-input min-h-[100px]"
          placeholder="Tell us about yourself..."
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
        >
          Complete
        </Button>
      </div>
    </form>
  );
};