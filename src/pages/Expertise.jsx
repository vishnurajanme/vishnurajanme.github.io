import { expertise } from "../content";

export default function Expertise() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold">Expertise</h1>
      <ul className="list-disc ml-6 mt-4 space-y-2">
        {expertise.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
