import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BasicInfoProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}

export const BasicInfo: React.FC<BasicInfoProps> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const isValid = formData.firstName && formData.lastName && formData.dateOfBirth;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">Basic Information</h2>
      
      <div>
        <label htmlFor="firstName" className="form-label">
          First Name
        </label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => updateFormData({ firstName: e.target.value })}
          className="form-input"
          placeholder="Enter your first name"
          required
        />
      </div>

      <div>
        <label htmlFor="lastName" className="form-label">
          Last Name
        </label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => updateFormData({ lastName: e.target.value })}
          className="form-input"
          placeholder="Enter your last name"
          required
        />
      </div>

      <div>
        <label htmlFor="dob" className="form-label">
          Date of Birth
        </label>
        <Input
          id="dob"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
          className="form-input"
          required
        />
      </div>

      <Button
        type="submit"
        className="form-button w-full"
        disabled={!isValid}
      >
        Next
      </Button>
    </form>
  );
};