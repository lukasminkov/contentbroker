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
        return;
      }

      // Save profile data
      const { error: profileError } = await supabase
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
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Save TikTok accounts
      if (data.tiktokAccounts.length > 0) {
        const { error: tiktokError } = await supabase
          .from("tiktok_accounts")
          .upsert(
            data.tiktokAccounts.map((account) => ({
              profile_id: profileError?.data?.id,
              url: account.url,
              niche: account.niche,
            }))
          );

        if (tiktokError) throw tiktokError;
      }

      console.log("Form data saved successfully");
    } catch (error) {
      console.error("Error saving form data:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
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
    await saveFormData(formData);
    navigate("/dashboard");
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