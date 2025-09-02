import { profile } from "../content";
export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-slate-600">{profile.summary}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Links</h3>
          <ul className="space-y-1">
            {profile.links.map((l) => (
              <li key={l.href}>
                <a
                  className="hover:underline"
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p>
            <a className="hover:underline" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
