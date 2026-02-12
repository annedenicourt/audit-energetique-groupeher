import React from "react";
import Modal from "react-modal";

type AppModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
};

export default function AppModal({
  isOpen,
  onClose,
  title,
  children,
  className,
  overlayClassName,
}: AppModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      contentLabel={title ?? "Modal"}
      className={
        className ??
        "bg-white rounded-xl shadow-xl max-w-5xl w-[96vw] max-h-[95vh] overflow-auto outline-none p-4"
      }
      overlayClassName={
        overlayClassName ??
        "fixed inset-0 bg-black/60 flex items-center justify-center p-4"
      }
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-sm font-semibold">{title}</div>
        <button
          type="button"
          onClick={onClose}
          className="px-2 py-1 text-xs border border-slate-300 rounded-md"
        >
          Fermer
        </button>
      </div>

      {children}
    </Modal>
  );
}
