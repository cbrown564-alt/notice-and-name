// Notice & Name's editorial content: the single source of truth for every
// concept, chapter, pathway and daily prompt. app.ts answers the view from
// here. The 22 original concepts carry the reviewed "Soft Intimate" copy; the
// figures quoted are from the studies named in each concept's `source`.

export type Phrase = { id: string; kind: string; label: string; body: string };
export type Stat = { value: string; label: string; source: string; percent: number };
export type Concept = {
  id: string; name: string; chapter: string; tagline: string; hint: string; isNew: boolean;
  definition: string; notice: string; understand: string; tryIt: string; reflect: string;
  source: string; stat: Stat; related: string[]; phrases: Phrase[];
};
export type Chapter = { id: string; name: string; blurb: string; conceptIds: string[] };
export type Pathway = { id: string; name: string; summary: string; conceptIds: string[] };
export type Prompt = { id: string; conceptId: string; text: string };

export const chapters: Chapter[] = [
  {
    "id": "map",
    "name": "The Map",
    "blurb": "The anatomy most of us were never shown.",
    "conceptIds": [
      "clitoral-structure",
      "nerve-density",
      "clitourethrovaginal",
      "internal-stimulation"
    ]
  },
  {
    "id": "curve",
    "name": "The Curve",
    "blurb": "How arousal moves through time.",
    "conceptIds": [
      "warmup-window",
      "building",
      "plateauing",
      "edging",
      "pulsing",
      "spreading"
    ]
  },
  {
    "id": "wanting",
    "name": "Wanting",
    "blurb": "Where desire comes from, and what gets in its way.",
    "conceptIds": [
      "spontaneous-desire",
      "responsive-desire",
      "brakes-accelerators",
      "non-concordance"
    ]
  },
  {
    "id": "attention",
    "name": "Attention",
    "blurb": "Where your mind is changes what your body feels.",
    "conceptIds": [
      "spectatoring",
      "embodied-presence",
      "body-appreciation",
      "sexual-self-esteem"
    ]
  },
  {
    "id": "touch",
    "name": "Touch",
    "blurb": "Named moves you can notice, repeat and ask for.",
    "conceptIds": [
      "touch-language",
      "angling",
      "rocking",
      "shallowing",
      "pairing",
      "golden-trio"
    ]
  },
  {
    "id": "saying",
    "name": "Saying It",
    "blurb": "Turning what you know into words between you.",
    "conceptIds": [
      "the-gap",
      "asking"
    ]
  }
];

export const pathways: Pathway[] = [
  {
    "id": "foundations",
    "name": "Understand My Body",
    "summary": "Start with the anatomy that makes pleasure less mysterious.",
    "conceptIds": [
      "clitoral-structure",
      "nerve-density",
      "clitourethrovaginal",
      "internal-stimulation",
      "warmup-window",
      "pairing"
    ]
  },
  {
    "id": "sensation",
    "name": "Notice What Feels Good",
    "summary": "Build language for your own sensations, timing and rhythm.",
    "conceptIds": [
      "building",
      "plateauing",
      "edging",
      "pulsing",
      "spreading",
      "touch-language"
    ]
  },
  {
    "id": "desire",
    "name": "Make Sense Of Wanting",
    "summary": "Why desire shows up when it does, and what quietly holds it back.",
    "conceptIds": [
      "spontaneous-desire",
      "responsive-desire",
      "brakes-accelerators",
      "non-concordance"
    ]
  },
  {
    "id": "presence",
    "name": "Return To Presence",
    "summary": "Name the loops that pull attention away, then practise coming back.",
    "conceptIds": [
      "spectatoring",
      "embodied-presence",
      "body-appreciation",
      "sexual-self-esteem"
    ]
  },
  {
    "id": "partner",
    "name": "Find Words For A Partner",
    "summary": "Turn what you have noticed into clear, kind requests.",
    "conceptIds": [
      "the-gap",
      "asking",
      "touch-language",
      "angling",
      "rocking",
      "shallowing",
      "golden-trio"
    ]
  }
];

export const prompts: Prompt[] = [
  {
    "id": "p1",
    "conceptId": "building",
    "text": "Notice one moment of warmth in your body today that has nothing to do with sex."
  },
  {
    "id": "p2",
    "conceptId": "embodied-presence",
    "text": "Pick one ordinary sensation, such as water on your hands, and stay with it for ten seconds."
  },
  {
    "id": "p3",
    "conceptId": "touch-language",
    "text": "When something feels pleasant today, name its pressure and its pace."
  },
  {
    "id": "p4",
    "conceptId": "brakes-accelerators",
    "text": "Notice what is pressing your brake today. You do not have to fix it."
  },
  {
    "id": "p5",
    "conceptId": "responsive-desire",
    "text": "Notice what makes you a little more open: a slower pace, a kind word, quiet."
  },
  {
    "id": "p6",
    "conceptId": "spectatoring",
    "text": "Catch one moment today when you are watching yourself instead of being in it."
  },
  {
    "id": "p7",
    "conceptId": "body-appreciation",
    "text": "Name one thing your body let you feel today."
  },
  {
    "id": "p8",
    "conceptId": "asking",
    "text": "Say one small preference out loud today, about anything at all."
  },
  {
    "id": "p9",
    "conceptId": "spreading",
    "text": "When you feel something good, notice whether it stays in one place or travels."
  },
  {
    "id": "p10",
    "conceptId": "warmup-window",
    "text": "Notice how long it takes you to settle into something pleasant, and let it take that long."
  },
  {
    "id": "p11",
    "conceptId": "sexual-self-esteem",
    "text": "Notice one thing you want today, without arguing with it."
  },
  {
    "id": "p12",
    "conceptId": "pulsing",
    "text": "Find your pulse somewhere in your body and follow it for a few beats."
  },
  {
    "id": "p13",
    "conceptId": "non-concordance",
    "text": "Notice a moment when your body and your mood are saying different things."
  },
  {
    "id": "p14",
    "conceptId": "plateauing",
    "text": "Find a moment of steady, quiet pleasure and resist the urge to move it along."
  }
];

