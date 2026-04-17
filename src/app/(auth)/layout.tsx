export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            XOrithm
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Server Status Dashboard
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
