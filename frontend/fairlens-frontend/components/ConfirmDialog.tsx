"use client";

export default function ConfirmDialog({
  open,
  title,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>{title}</h3>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-3 py-1 border rounded text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 text-white rounded"
            style={{ background: "var(--accent-blue)" }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

