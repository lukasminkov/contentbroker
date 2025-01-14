import React, { useState, useEffect } from "react";
import { BasicInfo } from "./steps/BasicInfo";
import { SocialLinks } from "./steps/SocialLinks";
import { Profile } from "./steps/Profile";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const OnboardingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    tiktokAccounts: [{ url: "", niche: "" }],
    gmv: "",
    gmvProof: null,
    instagram: "",
    profilePicture: null,
    about: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Save form data to Supabase
  const saveFormData = async (data: typeof formData) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to save your profile",
          variant: "destructive",
        });
        return false;
      }

      // Enhanced validation for required fields
      if (!data.firstName || !data.lastName) {
        console.log("Validation failed - name fields missing");
        return false;
      }

      // Validate date format
      const dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
      if (!dateOfBirth || isNaN(dateOfBirth.getTime())) {
        console.log("Validation failed - invalid date format");
        return false;
      }

      console.log("Saving profile with data:", {
        userId: session.session.user.id,
        email: session.session.user.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Save profile data
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .upsert({
          user_id: session.session.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          date_of_birth: data.dateOfBirth,
          profile_picture_url: data.profilePicture,
          about: data.about,
          instagram_url: data.instagram,
          gmv: data.gmv ? parseFloat(data.gmv.replace(/,/g, "")) : null,
          gmv_proof_url: data.gmvProof,
          email: session.session.user.email,
        })
        .select()
        .single();

      if (profileError) {
        console.error("Profile save error:", profileError);
        throw profileError;
      }

      // Save TikTok accounts only if we have valid profile data and accounts
      if (profileData?.id && data.tiktokAccounts.length > 0 && data.tiktokAccounts[0].url) {
        const { error: tiktokError } = await supabase
          .from("tiktok_accounts")
          .upsert(
            data.tiktokAccounts.map((account) => ({
              profile_id: profileData.id,
              url: account.url,
              niche: account.niche,
            }))
          );

        if (tiktokError) {
          console.error("TikTok accounts save error:", tiktokError);
          throw tiktokError;
        }
      }

      console.log("Form data saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving form data:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Auto-save when form data changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (Object.values(formData).some((value) => value !== "")) {
        saveFormData(formData);
      }
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [formData]);

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    const success = await saveFormData(formData);
    if (success) {
      toast({
        title: "Success",
        description: "Your profile has been saved successfully!",
      });
      navigate("/dashboard");
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-8">
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="form-card">
        {step === 1 && (
          <BasicInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        )}
        {step === 2 && (
          <SocialLinks
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}
        {step === 3 && (
          <Profile
            formData={formData}
            updateFormData={updateFormData}
            onPrev={prevStep}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingForm;