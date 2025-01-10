import React, { useState } from "react";
import { BasicInfo } from "./steps/BasicInfo";
import { SocialLinks } from "./steps/SocialLinks";
import { Profile } from "./steps/Profile";
import { Progress } from "@/components/ui/progress";

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

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

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
            onSubmit={() => console.log("Form submitted:", formData)}
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingForm;