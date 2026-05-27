import { NewVentureForm } from "./new-venture-form";

export const metadata = {
  title: "نشر فكرة جديدة",
};

export default function NewVenturePage() {
  return (
    <div className="container-narrow py-8">
      <div className="mb-8">
        <h1 className="heading-display text-3xl font-bold text-ink mb-2">
          انشر فكرتك
        </h1>
        <p className="text-ink-muted">
          اكتب الفكرة بوضوح. كلما كانت الأطروحة محددة، كانت الطلبات أكثر جدية.
        </p>
      </div>
      <div className="surface-card p-6 sm:p-8">
        <NewVentureForm />
      </div>
    </div>
  );
}
