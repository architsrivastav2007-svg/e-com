const statusClasses = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
  Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const OrderStatusBadge = ({ status }) => {
  const classes = statusClasses[status] || statusClasses.Pending;

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${classes}`}>{status}</span>;
};

export default OrderStatusBadge;
