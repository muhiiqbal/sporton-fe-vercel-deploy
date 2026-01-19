"use client";

import Button from "@/app/(landing)/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import BankInfoList from "../../components/bank-info/bank-info-list";
import BankInfoModal from "../../components/bank-info/bank-info-modal";
import { toast } from "react-toastify";
import { deleteBank, getAllBanks } from "@/app/services/bank.service";
import { Bank } from "@/app/types";
import DeleteModal from "../../components/ui/delete-modal";

const BankInfoManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<Bank | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const data = await getAllBanks();
      setBanks(data);
    } catch (error) {
      console.error("Failed to fetch banks", error);
      toast.error("Failed to fetch bank data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleAddBank = () => {
    setSelectedBank(null);
    setIsModalOpen(true);
  };

  const handleEditBank = (bank: Bank) => {
    setSelectedBank(bank);
    setIsModalOpen(true);
  };

  const handleDeleteBank = (bank: Bank) => {
    setBankToDelete(bank);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bankToDelete) return;

    try {
      await deleteBank(bankToDelete._id);
      toast.success("Bank account has been deleted");
      fetchBanks();
      setIsDeleteModalOpen(false);
      setBankToDelete(null);
    } catch (error) {
      console.error("Failed to delete bank", error);
      toast.error("Failed to delete bank account");
    }
  };

  const handleModalSuccess = () => {
    fetchBanks();
    toast.success(
      selectedBank
        ? "Bank account updated successfully"
        : "Bank account added successfully"
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-bold text-2xl">Bank Info Management</h1>
          <p className="opacity-50">
            Manage destination accounts for customer transfers.
          </p>
        </div>
        <Button className="rounded-lg" onClick={() => setIsModalOpen(true)}>
          <FiPlus size={24} />
          Add Bank Account
        </Button>
      </div>
      <BankInfoList
        onEdit={handleEditBank}
        onDelete={handleDeleteBank}
        banks={banks}
      />

      <BankInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        bank={selectedBank}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBankToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default BankInfoManagement;