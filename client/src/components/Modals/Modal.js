export default function Modal({ isOpen, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-xl">{children}</div>
    </div>
  );
}
