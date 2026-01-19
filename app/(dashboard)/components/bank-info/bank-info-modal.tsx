import Button from "@/app/(landing)/components/ui/button";
import Modal from "../ui/modal";
import ImageUploadPreview from "../ui/image-upload-preview";
import { useEffect, useState } from "react";
import { Bank } from "@/app/types";
import { createBank, updateBank } from "@/app/services/bank.service";

type TBankInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  bank?: Bank | null;
};

const BankInfoModal = ({
  isOpen,
  onClose,
  onSuccess,
  bank,
}: TBankInfoModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  useEffect(() => {
    if (bank && isOpen) {
      setFormData({
        bankName: bank.bankName,
        accountName: bank.accountName,
        accountNumber: bank.accountNumber,
      });
    } else if (isOpen) {
      setFormData({
        bankName: "",
        accountName: "",
        accountNumber: "",
      });
    }
  }, [bank, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (bank) {
        await updateBank(bank._id, formData);
      } else {
        await createBank(formData);
      }

      // Reset form
      setFormData({
        bankName: "",
        accountName: "",
        accountNumber: "",
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(
        bank ? "Failed to update bank" : "Failed to create bank",
        error,
      );
      alert(
        bank
          ? "Failed to update bank. Please try again."
          : "Failed to create bank. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!bank;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Bank Account" : "Add Bank Account"}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 w-full">
          <div className="input-group-admin">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="e. g. Mandiri, BCA, BRI"
            />
          </div>
          <div className="input-group-admin">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="123124344234234"
            />
          </div>
          <div className="input-group-admin">
            <label htmlFor="accountName">Account Name / Holder</label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              placeholder="Holder Name as registered on the account"
            />
          </div>
        </div>
        <Button
          className="ml-auto mt-3 rounded-lg"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isEditMode ? "Update Bank Account" : "Add Bank Account"}
        </Button>
      </div>
    </Modal>
  );
};

export default BankInfoModal;