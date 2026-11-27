import { HOME_FEATURES } from "@/lib/home-content";

export function FeaturesStrip() {
  return (
    <div className="z-10 relative -mt-6 container-page">
      <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-4 bg-ink-800 shadow-black/50 shadow-xl p-4 border border-white/10 rounded-3xl">
        {HOME_FEATURES.map((feature) => (
          <div key={feature.title} className="flex items-start gap-3 hover:bg-white/5 p-3 rounded-2xl transition">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${feature.tone}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                {feature.icon}
              </svg>
            </span>
            <div>
              <p className="font-bold text-stone-800 text-sm">{feature.title}</p>
              <p className="mt-1 text-stone-500 text-xs leading-5">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}