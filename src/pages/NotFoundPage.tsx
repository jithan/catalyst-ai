import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="max-w-lg text-center">
        <div className="text-9xl font-bold text-slate-200">404</div>
        <div className="text-3xl font-semibold text-slate-900 mt-4">Page not found</div>
        <p className="text-slate-500 mt-2">The route you requested does not exist. Choose another page from the sidebar.</p>
        <Link to="/" className="btn btn-primary mt-6 inline-block">Go home</Link>
      </div>
    </div>
  );
}
