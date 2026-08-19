type LoaderProps = {
  message?: string;
};

export default function Loader({ message = "Wird geladen …" }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}