export const concepts: Concept[] = [
  {
    "id": "clitoral-structure",
    "name": "The Whole Clitoris",
    "chapter": "map",
    "tagline": "Most of it is inside",
    "hint": "Drag down to look beneath the skin",
    "isNew": false,
    "definition": "The clitoris is more than the visible glans — a connected organ with internal parts that can be reached in different ways.",
    "notice": "Ever noticed pleasure show up deeper or wider than the little tip you can see — like the whole area is involved?",
    "understand": "The visible glans is only one part of a larger organ, which helps explain why pressure around the front wall can feel connected to clitoral pleasure. MRI and dissection mapped that internal structure at about 9 cm in total (O'Connell et al., 2005); the map is useful, but your own felt access still varies.",
    "tryIt": "Understanding this internal structure changes the picture. External stimulation matters because that's where the clitoris is most accessible—but the whole organ can be engaged from multiple angles.",
    "reflect": "When internal pressure or wider contact felt good, where did it land — and does that change what you reach for next?",
    "source": "O'Connell et al., 2005; clitoral anatomy research",
    "stat": {
      "value": "9–11 cm",
      "label": "from tip to the ends of its legs; only the glans shows",
      "source": "O'Connell et al., 2005",
      "percent": 0
    },
    "related": [
      "nerve-density",
      "clitourethrovaginal",
      "internal-stimulation"
    ],
    "phrases": [
      {
        "id": "clitoral-structure-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "Most of my clitoris is internal — so 'vaginal' pleasure and clitoral pleasure aren't really separate for me."
      },
      {
        "id": "clitoral-structure-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "There's way more clitoris than what's on the surface — pressure deeper and around it counts too."
      },
      {
        "id": "clitoral-structure-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "I know my own anatomy — if guessing isn't working, slow down and let me guide you to what reaches."
      },
      {
        "id": "clitoral-structure-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "Notice whether the parts of the clitoris beyond the obvious tip change what you feel."
      },
      {
        "id": "clitoral-structure-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "If direct touch is too much, there's a whole internal structure to work with — there's no wrong build here."
      }
    ]
  },
  {
    "id": "nerve-density",
    "name": "Nerve Density",
    "chapter": "map",
    "tagline": "Why small changes feel huge",
    "hint": "Slide the lens across the skin",
    "isNew": false,
    "definition": "How densely packed with nerve endings the clitoral glans is — intense sensitivity in a small area.",
    "notice": "Noticed how a tiny shift in pressure there can tip from perfect to too much in a second?",
    "understand": "A small change in pressure can feel enormous when touch lands on a densely sensitive area. Anatomical studies count thousands of nerve endings in the clitoral glans (O'Connell et al.), which helps explain why lighter, indirect, or well-timed touch can work better than force.",
    "tryIt": "Direct, intense touch on the glans can feel like too much, while the right touch produces intense pleasure. Sensitivity varies individually and changes with arousal level. Your nerve endings are communicating—listen to them.",
    "reflect": "When touch landed just right — or suddenly too sharp — what changed: pressure, angle, rhythm, or how aroused you already were?",
    "source": "Clitoral anatomy research; O'Connell et al.",
    "stat": {
      "value": "10,000+",
      "label": "nerve fibres reach the glans of the clitoris",
      "source": "Uloko et al., 2023",
      "percent": 0
    },
    "related": [
      "clitoral-structure",
      "pairing",
      "touch-language"
    ],
    "phrases": [
      {
        "id": "nerve-density-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "I'm extremely sensitive there — touch quality matters way more than pressure or speed."
      },
      {
        "id": "nerve-density-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Lighter and more indirect usually works better for me — small changes make a big difference."
      },
      {
        "id": "nerve-density-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If direct touch is too intense, pause and let me guide you somewhere nearby — it's sensitivity, not rejection."
      },
      {
        "id": "nerve-density-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "I'd like to notice which kinds of touch this sensitive spot actually likes."
      },
      {
        "id": "nerve-density-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "If it's sometimes too much, that's how packed with sensation that spot is — ease off with me, don't take it personally."
      }
    ]
  },
  {
    "id": "clitourethrovaginal",
    "name": "The Front Wall",
    "chapter": "map",
    "tagline": "Three tissues, one neighbourhood",
    "hint": "Tap each tissue to light it",
    "isNew": false,
    "definition": "The linked cluster of clitoris, urethra, and front vaginal wall — the anatomy behind many “G-spot” feelings.",
    "notice": "Ever felt several kinds of sensation meet in the same front-wall area — pressure, warmth, and a deeper yes together?",
    "understand": "That front-wall feeling can involve several connected tissues, which is why it may feel fuller than one isolated point. Imaging shows the clitoris, urethra, and anterior wall are physically linked (Jannini et al., 2014); explore the area without needing to find a separate organ.",
    "tryIt": "The CUV complex is a connected map, not a target to find. Notice what the whole area feels like, and let your own response matter more than a label.",
    "reflect": "When front-wall pressure felt good, what reached it — angle, ease, firmness — and did chasing a ‘spot’ help or get in the way?",
    "source": "Jannini et al., 2014; anatomical imaging studies",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "clitoral-structure",
      "internal-stimulation"
    ],
    "phrases": [
      {
        "id": "clitourethrovaginal-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "That front-wall feeling is real for me — it's connected internal tissue, not some separate magic spot."
      },
      {
        "id": "clitourethrovaginal-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Can we explore that whole connected area instead of trying to find one exact spot?"
      },
      {
        "id": "clitourethrovaginal-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "Finding that spot takes patience — if it's not happening, let's stop and not force it."
      },
      {
        "id": "clitourethrovaginal-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "I'm curious how that connected area responds to different kinds of contact for me."
      },
      {
        "id": "clitourethrovaginal-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "If we can't find a 'G-spot,' nothing's missing — it's connected tissue, and it varies for everyone."
      }
    ]
  },
  {
    "id": "internal-stimulation",
    "name": "Reaching Inside",
    "chapter": "map",
    "tagline": "Toward the front, not just deeper",
    "hint": "Drag the pressure point",
    "isNew": false,
    "definition": "Pleasure from front-wall pressure that reaches internal clitoral tissue — often what people mean by “G-spot” feeling.",
    "notice": "Sometimes pressure inside feels fuller when it reaches the front wall — not deeper, just more connected?",
    "understand": "A fuller internal feeling does not necessarily come from going deeper. Imaging and clinical work suggest many “vaginal” orgasms involve internal clitoral stimulation (Foldes & Buisson, 2009); angling helps when it brings contact toward the front wall where that tissue sits close.",
    "tryIt": "Notice whether pressure toward the front wall creates a fuller or different feeling. It may be more about contact and angle than depth; if it does not feel good, there is nothing to force.",
    "reflect": "When front-wall pressure worked, was it the angle, the curve, or how steady the contact stayed?",
    "source": "Foldes & Buisson, 2009; G-spot research",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "clitourethrovaginal",
      "clitoral-structure",
      "angling"
    ],
    "phrases": [
      {
        "id": "internal-stimulation-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "What feels like a deep 'vaginal' thing is really internal clitoris for me — angle is everything."
      },
      {
        "id": "internal-stimulation-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Aiming toward the front wall does more for me than going deep — can we play with angle?"
      },
      {
        "id": "internal-stimulation-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "Deeper isn't the goal for me — if it's not working, try a different angle rather than just going harder."
      },
      {
        "id": "internal-stimulation-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "I'd like to notice what kind of contact creates that fuller feeling inside."
      },
      {
        "id": "internal-stimulation-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "If deep alone doesn't do much, it may just not be reaching the tissue that does — angle usually beats force."
      }
    ]
  },
  {
    "id": "warmup-window",
    "name": "The Warm-up Window",
    "chapter": "curve",
    "tagline": "Arousal is a physical change, and it takes time",
    "hint": "Drag through the minutes",
    "isNew": false,
    "definition": "The time many bodies need for whole-body arousal before genital-focused touch feels best — often twenty minutes or more.",
    "notice": "Genital touch can feel muted until you've had unhurried time first — then suddenly it lands.",
    "understand": "Arousal often rises gradually—blood flow, lubrication, and wanting can take twenty to forty-five minutes to catch up (Chivers et al., 2010). Skipping that window isn't efficiency; it's skipping the part that makes the rest feel good.",
    "tryIt": "If you need time to warm up, that is information—not a flaw. Experiment with treating whole-body touch as central, not as a prelude you must rush through.",
    "reflect": "When unhurried time actually changed how touch felt, what was different — the pace, where hands went, or just not being rushed?",
    "source": "Chivers et al., 2010; arousal timing research",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "building",
      "responsive-desire"
    ],
    "phrases": [
      {
        "id": "warmup-window-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "I need real time to warm up before anything genital feels good — that's just my timing."
      },
      {
        "id": "warmup-window-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Can we take a good while warming up first? Twenty unhurried minutes changes everything for me."
      },
      {
        "id": "warmup-window-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If we jump to genital touch before I'm ready, I'd rather slow down than push through it."
      },
      {
        "id": "warmup-window-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "Notice what actually warms you before the rest feels right."
      },
      {
        "id": "warmup-window-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "Needing a long warm-up doesn't mean something's off — it's how my body gets there."
      }
    ]
  },
  {
    "id": "building",
    "name": "Building",
    "chapter": "curve",
    "tagline": "Slow climbs carry further",
    "hint": "Press and hold to build",
    "isNew": false,
    "definition": "Arousal that gathers gradually — warmth and intensity rising over time, not all at once.",
    "notice": "Arousal can start as barely anything — a little warmth — then slowly become undeniable.",
    "understand": "Arousal can gather in stages: a little warmth, then more focus and intensity. Sexual response models describe this building phase (Masters & Johnson; Basson, 2000); leaving it room to accumulate can make the climb itself feel fuller.",
    "tryIt": "Next time arousal begins, stay with subtle sensations before increasing intensity. Let them grow at their own pace. Notice whether the build itself becomes part of the pleasure.",
    "reflect": "When you let a slow climb go longer than usual, what showed up in the middle — more heat, more focus, or something else?",
    "source": "Masters & Johnson; Basson, 2000",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "plateauing",
      "edging",
      "warmup-window"
    ],
    "phrases": [
      {
        "id": "building-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "I get the most when I let it build slowly — rushing flattens it for me."
      },
      {
        "id": "building-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Can we take the long way and let things build? The slower start pays off for me."
      },
      {
        "id": "building-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If it's moving too fast for me, I'll ask you to slow down and let it gather again."
      },
      {
        "id": "building-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "What changes when the build has room to rise without being rushed?"
      },
      {
        "id": "building-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "Taking a while to warm up isn't a problem — it's where the good stuff comes from for me."
      }
    ]
  },
  {
    "id": "plateauing",
    "name": "Plateauing",
    "chapter": "curve",
    "tagline": "A hover is not a stall",
    "hint": "Find the touch that holds it steady",
    "isNew": false,
    "definition": "Arousal that holds steady — not climbing, not fading — a hover you can savor or read as a cue to change.",
    "notice": "Sometimes arousal just holds — steady, not fading, not climbing — like hovering.",
    "understand": "High arousal can hold steady without meaning anything has gone wrong. Sexual response models call this a plateau phase (Masters & Johnson); you can stay with the hover or change what you are doing if you want movement again.",
    "tryIt": "When you feel arousal holding steady, ask: Is this a delicious hover? Or is my body asking for something different? Both are valid. The awareness itself is the skill.",
    "reflect": "When arousal held at a hover instead of climbing, what did you want — more of that steadiness, or a shift in pace or touch?",
    "source": "Masters & Johnson sexual response cycle",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "building",
      "edging"
    ],
    "phrases": [
      {
        "id": "plateauing-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "That steady hover is its own kind of good — I don't always need it to tip over."
      },
      {
        "id": "plateauing-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Sometimes I want to just stay at this level for a while — can we hold here instead of pushing on?"
      },
      {
        "id": "plateauing-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If I've leveled off and want something different, I'll say so — it's not pressure, just information."
      },
      {
        "id": "plateauing-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "I'm curious whether staying on this plateau longer changes what comes after."
      },
      {
        "id": "plateauing-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "Hovering without finishing isn't a letdown — sometimes it's exactly where I want to be."
      }
    ]
  },
  {
    "id": "edging",
    "name": "Edging",
    "chapter": "curve",
    "tagline": "Approach, ease off, return",
    "hint": "Hold to climb, let go before the edge",
    "isNew": false,
    "definition": "Intentionally approaching the edge of orgasm, then easing back before it happens — often repeated multiple times.",
    "notice": "Getting close, easing off, then climbing again can change how the release feels.",
    "understand": "Research on orgasm delay suggests that prolonged arousal before release is often subjectively more intense for some people. Edging can also sharpen awareness of your own pre-orgasm signals—when to slow, pause, or change rhythm.",
    "tryIt": "When you feel orgasm approaching, slow down or pause. Let the intensity recede slightly. Then build again. Notice: does the eventual release feel different when you've edged first?",
    "reflect": "When you've lingered at the edge, what did the waiting itself feel like — restless, delicious, both?",
    "source": "Research on orgasm delay and intensity",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "building",
      "plateauing",
      "embodied-presence"
    ],
    "phrases": [
      {
        "id": "edging-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "The pause is the point for me — I'd rather draw the climb out than rush the top."
      },
      {
        "id": "edging-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Could we slow right down each time I get close, then start again? I want to see how far the build goes."
      },
      {
        "id": "edging-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If the pause starts to feel like teasing instead of building, let's stop holding back and let it tip over."
      },
      {
        "id": "edging-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "I keep wondering whether holding at the edge longer changes how the release feels."
      },
      {
        "id": "edging-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "Some nights the edge tips over early — that's not a test I can fail."
      }
    ]
  },
  {
    "id": "pulsing",
    "name": "Pulsing",
    "chapter": "curve",
    "tagline": "Pleasure has a tempo",
    "hint": "Tap along with the beat",
    "isNew": false,
    "definition": "A rhythmic, wave-like quality in high arousal or orgasm — beating or throbbing rather than flat.",
    "notice": "High arousal can bring a throb or wave-beat — sensation with its own tempo.",
    "understand": "A pulse can give pleasure its own tempo. Physiology studies describe rhythmic pelvic muscle contractions during orgasm, often about once per second (Meston & Buss, 2009); some people feel a similar rhythm earlier and like touch that meets it or moves differently.",
    "tryIt": "During high arousal, tune into any rhythmic quality. Can you feel a pulse or throb? Some find that syncing stimulation to this natural rhythm—or playing against it—creates interesting effects.",
    "reflect": "When that pulse showed up, what touch met it — matching the beat, holding still, or something slower?",
    "source": "Meston & Buss, 2009; physiology of orgasm research",
    "stat": {
      "value": "0.8 s",
      "label": "between the rhythmic contractions of orgasm",
      "source": "Masters & Johnson, 1966",
      "percent": 0
    },
    "related": [
      "building",
      "spreading"
    ],
    "phrases": [
      {
        "id": "pulsing-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "There's a rhythm my body wants — when touch matches that beat, it's a different level."
      },
      {
        "id": "pulsing-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Can you try matching a steady rhythm rather than changing it up? My body's got its own pulse."
      },
      {
        "id": "pulsing-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If the rhythm gets too fast or too much, I'll ask you to slow to something steadier."
      },
      {
        "id": "pulsing-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "Notice the tempo your body already has — and what happens when touch meets it."
      },
      {
        "id": "pulsing-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "Wanting the same steady rhythm over and over isn't dull — it's what carries me there."
      }
    ]
  },
  {
    "id": "spreading",
    "name": "Spreading",
    "chapter": "curve",
    "tagline": "Sensation that travels",
    "hint": "Touch a spot, then widen your attention",
    "isNew": false,
    "definition": "Pleasure radiating outward from where you're touched, through the rest of the body.",
    "notice": "Pleasure can leave the place you are touching — warmth or tingling traveling through the rest of you.",
    "understand": "Sometimes pleasure stops feeling pinned to one contact point and starts moving through the rest of you. Research on embodied sexuality links attention to whole-body sensation with more satisfying experiences; spreading is one way people describe that movement.",
    "tryIt": "During arousal, expand your attention beyond where you're being touched. Can you feel sensation in areas that aren't receiving direct contact? Let your awareness follow wherever the pleasure spreads.",
    "reflect": "When sensation left the contact point, where did it go first — and what were you doing when it traveled?",
    "source": "Embodied sexuality research; sensate focus studies",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "building",
      "pulsing",
      "embodied-presence"
    ],
    "phrases": [
      {
        "id": "spreading-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "When I stop chasing one spot, the feeling spreads through the rest of me — that's what I'm after."
      },
      {
        "id": "spreading-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Can we slow down and let me feel it everywhere, not just in one place?"
      },
      {
        "id": "spreading-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If it gets too intense in one spot, I'll ask you to move somewhere different and let it spread out."
      },
      {
        "id": "spreading-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "I'd like to notice how far a sensation can travel if I just let it."
      },
      {
        "id": "spreading-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "It's okay if I go quiet and still — I'm following something moving through me."
      }
    ]
  },
  {
    "id": "spontaneous-desire",
    "name": "Spontaneous Desire",
    "chapter": "wanting",
    "tagline": "Wanting that arrives first",
    "hint": "Tap to send a spark",
    "isNew": false,
    "definition": "Wanting that shows up on its own — an urge without an obvious external trigger.",
    "notice": "Wanting can arrive out of nowhere — mid-commute, mid-dish, with no warm-up scene required.",
    "understand": "Desire research distinguishes spontaneous from responsive patterns (Basson, 2000). Spontaneous desire shows up across genders and life stages, often more early in relationships — one valid pattern in a mix, not a required standard.",
    "tryIt": "Spontaneous desire isn't the \"right\" kind of desire—it's just one kind. If it shows up for you, enjoy it. If it doesn't, that's equally normal. Desire can arrive through many doors.",
    "reflect": "When an unprompted urge shows up, what do you usually do with it first — act, shelve it, or check whether the timing fits?",
    "source": "Basson, 2000; desire research",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "responsive-desire"
    ],
    "phrases": [
      {
        "id": "spontaneous-desire-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "When wanting shows up out of nowhere, I get to treat it as real information — not something I have to ignore or obey."
      },
      {
        "id": "spontaneous-desire-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Sometimes I just want you out of the blue — can we make room for that when it strikes?"
      },
      {
        "id": "spontaneous-desire-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "An urge isn't an obligation for either of us — either of us can pause or pass when the timing's off."
      },
      {
        "id": "spontaneous-desire-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "Notice when those sudden urges show up — and when they don't."
      },
      {
        "id": "spontaneous-desire-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "However often these urges come — a lot or rarely — there's no right amount."
      }
    ]
  },
  {
    "id": "responsive-desire",
    "name": "Responsive Desire",
    "chapter": "wanting",
    "tagline": "Wanting that arrives second",
    "hint": "Add context and watch it wake",
    "isNew": false,
    "definition": "Wanting that wakes once touch, mood, or connection is already underway — not as a spontaneous urge beforehand.",
    "notice": "Wanting does not always arrive first; sometimes it wakes once things get going.",
    "understand": "Desire research describes responsive desire as a common, healthy pattern (Basson, 2000; Nagoski, 2015) — interest that wakes once touch or mood engages you. Missing a spontaneous spark beforehand is not low desire by itself.",
    "tryIt": "You do not need to feel “in the mood” before you begin. If desire often arrives after you start, experiment with conditions that help you get curious—comfort, pacing, type of touch—then notice what unfolds.",
    "reflect": "When wanting showed up only after you'd already started, what helped it arrive — pace, kind of touch, or feeling unhurried?",
    "source": "Nagoski, 2015; Basson circular model of desire",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "spontaneous-desire",
      "warmup-window",
      "brakes-accelerators"
    ],
    "phrases": [
      {
        "id": "responsive-desire-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "My wanting usually shows up after we start, not before — that's how I'm wired, not something to fix."
      },
      {
        "id": "responsive-desire-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "I might not feel the spark up front. Can we start gently and let me warm into it, no pressure either way?"
      },
      {
        "id": "responsive-desire-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If I'm not feeling it once we've started, I want to be able to pause without it meaning something's wrong."
      },
      {
        "id": "responsive-desire-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "Notice what gets you from not-thinking-about-it to yes — the on-ramp, not a spark you have to force."
      },
      {
        "id": "responsive-desire-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "Not wanting it out of nowhere doesn't mean I don't want you. I just need a bit of an on-ramp."
      }
    ]
  },
  {
    "id": "brakes-accelerators",
    "name": "Brakes & Accelerators",
    "chapter": "wanting",
    "tagline": "Two pedals, not one",
    "hint": "Tap what's true tonight",
    "isNew": true,
    "definition": "Arousal runs on two systems at once: one that notices reasons to turn on, and one that notices reasons not to. Researchers call this the dual control model.",
    "notice": "The same touch can feel wonderful one night and like nothing the next. The difference is often what else is pressing on you.",
    "understand": "The dual control model (Bancroft & Janssen, 2000) describes sexual response as a balance of excitation and inhibition, and people differ in how sensitive each one is. Stress, feeling rushed, self-criticism and fear of interruption all press the brake. Often the most effective change is not more stimulation but less braking (Nagoski, 2015).",
    "tryIt": "Before reaching for more stimulation, ask what is pressing the brake right now: the unlocked door, the to-do list, the worry about how long you are taking. Easing one of those can do more than anything you add.",
    "reflect": "What reliably presses your brake, and which of those could actually be changed?",
    "source": "Bancroft & Janssen, 2000; Nagoski, 2015",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "responsive-desire",
      "spectatoring",
      "warmup-window"
    ],
    "phrases": [
      {
        "id": "brakes-accelerators-self",
        "kind": "self",
        "label": "For myself",
        "body": "It's rarely that I need more. Usually something is on the brake, and I'm learning what."
      },
      {
        "id": "brakes-accelerators-ask",
        "kind": "ask",
        "label": "To ask",
        "body": "Can we lock the door and put our phones away first? I get there much more easily when nothing's pulling at me."
      },
      {
        "id": "brakes-accelerators-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "When I'm stressed, pushing harder doesn't help. I need the pressure off before anything else."
      },
      {
        "id": "brakes-accelerators-curious",
        "kind": "curious",
        "label": "Getting curious",
        "body": "I'd like to work out what my brakes actually are, so I'm not guessing every time."
      },
      {
        "id": "brakes-accelerators-reassure",
        "kind": "reassure",
        "label": "To reassure",
        "body": "If I'm slow to warm up tonight, it's my brakes, not you. Nothing is wrong with either of us."
      }
    ]
  },
  {
    "id": "non-concordance",
    "name": "Non-concordance",
    "chapter": "wanting",
    "tagline": "Body and mind are separate signals",
    "hint": "Compare the two signals",
    "isNew": false,
    "definition": "When physical arousal signs (lubrication, erection) and how turned on you feel don't match — either way.",
    "notice": "Felt very into it while nothing showed — or noticed wetness when you weren't actually interested?",
    "understand": "Meta-analyses find only modest correlation between genital response and subjective arousal in women—often cited around 10–30% overlap (Chivers et al., 2010; Nagoski, 2015). Genital response can happen without desire; desire can exist without obvious signs. Wanting is communicated — not inferred from wetness or erection.",
    "tryIt": "Physical response doesn't equal wanting. Lack of visible response doesn't mean absence of interest. You get to trust your own experience of arousal rather than judging by physical signs alone.",
    "reflect": "When body signs and wanting split, which one did you listen to — and what did trusting the wrong one cost you?",
    "source": "Chivers et al., 2010; Nagoski, 2015",
    "stat": {
      "value": "r = .26",
      "label": "how weakly genital response tracks felt arousal in women (.66 in men)",
      "source": "Chivers et al., 2010",
      "percent": 0
    },
    "related": [
      "responsive-desire",
      "embodied-presence"
    ],
    "phrases": [
      {
        "id": "non-concordance-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "What I feel matters more than what my body's doing — wetness isn't the same as wanting, for me."
      },
      {
        "id": "non-concordance-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "My body and my interest don't always match. Please check in with me, not just what you can see."
      },
      {
        "id": "non-concordance-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "Physical signs aren't a yes on their own — ask me, and if my words say stop, trust them over my body."
      },
      {
        "id": "non-concordance-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "Notice the difference between physical signs and what you actually want."
      },
      {
        "id": "non-concordance-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "If my body and my wanting disagree sometimes, that doesn't mean either one is lying — they're just not the same signal."
      }
    ]
  },
  {
    "id": "spectatoring",
    "name": "Spectatoring",
    "chapter": "attention",
    "tagline": "Watching instead of feeling",
    "hint": "Drag your attention back into the body",
    "isNew": false,
    "definition": "Watching and grading yourself during sex instead of staying with what you feel.",
    "notice": "Sometimes you start watching yourself during sex — how you look, how long you're taking, what they're thinking.",
    "understand": "When attention turns into a live review of your body or performance, sensation has less room. Masters and Johnson named spectatoring as a barrier to enjoyment; later work links self-focused attention with lower arousal and satisfaction (Barlow, 1986). Returning to one concrete sensation can help (Brotto, 2018).",
    "tryIt": "When you notice yourself watching rather than feeling, gently redirect attention to sensation. What does this touch actually feel like? What sensations are present right now? Return to your body.",
    "reflect": "When you catch yourself watching instead of feeling, what usually yanked you out — and what, if anything, dropped you back in?",
    "source": "Masters & Johnson; Barlow, 1986",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "embodied-presence",
      "sexual-self-esteem",
      "brakes-accelerators"
    ],
    "phrases": [
      {
        "id": "spectatoring-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "When I'm watching myself instead of feeling, the sex goes flat — I want the sensation back, not a better performance."
      },
      {
        "id": "spectatoring-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Sometimes I get stuck in my head. A little reassurance, or just slowing down, helps me drop back in."
      },
      {
        "id": "spectatoring-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If I go quiet and distant, it's not you — give me a moment to pause and come back to my body."
      },
      {
        "id": "spectatoring-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "Notice what knocks you into watching mode — and what lets you drop back into feeling."
      },
      {
        "id": "spectatoring-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "Drifting into my head sometimes doesn't mean I'm not enjoying you — I'm just finding my way back."
      }
    ]
  },
  {
    "id": "embodied-presence",
    "name": "Embodied Presence",
    "chapter": "attention",
    "tagline": "Coming back to one sensation",
    "hint": "Tap a thought to let it pass",
    "isNew": false,
    "definition": "Staying with what your body feels during intimacy — attention in sensation, not in commentary.",
    "notice": "There are moments when the commentary cuts out — just heat, pressure, breath.",
    "understand": "Present-focused attention during sex tracks with higher arousal and satisfaction in clinical work (Brotto, 2018). The adult move is simple: when the mind drifts, return to one concrete sensation — not a performance of mindfulness.",
    "tryIt": "When your mind wanders, gently return attention to physical sensation. What does this touch feel like? Where exactly do you feel it? Embodied presence is a skill you can strengthen through practice.",
    "reflect": "When you last dropped all the way into sensation, what was happening in the room — pace, quiet, how you were touched?",
    "source": "Brotto, 2018; mindfulness and sexuality research",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "spectatoring",
      "body-appreciation"
    ],
    "phrases": [
      {
        "id": "embodied-presence-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "When I drop fully into sensation, that's the best of it — I want to protect that, not perform."
      },
      {
        "id": "embodied-presence-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Can we go slow enough that I can really feel each thing? I want to be in it, not ahead of it."
      },
      {
        "id": "embodied-presence-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If I need quiet to stay present, that's not distance — if talking pulls me out, let's slow down and go wordless."
      },
      {
        "id": "embodied-presence-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "Notice what keeps you in your body — and what knocks you back into your head."
      },
      {
        "id": "embodied-presence-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "Getting lost in sensation and going quiet isn't checking out — it's me all the way here."
      }
    ]
  },
  {
    "id": "body-appreciation",
    "name": "Body Appreciation",
    "chapter": "attention",
    "tagline": "Felt from inside, not seen from outside",
    "hint": "Slide between looking and feeling",
    "isNew": false,
    "definition": "Valuing your body for what it feels and does in the moment, instead of grading its appearance.",
    "notice": "Mid-touch, caught yourself checking how you look instead of what you're feeling?",
    "understand": "Body image research links appreciating body function during sex with greater satisfaction and less appearance distraction (Satinsky et al., 2012). Weight alone does not predict sexual function; how you relate to your body in the moment often matters more.",
    "tryIt": "During intimacy, when appearance concerns arise, redirect to sensation. What does this feel like? What is your body capable of experiencing right now? Let function matter more than form.",
    "reflect": "When the appearance noise drops out, what usually lets sensation take over — light, pace, trust, something else?",
    "source": "Body image and sexuality research; Satinsky et al., 2012",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "embodied-presence",
      "sexual-self-esteem",
      "spectatoring"
    ],
    "phrases": [
      {
        "id": "body-appreciation-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "I'd rather feel my body than watch it — what it can feel matters more than how it looks."
      },
      {
        "id": "body-appreciation-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "When I get self-conscious, it helps to be reminded you actually want to be here — not that I look a certain way."
      },
      {
        "id": "body-appreciation-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If I get self-conscious about my body, I'd rather we pause or keep going than stop to talk about how I look."
      },
      {
        "id": "body-appreciation-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "I'm curious how much more lands when I'm inside the feeling, not watching myself."
      },
      {
        "id": "body-appreciation-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "How my body looks doesn't decide whether I get to enjoy this."
      }
    ]
  },
  {
    "id": "sexual-self-esteem",
    "name": "Sexual Self-Esteem",
    "chapter": "attention",
    "tagline": "Allowed to want",
    "hint": "Tap an old story to rewrite it",
    "isNew": false,
    "definition": "How you regard yourself as a sexual person — whether pleasure feels like something you get to want.",
    "notice": "Caught an old story mid-intimacy — that you're too much, not enough, or somehow failing at wanting what you want?",
    "understand": "Research links sexual self-esteem with satisfaction, communication, and sexual function. Feeling entitled to your own pleasure—not perfect confidence every day—tends to travel with better outcomes over time.",
    "tryIt": "What beliefs about yourself as a sexual person might be limiting your pleasure? Sexual self-esteem can be developed—through positive experiences, self-exploration, and challenging inherited shame.",
    "reflect": "When that story interrupts, what do you lose contact with first — sensation, wanting, or the nerve to ask?",
    "source": "Sexuality research; self-esteem and outcomes studies",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "body-appreciation",
      "spectatoring",
      "asking"
    ],
    "phrases": [
      {
        "id": "sexual-self-esteem-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "My pleasure is worth taking up space — I'm allowed to want, and to ask."
      },
      {
        "id": "sexual-self-esteem-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "When I'm hard on myself, it helps to hear one specific thing you enjoy about being with me — not a pep talk, just something true."
      },
      {
        "id": "sexual-self-esteem-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If I start talking myself down, I'd rather we pause than turn it into a pep talk — let me come back to what's actually feeling good."
      },
      {
        "id": "sexual-self-esteem-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "What does sex feel like when you are not grading yourself through it?"
      },
      {
        "id": "sexual-self-esteem-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "I don't need to feel confident every night to deserve good sex — wanting pleasure is enough."
      }
    ]
  },
  {
    "id": "touch-language",
    "name": "The Language of Touch",
    "chapter": "touch",
    "tagline": "Pressure, pace, pattern, place",
    "hint": "Set each dial and read the sentence",
    "isNew": true,
    "definition": "Any touch can be described with four words: how firm, how fast, what shape, and exactly where. Naming those four turns “that feels good” into something you can ask for again.",
    "notice": "“A bit different” is hard to act on. “Lighter, slower, and just to the side” is not.",
    "understand": "In a US probability sample, women described highly specific preferences: most favoured light to medium pressure, named distinct motions such as up-and-down, circular and side-to-side, and many preferred touch beside or around the clitoris rather than directly on it (Herbenick et al., 2018). Preferences were individual, which is exactly why having words for them matters.",
    "tryIt": "Next time something feels good, name its four parts to yourself: pressure, pace, pattern, place. Then change just one and notice what happens.",
    "reflect": "Which of the four makes the biggest difference for you: pressure, pace, pattern or place?",
    "source": "Herbenick et al., 2018, Journal of Sex & Marital Therapy",
    "stat": {
      "value": "",
      "label": "",
      "source": "",
      "percent": 0
    },
    "related": [
      "nerve-density",
      "asking",
      "pulsing"
    ],
    "phrases": [
      {
        "id": "touch-language-self",
        "kind": "self",
        "label": "For myself",
        "body": "I know my four now: how firm, how fast, what shape, and where."
      },
      {
        "id": "touch-language-ask",
        "kind": "ask",
        "label": "To ask",
        "body": "Could you go a little lighter and slower, in small circles, just to the side?"
      },
      {
        "id": "touch-language-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "That's too direct for me right now. Beside it, not on it."
      },
      {
        "id": "touch-language-curious",
        "kind": "curious",
        "label": "Getting curious",
        "body": "Can we change just one thing at a time, so I can tell what's doing it?"
      },
      {
        "id": "touch-language-reassure",
        "kind": "reassure",
        "label": "To reassure",
        "body": "When I ask for a tiny adjustment, it means you're close, not that you're getting it wrong."
      }
    ]
  },
  {
    "id": "angling",
    "name": "Angling",
    "chapter": "touch",
    "tagline": "A few degrees changes where it lands",
    "hint": "Drag to tilt the pelvis",
    "isNew": false,
    "definition": "Tilting or shifting the pelvis during penetration so internal pressure lands somewhere better.",
    "notice": "A small tilt can make the whole thing land differently.",
    "understand": "A tiny pelvic shift can change where pressure lands. Hensel et al. (2021) found angling widely reported; giving that shift a name helps you catch and repeat what works instead of hoping it happens again.",
    "tryIt": "During penetration, try tilting your pelvis slightly forward, then back. Even a small shift can change which areas receive pressure. Notice which angle feels strongest—solo or with a partner.",
    "reflect": "When a small tilt suddenly made things click, what actually changed — depth, pressure, or where it landed inside?",
    "source": "Hensel et al., 2021, PLOS ONE",
    "stat": {
      "value": "87.5%",
      "label": "of women tilt their pelvis to shift where pressure lands",
      "source": "Hensel et al., 2021",
      "percent": 87.5
    },
    "related": [
      "rocking",
      "pairing"
    ],
    "phrases": [
      {
        "id": "angling-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "A few degrees changes everything for me — the angle matters more than I used to admit."
      },
      {
        "id": "angling-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Can we play with tilting my hips a little and see what shifts? I'll show you when something lands."
      },
      {
        "id": "angling-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If I need to stop and adjust to find the angle, that's not a complaint — let me reposition."
      },
      {
        "id": "angling-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "I'd like to notice which small tilts actually change the feeling — instead of hoping I stumble into one."
      },
      {
        "id": "angling-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "There's no 'right' position here — we're just following what feels good, wherever that is."
      }
    ]
  },
  {
    "id": "rocking",
    "name": "Rocking",
    "chapter": "touch",
    "tagline": "Contact that doesn't break",
    "hint": "Switch between thrusting and rocking",
    "isNew": false,
    "definition": "A grinding or rocking motion that keeps steady external contact during penetration.",
    "notice": "Staying pressed close can hold a feeling that thrusting loses.",
    "understand": "If steady external contact matters to your pleasure, pulling apart with each thrust can interrupt it. Rocking keeps bodies close so pressure can stay continuous; Hensel et al. (2021) identified it as one named way people do that.",
    "tryIt": "Instead of in-and-out, stay close and move your hips in a slow wave or figure eight. Notice what changes in external sensation when contact stays steady.",
    "reflect": "When staying close worked better than pulling apart, what was your body getting that bigger movement lost?",
    "source": "Hensel et al., 2021, PLOS ONE",
    "stat": {
      "value": "76.4%",
      "label": "of women keep the clitoris in steady contact by rocking",
      "source": "Hensel et al., 2021",
      "percent": 76.4
    },
    "related": [
      "angling",
      "pairing"
    ],
    "phrases": [
      {
        "id": "rocking-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "Steady contact does more for me than big movement — closeness over distance."
      },
      {
        "id": "rocking-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Could we stay pressed close and grind instead of pulling back and forth? I lose the good spot when we separate."
      },
      {
        "id": "rocking-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If the pace gets to be too much, I'd rather slow down and keep contact than speed up."
      },
      {
        "id": "rocking-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "I wonder what happens if we keep that steady pressure the whole time, not just in waves."
      },
      {
        "id": "rocking-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "Wanting to stay close and barely move isn't boring — it's exactly what works for me."
      }
    ]
  },
  {
    "id": "shallowing",
    "name": "Shallowing",
    "chapter": "touch",
    "tagline": "The entrance is a destination",
    "hint": "Drag to change depth",
    "isNew": false,
    "definition": "Focusing stimulation at or just inside the vaginal entrance — treating shallow as the destination, not a warm-up.",
    "notice": "Right at the entrance can feel more alive than going deep; lingering there can be the point.",
    "understand": "The entrance can be the most responsive part for you, and staying there can make later touch feel better. Hensel et al. (2021) found shallowing widely reported; it is a preference and a point of pleasure, not “just teasing.”",
    "tryIt": "Instead of rushing deeper, stay at the entrance. Circle slowly or hold gentle pressure. Treat this zone as a destination. Notice how sensation changes when you slow down.",
    "reflect": "When you've stayed near the entrance on purpose, what did you actually want more of — pressure, circling, or just more time there?",
    "source": "Hensel et al., 2021, PLOS ONE",
    "stat": {
      "value": "83.8%",
      "label": "of women enjoy touch just inside the entrance",
      "source": "Hensel et al., 2021",
      "percent": 83.8
    },
    "related": [
      "pairing"
    ],
    "phrases": [
      {
        "id": "shallowing-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "The entrance is where I'm most sensitive — shallow isn't a warm-up, it's the good part."
      },
      {
        "id": "shallowing-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Can we spend real time just at the entrance before going deeper? It makes everything after feel better."
      },
      {
        "id": "shallowing-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "Deeper isn't always more for me — if I ask to stay shallow, slow down rather than pushing deeper."
      },
      {
        "id": "shallowing-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "What happens when we linger right at the edge before moving on?"
      },
      {
        "id": "shallowing-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "Staying shallow isn't teasing or holding back — it's genuinely what feels best."
      }
    ]
  },
  {
    "id": "pairing",
    "name": "Pairing",
    "chapter": "touch",
    "tagline": "Inside and outside, together",
    "hint": "Switch each kind of touch on",
    "isNew": false,
    "definition": "Adding external clitoral touch during penetration — hand, partner, toy, or position — so inside and outside work together.",
    "notice": "Penetration alone may not be enough; adding clitoral touch can change the whole experience.",
    "understand": "Clitoral involvement tracks with higher orgasm likelihood during partnered sex (Frederick et al., 2018; Hensel et al., 2021). Pairing adds that touch during penetration — common physiology, not a workaround for something broken.",
    "tryIt": "During penetration, add clitoral touch in whatever way feels natural—your hand, a toy, or guiding a partner's hand. Notice whether intensity or focus changes.",
    "reflect": "When penetration plus outside touch landed better than either alone, what actually changed — intensity, focus, or how close you got?",
    "source": "Hensel et al., 2021, PLOS ONE; Frederick et al., 2018",
    "stat": {
      "value": "69.7%",
      "label": "of women add clitoral touch during penetration",
      "source": "Hensel et al., 2021",
      "percent": 69.7
    },
    "related": [
      "angling",
      "rocking",
      "shallowing",
      "the-gap"
    ],
    "phrases": [
      {
        "id": "pairing-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "Penetration plus clitoral touch is what actually works for me — together, not either-or."
      },
      {
        "id": "pairing-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Can we add touch on my clit during penetration? That combination is what gets me there."
      },
      {
        "id": "pairing-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "If I reach down to touch myself, that's me helping — don't stop or take it as something being wrong."
      },
      {
        "id": "pairing-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "Notice the rhythm where inside and outside touch start working with each other."
      },
      {
        "id": "pairing-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "Needing both at once isn't asking for too much — it's just how my body adds up."
      }
    ]
  },
  {
    "id": "golden-trio",
    "name": "The Golden Trio",
    "chapter": "touch",
    "tagline": "More than one kind of touch",
    "hint": "Add each kind of touch",
    "isNew": false,
    "definition": "A pattern where more than one kind of touch works together in the same encounter — especially when clitoral touch is part of the mix.",
    "notice": "One kind of touch alone may not be the whole story; layering hands, mouth, and penetration can change things.",
    "understand": "One kind of touch is not always the whole story. In reports studied by Frederick et al. (2018), women who experienced intercourse alongside manual genital stimulation and oral sex reported orgasm more often than those reporting intercourse alone. That describes a pattern, not a recipe: choose the mix that actually feels good.",
    "tryIt": "This is not a checklist to perform. Notice whether combining types of touch—including clitoral—changes your experience. Choose variety that fits you, not a fixed script.",
    "reflect": "When different kinds of touch stacked in one encounter, which mix actually moved you — and which felt like going through the motions?",
    "source": "Frederick et al., 2018, Archives of Sexual Behavior",
    "stat": {
      "value": "86%",
      "label": "of women orgasmed when intercourse came with manual and oral touch (50% with intercourse alone)",
      "source": "Richters et al., 2006",
      "percent": 86
    },
    "related": [
      "pairing",
      "warmup-window",
      "the-gap"
    ],
    "phrases": [
      {
        "id": "golden-trio-self-understanding",
        "kind": "self",
        "label": "For myself",
        "body": "Variety is what works for me — one kind of touch alone rarely gets me all the way."
      },
      {
        "id": "golden-trio-partner-request",
        "kind": "ask",
        "label": "To ask",
        "body": "Can we mix it up — hands, mouth, and penetration together rather than just one?"
      },
      {
        "id": "golden-trio-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "I don't want it to feel like ticking boxes — let's stop anything that turns into a chore and keep what feels good."
      },
      {
        "id": "golden-trio-curiosity",
        "kind": "curious",
        "label": "Getting curious",
        "body": "I'd like to find which combinations actually do it for me, not just try everything."
      },
      {
        "id": "golden-trio-reassurance",
        "kind": "reassure",
        "label": "To reassure",
        "body": "Needing more than one thing isn't greedy or complicated — it's just what adds up for me."
      }
    ]
  },
  {
    "id": "the-gap",
    "name": "The Orgasm Gap",
    "chapter": "saying",
    "tagline": "The script, not the body",
    "hint": "Tap a bar to compare",
    "isNew": true,
    "definition": "In sex between women and men, men orgasm far more reliably than women. The difference tracks what happens during sex, not what women's bodies can do.",
    "notice": "If orgasm comes easily alone and rarely with a partner, that is a pattern in the encounter, not a flaw in you.",
    "understand": "In a study of 52,588 US adults, 95% of heterosexual men said they usually or always orgasm during partnered sex, against 65% of heterosexual women and 86% of lesbian women (Frederick et al., 2018). Same bodies, different script. Only about 18% of women say intercourse alone is enough for orgasm (Herbenick et al., 2018); the gap narrows when clitoral touch, time and talking are part of the encounter.",
    "tryIt": "Notice what your usual script puts at the centre and what it treats as optional. Try moving one “optional” thing to the centre.",
    "reflect": "What does your usual script treat as the main event, and is that the part that works best for you?",
    "source": "Frederick et al., 2018, Archives of Sexual Behavior; Herbenick et al., 2018",
    "stat": {
      "value": "65%",
      "label": "of heterosexual women usually orgasm with a partner; 95% of heterosexual men do",
      "source": "Frederick et al., 2018",
      "percent": 65
    },
    "related": [
      "pairing",
      "golden-trio",
      "asking"
    ],
    "phrases": [
      {
        "id": "the-gap-self",
        "kind": "self",
        "label": "For myself",
        "body": "The gap is about the script we follow, not about my body."
      },
      {
        "id": "the-gap-ask",
        "kind": "ask",
        "label": "To ask",
        "body": "Can we treat the things that work for me as the main event, not the warm-up?"
      },
      {
        "id": "the-gap-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "I don't want us to be finished just because one of us is."
      },
      {
        "id": "the-gap-curious",
        "kind": "curious",
        "label": "Getting curious",
        "body": "What would we do differently if we weren't following the usual order?"
      },
      {
        "id": "the-gap-reassure",
        "kind": "reassure",
        "label": "To reassure",
        "body": "This isn't a complaint about you. It's a pattern nearly everyone inherits, and we can change it."
      }
    ]
  },
  {
    "id": "asking",
    "name": "Asking",
    "chapter": "saying",
    "tagline": "Specific, kind, and out loud",
    "hint": "Build a sentence, piece by piece",
    "isNew": true,
    "definition": "Saying what you want in a way a partner can act on: something warm, something specific, and an invitation rather than a verdict.",
    "notice": "There's often a moment when you know what would feel better, and decide not to say it.",
    "understand": "In a US national sample, 55% of women said they had wanted to tell a partner how they liked to be touched and decided not to, most often to avoid hurting the partner's feelings (Herbenick et al., 2019). Yet across 93 studies, sexual communication is one of the most reliable correlates of sexual satisfaction (Mallory, 2022). Specific, positively framed requests are the easiest to hear.",
    "tryIt": "Start with one small, positive, specific request: something you like, plus one adjustment. “I love this. A little slower?” is a complete sentence.",
    "reflect": "What is one thing you've wanted to ask for and haven't? What's the gentlest true way to say it?",
    "source": "Herbenick et al., 2019; Mallory, 2022",
    "stat": {
      "value": "55%",
      "label": "of women have wanted to say how they like to be touched, and decided not to",
      "source": "Herbenick et al., 2019",
      "percent": 55
    },
    "related": [
      "touch-language",
      "the-gap",
      "sexual-self-esteem"
    ],
    "phrases": [
      {
        "id": "asking-self",
        "kind": "self",
        "label": "For myself",
        "body": "Asking isn't criticising. It's giving someone the map."
      },
      {
        "id": "asking-ask",
        "kind": "ask",
        "label": "To ask",
        "body": "I love when you slow down like that. Can you stay right there a little longer?"
      },
      {
        "id": "asking-boundary",
        "kind": "boundary",
        "label": "A boundary",
        "body": "I'd like to be able to say “different” without it turning into an apology from either of us."
      },
      {
        "id": "asking-curious",
        "kind": "curious",
        "label": "Getting curious",
        "body": "What's something you've wanted to ask me for and haven't?"
      },
      {
        "id": "asking-reassure",
        "kind": "reassure",
        "label": "To reassure",
        "body": "When I tell you what I like, it means I want more of this with you."
      }
    ]
  }
];
