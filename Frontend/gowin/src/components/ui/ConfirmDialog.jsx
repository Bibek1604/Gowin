import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from './Modal';

/** Yes/No confirmation. `danger` styles the confirm button red (deletes). */
const ConfirmDialog = ({ open, title = 'Are you sure?', message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false, loading = false, onConfirm, onCancel }) => (
  <Modal open={open} onClose={loading ? undefined : onCancel} title={title} size="sm"
    footer={
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50">
          {cancelLabel}
        </button>
        <button type="button" onClick={onConfirm} disabled={loading}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60 ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1E3A8A] hover:bg-[#172554]'}`}>
          {loading ? 'Working…' : confirmLabel}
        </button>
      </div>
    }
  >
    <div className="flex gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-50 text-red-500' : 'bg-[#1E3A8A]/8 text-[#1E3A8A]'}`}>
        {danger ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
    </div>
  </Modal>
);

export default ConfirmDialog;
