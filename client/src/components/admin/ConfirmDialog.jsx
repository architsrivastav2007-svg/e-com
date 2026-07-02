const ConfirmDialog = ({ open, title, description, confirmLabel = 'Delete', cancelLabel = 'Cancel', loading = false, onConfirm, onCancel }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/30">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">Confirm Action</p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            {loading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;