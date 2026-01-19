import Button from "@/app/(landing)/components/ui/button";
import Modal from "../ui/modal";
import ImageUploadPreview from "../ui/image-upload-preview";
import { useEffect, useState } from "react";
import Image from "next/image";
import priceFormatter from "@/app/utils/price-formatter";
import { FiCheck, FiX } from "react-icons/fi";
import { Product, Transaction } from "@/app/types";
import { getProductDetail } from "@/app/services/product.service";
import { getImageUrl } from "@/app/lib/api";
import { toast } from "react-toastify";

type TTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onStatusChange: (id: string, status: "paid" | "rejected") => Promise<void>;
};

const TransactionModal = ({
  isOpen,
  onClose,
  transaction,
  onStatusChange,
}: TTransactionModalProps) => {
  const [updating, setUpdating] = useState(false);

  if (!transaction) return null;

  const handleStatusUpdate = async (status: "paid" | "rejected") => {
    try {
      setUpdating(true);
      await onStatusChange(transaction._id, status);
      toast.success("Status updated successfully");
      onClose();
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Transactions">
      <div className="flex gap-6 w-full">
        <div className="min-w-[200px]">
          <h4 className="font-semibold text-sm mb-2">Payment Proof</h4>
          {transaction.paymentProof ? (
            <Image
              src={getImageUrl(transaction.paymentProof)}
              alt="payment proof"
              width={200}
              height={401}
            />
          ) : (
            <div className="text-center p-4">
              <p className="text-sm">No payment proof uploaded</p>
            </div>
          )}
        </div>
        <div className="w-full">
          <h4 className="font-semibold text-sm mb-2">Order Details</h4>
          <div className="bg-gray-100 rounded-md flex flex-col gap-2.5 p-4  text-sm mb-5">
            <div className="flex justify-between font-medium">
              <div className="opacity-50">Date</div>
              <div className="text-right">
                {new Date(transaction.createdAt).toLocaleString("id-ID", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </div>
            </div>
            <div className="flex justify-between font-medium">
              <div className="opacity-50">Customer</div>
              <div className="text-right">{transaction.customerName}</div>
            </div>
            <div className="flex justify-between font-medium">
              <div className="opacity-50">Contact</div>
              <div className="text-right">{transaction.customerContact}</div>
            </div>
            <div className="flex justify-between gap-10 font-medium">
              <div className="opacity-50 whitespace-nowrap">
                Shipping Address
              </div>
              <div className="text-right">{transaction.customerAddress}</div>
            </div>
          </div>

          <h4 className="font-semibold text-sm mb-2">Items Purchased</h4>

          <div className="space-y-3">
            {transaction.purchasedItems.map((item, index) => (
              <div
                className="border border-gray-200 rounded-lg p-2 flex items-center gap-2"
                key={index}
              >
                <div className="bg-gray-100 rounded aspect-square w-8 h-8">
                  <Image
                    src={getImageUrl(item.productId.imageUrl)}
                    width={30}
                    height={30}
                    alt="product image"
                  />
                </div>
                <div className="font-medium text-sm">{item.productId.name}</div>
                <div className="font-medium ml-auto text-sm">{item.qty}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between  text-sm mt-6">
            <h4 className="font-semibold">Total </h4>
            <div className="text-primary font-semibold">
              {priceFormatter(parseInt(transaction.totalPayment))}
            </div>
          </div>
          <div className=" flex justify-end gap-5 mt-12">
            <Button
              className="text-primary! bg-primary-light! rounded-md"
              size="small"
              onClick={() => handleStatusUpdate("rejected")}
              disabled={updating}
            >
              <FiX size={20} />
              <span>{updating ? "Updating..." : "Reject"}</span>
            </Button>
            <Button
              className="text-white! bg-[#50C252]! rounded-md"
              size="small"
              onClick={() => handleStatusUpdate("paid")}
              disabled={updating}
            >
              <FiCheck size={20} />
              <span>{updating ? "Updating..." : "Approve"}</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionModal;