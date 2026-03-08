"use client";

const EXAMPLE_DREAMS = [
  {
    label: "Chase dream",
    text: "I was running through a city I didn't recognize. The streets kept changing direction. Someone was chasing me but I couldn't see who. I kept trying to find a door to hide behind but every door was locked. My legs felt heavy, like I was running through water. I finally found an alley and hid behind a dumpster, and then I woke up with my heart pounding.",
  },
  {
    label: "Teeth falling out",
    text: "I was at a dinner party with people from work. I was talking and suddenly felt something loose in my mouth. I reached in and pulled out a tooth. Then another one came loose. I tried to keep talking normally but teeth kept falling out into my hand. Nobody else seemed to notice. I went to the bathroom and looked in the mirror and my mouth was full of gaps. I felt this deep sense of shame.",
  },
  {
    label: "Flying dream",
    text: "I was standing on a hill overlooking the ocean at sunset. I realized I could fly. I just leaned forward and lifted off the ground. It felt completely natural, like I'd always known how. I flew over the water and could see dolphins below. The wind was warm. I kept going higher and could see the whole coastline. I felt completely free and peaceful. I didn't want to come down.",
  },
];

interface ExampleDreamsProps {
  onSelect: (text: string) => void;
}

export default function ExampleDreams({ onSelect }: ExampleDreamsProps) {
  return (
    <div className="mt-12">
      <p className="text-dream-muted text-sm mb-3">Try an example:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {EXAMPLE_DREAMS.map((dream) => (
          <button
            key={dream.label}
            onClick={() => onSelect(dream.text)}
            className="px-4 py-2 bg-dream-surface border border-dream-muted/20 rounded-full text-sm text-dream-muted hover:text-dream-text hover:border-dream-primary/50 transition-colors"
          >
            {dream.label}
          </button>
        ))}
      </div>
    </div>
  );
}
