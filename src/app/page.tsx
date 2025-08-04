import { Calculator } from "@/components/calculator";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 antialiased">
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary font-headline">Calcify</h1>
        <Calculator />
      </div>
    </main>
  );
}
