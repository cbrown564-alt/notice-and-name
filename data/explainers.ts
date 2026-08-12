// Research Explainers for Notice & Name
// Soft Intimate noticing guides — evidence kept short; citations in keySources.

import { ResearchExplainer } from '@/types';

export const explainers: ResearchExplainer[] = [
  {
    id: 'orgasm-gap',
    title: 'The Orgasm Gap',
    subtitle: 'The gap is the script, not your body',
    icon: 'stats-chart',
    image: require('../assets/images/explainers/orgasm-gap.png'),
    readTime: '5 min read',
    overview:
      'When sex follows a narrow script, orgasm arrives unevenly. Large studies show that gap lives in what happens during the encounter—not in whether women can orgasm. Notice the script; name what you actually want.',

    keyTakeaways: [
      'In heterosexual encounters, women orgasm about 65% of the time; men about 95%. Lesbian women report about 86%.',
      'The gap tracks behavior—especially whether clitoral stimulation is central—not biology.',
      'Only about 18% of women orgasm from penetration alone; most need clitoral stimulation.',
      'Variety and clear communication track with higher satisfaction and orgasm rates.',
      'If orgasm has felt hard to reach with a partner, start by questioning the script, not your body.',
    ],

    sections: [
      {
        title: 'What shows up in the numbers',
        content: [
          {
            type: 'text', content: `In partnered heterosexual sex, women report orgasming far less often than men—about 65% versus 95% in a study of over 52,000 adults. That gap shrinks sharply when women have sex with women (about 86%). Same bodies, different patterns of contact and attention.

The point is not a ranking of orientations. It is a clear lens: when the encounter includes what reliably works for most women, orgasm is common. When it does not, the gap appears.` }
        ],
        statistic: {
          value: '65% vs 95%',
          label: 'Women vs men orgasm rate in heterosexual encounters',
          source: 'Frederick et al., 2018 (N=52,588)',
        },
      },
      {
        title: 'The script, not the body',
        content: [
          {
            type: 'text', content: `Women have the physiological capacity for orgasm. What differs is what gets prioritized. Only about 18% of women orgasm from penetration alone, yet many heterosexual scripts still treat penetration as the main event and everything else as optional warm-up.

Same-sex encounters between women more often keep clitoral stimulation central. That difference in practice—not a difference in anatomy—explains much of the gap.` },
          { type: 'callout', title: 'Notice the frame', content: 'If "sex" means penis-in-vagina first, activities that are more reliable for many women get demoted. Renaming what counts as the center changes what you ask for.' },
        ],
        statistic: {
          value: '18%',
          label: 'Women who can orgasm from penetration alone',
          source: 'Research synthesis',
        },
      },
      {
        title: 'What actually closes it',
        content: [
          {
            type: 'text', content: `Adequate clitoral stimulation—hands, mouth, toys, or positioning that keeps contact during penetration—is the strongest pattern. Variety helps too: oral, manual, and penetration together have been linked with much higher orgasm rates (around 86% in one analysis).

Talking about preferences also tracks strongly with satisfaction. In-the-moment guidance and quieter conversations outside sex both count.` },
          { type: 'quote', content: 'Women who communicate about their preferences report better outcomes.', author: 'Mallory, 2022' },
        ],
        statistic: {
          value: '86%',
          label: 'Orgasm rate with oral + manual + penetration combined',
          source: 'Frederick et al., 2018',
        },
      },
      {
        title: 'What this means when you\'re noticing',
        content: [
          {
            type: 'text', content: `If orgasm has felt elusive with a partner, the research points first at the script you were handed—not at a flaw in you. Closing a personal gap is behavioral: more of what works, less loyalty to a default that skips it.

Words help. Pairing, the golden trio, the warmup window, responsive desire—private vocabulary for what you want more of, and for the conditions that make pleasure more likely.` }
        ]
      },
    ],

    misconceptions: [
      {
        myth: 'Women are just harder to please than men',
        fact: 'Capacity is there. The gap tracks patterns of stimulation. When clitoral stimulation is adequate, the gap nearly disappears.',
      },
      {
        myth: 'Vaginal orgasms are more "mature" or superior',
        fact: 'There is no hierarchy. Most women need clitoral stimulation; that is anatomy, not a deficiency.',
      },
      {
        myth: 'If orgasm doesn\'t happen easily, something is wrong',
        fact: 'Partnered orgasm often needs time, the right kind of contact, and mental presence. Those are learnable conditions—not a verdict on your body.',
      },
    ],

    keySources: [
      {
        citation: 'Frederick, D. A., et al. (2018). Archives of Sexual Behavior, 47(1), 273-288.',
        finding: 'Study of 52,588 adults documenting the orgasm gap across sexual orientations and identifying behavioral correlates of women\'s orgasm.',
      },
      {
        citation: 'Herbenick, D., et al. (2018). Archives of Sexual Behavior, 47(8), 2379-2390.',
        finding: 'Found that the combination of genital stimulation, oral sex, and deep kissing best predicted women\'s orgasm during partnered sex.',
      },
      {
        citation: 'Shirazi, T., et al. (2018). Archives of Sexual Behavior, 47(5), 1321-1333.',
        finding: 'Meta-analysis confirming that clitoral stimulation is the most reliable route to orgasm for most women.',
      },
      {
        citation: 'Mallory, A. B. (2022). Journal of Sex Research, meta-analysis.',
        finding: 'Found sexual communication correlates r=.43 with sexual satisfaction, with effects stronger for women than men.',
      },
    ],

    relatedConceptIds: ['pairing', 'golden-trio', 'warmup-window', 'responsive-desire'],
    relatedExplainerIds: ['anatomy-101', 'communication-science'],
    tier: 'free',
  },

  {
    id: 'anatomy-101',
    title: 'Anatomy 101',
    subtitle: 'Most of the clitoris is inside',
    icon: 'body',
    image: require('../assets/images/explainers/anatomy-101.png'),
    readTime: '4 min read',
    overview:
      'What you can see of the clitoris is only the tip. Most of it lives inside the body—roughly 9cm in all, densely nerved, wrapping tissue that penetration can reach. That changes what "enough" means when you\'re noticing.',

    keyTakeaways: [
      'The full clitoris is about 9cm; most of that structure is internal.',
      'The external glans holds over 8,000 nerve endings—dense enough that direct touch can feel like too much early on.',
      'Internal tissue wraps near the vaginal canal, which is why some internal pressure feels good.',
      'What people call the G-spot is often internal clitoral access through the front wall (the CUV complex).',
      'Knowing this reframes "penetration alone isn\'t enough" as anatomy working as designed.',
    ],

    sections: [
      {
        title: 'More than the tip',
        content: [
          {
            type: 'text', content: `The visible glans and hood are a small part of a larger organ. Imaging maps crura (legs) along the pubic bone and vestibular bulbs beside the vaginal opening—erectile tissue that engorges with arousal.

When you notice swelling, fullness, or pleasure that seems to come from "inside," you are often feeling that larger structure, not a separate mystery organ.` },
          { type: 'callout', title: 'What this means', content: 'Pressure on the front vaginal wall can reach internal clitoral tissue. Internal pleasure and external pleasure are often two routes to the same system.' }
        ],
        statistic: {
          value: '~9cm',
          label: 'Total size of the clitoral organ including internal tissue',
          source: 'O\'Connell et al., 2005',
        },
      },
      {
        title: 'Density, and why technique matters',
        content: [
          {
            type: 'text', content: `The glans concentrates over 8,000 nerve endings in a small area—roughly as many as the entire penis. That density is why small shifts in pressure, speed, or angle can change everything, and why direct contact can feel sharp before you are aroused.

Many people prefer stimulation through the hood or nearby tissue first. Sensitivity often widens as arousal builds. Naming those preferences is not fussiness; it matches the instrument.` },
          { type: 'quote', content: 'Slight changes in pressure, speed, or angle can significantly alter the experience.', accent: 'secondary' },
        ],
        statistic: {
          value: '8,000+',
          label: 'Nerve endings in the clitoral glans',
          source: 'Anatomical research',
        },
      },
      {
        title: 'The G-spot as a door, not a button',
        content: [
          {
            type: 'text', content: `The sensitive patch on the front vaginal wall (often 1–3 inches in, toward the belly) lines up with internal clitoral tissue and the urethral sponge. Researchers describe this as the clitourethrovaginal (CUV) complex—several structures felt through one wall.

There is no single magic spot that works the same for everyone. Arousal changes responsiveness. Exploring the area and noticing what lands is more useful than hunting a labeled button.` }
        ]
      },
      {
        title: 'When you\'re noticing',
        content: [
          {
            type: 'text', content: `External contact reaches the densest part of a larger organ. Positions and angles that keep clitoral contact—or that press the front wall—often feel better because they use that anatomy on purpose.

If penetration alone has never been "enough," that is not a personal failure. You are built for multi-point stimulation. Vocabulary for clitoral structure, nerve density, and internal stimulation is there so you can name what you want without apology.` }
        ]
      },
    ],

    misconceptions: [
      {
        myth: 'The clitoris is just a small external bump',
        fact: 'The visible tip is only part of it. The full structure is about 9cm and extends internally around the vaginal canal.',
      },
      {
        myth: 'The G-spot is a separate organ from the clitoris',
        fact: 'Front-wall sensitivity often maps to internal clitoral tissue. G-spot stimulation is frequently indirect clitoral access.',
      },
      {
        myth: 'Vaginal and clitoral orgasms are completely different',
        fact: 'Internal clitoral tissue surrounds the vagina, so many "vaginal" orgasms likely involve clitoral stimulation reached from inside.',
      },
    ],

    keySources: [
      {
        citation: 'O\'Connell, H. E., et al. (2005). Journal of Urology, 174(4), 1189-1195.',
        finding: 'MRI imaging study mapping the full clitoral structure, revealing its 9cm size and internal components.',
      },
      {
        citation: 'Foldes, P., & Buisson, O. (2009). Journal of Sexual Medicine, 6(5), 1223-1231.',
        finding: 'Ultrasound study showing how the clitoris moves and engorges during arousal and stimulation.',
      },
      {
        citation: 'Jannini, E. A., et al. (2014). Nature Reviews Urology, 11(9), 531-538.',
        finding: 'Review describing the clitourethrovaginal complex and its role in female sexual response.',
      },
    ],

    relatedConceptIds: ['clitoral-structure', 'nerve-density', 'clitourethrovaginal', 'internal-stimulation'],
    relatedExplainerIds: ['orgasm-gap'],
    tier: 'free',
  },

  {
    id: 'mind-body',
    title: 'The Mind-Body Connection',
    subtitle: 'Attention is part of the instrument',
    icon: 'bulb',
    image: require('../assets/images/explainers/mind-body.png'),
    readTime: '5 min read',
    overview:
      'Pleasure is not only what touches you. Where your attention sits—inside the sensation, or outside evaluating—changes what the same touch feels like. Spectatoring, presence, and non-concordance are lived patterns, not character flaws.',

    keyTakeaways: [
      'Spectatoring—watching and grading yourself mid-sex—pulls attention off sensation and dulls arousal.',
      'Embodied presence (attention on what you feel) tends to deepen pleasure.',
      'Non-concordance—body signs not matching how turned on you feel—is common and normal.',
      'Mindfulness-style practice can improve satisfaction by training that redirect.',
      'Where you place attention matters as much as technique.',
    ],

    sections: [
      {
        title: 'Attention changes the signal',
        content: [
          {
            type: 'text', content: `Touch sends information; the mind decides how much of it becomes pleasure. Focused on sensation, the same contact can feel vivid. Pulled toward worry, appearance, or the clock, it can fade.

That is why sex can feel electric one night and muted the next with nothing "wrong" physically. Attention is a lever you can practice—not a personality trait you either have or lack.` }
        ]
      },
      {
        title: 'Spectatoring',
        content: [
          {
            type: 'text', content: `Spectatoring is stepping outside yourself mid-encounter to observe and grade: Do I look okay? Am I taking too long? Are they bored? Masters and Johnson named the pattern decades ago; people still recognize it instantly.

Those questions use the same attention you need for pleasure. The habit correlates with lower arousal and more difficulty—not because you are broken, but because you left the room mentally.` },
          { type: 'callout', title: 'A quiet redirect', content: 'When you notice you have slipped into observer mode, name it privately and return to one concrete sensation—pressure, warmth, breath—without arguing with the critic.' },
        ]
      },
      {
        title: 'Presence over performance',
        content: [
          {
            type: 'text', content: `Presence here means non-judgmental attention on what you are feeling—not a blank mind. Lori Brotto and others have shown mindfulness training can help people with arousal difficulty by practicing that return from anxious thought to body sensation.

You are not failing when your mind wanders. You are practicing when you notice the wander and come back: What does this touch feel like right now?` }
        ],
        statistic: {
          value: 'Significant improvement',
          label: 'Sexual satisfaction after mindfulness training',
          source: 'Brotto, 2018',
        },
      },
      {
        title: 'When body and mind disagree',
        content: [
          {
            type: 'text', content: `Non-concordance is when physical signs (lubrication, blood flow) do not match how turned on you feel—or the reverse. For women, overlap between genital response and subjective arousal is often only about 10–25%; for men the match is tighter. That mismatch is normal response, not dysfunction.

Felt arousal—and consent—live in your experience, not in what a body "should" show. Dry does not mean uninterested; wet does not mean yes.` }
        ],
        statistic: {
          value: '10-25%',
          label: 'Overlap between physical and subjective arousal in women',
          source: 'Chivers et al., 2010',
        },
      },
    ],

    misconceptions: [
      {
        myth: 'Physical arousal signs mean you\'re turned on',
        fact: 'Bodies can respond without subjective desire. Only you know if you are turned on; visible signs are not a reliable readout.',
      },
      {
        myth: 'Being present during sex should come naturally',
        fact: 'Focused attention is a skill. Minds wander; learning to return to sensation is practice, not an innate gift.',
      },
      {
        myth: 'Thinking about pleasure helps you experience more of it',
        fact: 'Evaluating pleasure often pulls you out of feeling it. Sensation-focused attention usually works better than commentary.',
      },
    ],

    keySources: [
      {
        citation: 'Masters, W. H., & Johnson, V. E. (1970). Human Sexual Inadequacy.',
        finding: 'Introduced the concept of "spectatoring" as a barrier to sexual response and satisfaction.',
      },
      {
        citation: 'Brotto, L. A. (2018). Better Sex Through Mindfulness. Greystone Books.',
        finding: 'Reviews research showing mindfulness-based interventions improve arousal, desire, and satisfaction.',
      },
      {
        citation: 'Chivers, M. L., et al. (2010). Archives of Sexual Behavior, 39(1), 5-56.',
        finding: 'Meta-analysis finding low correlation (10%) between genital response and subjective arousal in women.',
      },
      {
        citation: 'Barlow, D. H. (1986). American Psychologist, 41(2), 140-148.',
        finding: 'Research on how self-focused attention interferes with sexual arousal.',
      },
    ],

    relatedConceptIds: ['spectatoring', 'embodied-presence', 'non-concordance', 'body-appreciation', 'sexual-self-esteem'],
    relatedExplainerIds: ['communication-science'],
    tier: 'free',
  },

  {
    id: 'communication-science',
    title: 'Communication Science',
    subtitle: 'Naming what you want is intimate, not demanding',
    icon: 'chatbubbles',
    image: require('../assets/images/explainers/communication-science-101.png'),
    readTime: '4 min read',
    overview:
      'Asking for what you want is one of the strongest patterns linked to sexual satisfaction—and one of the hardest things people actually do. The research is less about scripts and more about why silence feels safer than it is.',

    keyTakeaways: [
      'Talking about sex is among the strongest predictors of sexual satisfaction.',
      'Over half of women (55%) want to communicate about sex but choose not to.',
      'Fear of hurting a partner\'s feelings is the most common barrier (42%).',
      'People who ask for what they want report higher orgasm rates.',
      'Partners usually respond more warmly than the silence assumes.',
    ],

    sections: [
      {
        title: 'Why naming it matters',
        content: [
          {
            type: 'text', content: `Across studies, sexual communication and satisfaction move together. A large meta-analysis put the association in the strong range for psychology research—and the link is often stronger for women than for men.

That fits the orgasm gap: when pleasure needs contact and pacing that are not automatic in the default script, someone has to name them. Preferences, in-the-moment feedback, and quieter desire talks all count.` }
        ],
        statistic: {
          value: 'r = .43',
          label: 'Correlation between communication and satisfaction',
          source: 'Mallory, 2022 meta-analysis',
        },
      },
      {
        title: 'Why we stay quiet',
        content: [
          {
            type: 'text', content: `Wanting to speak and speaking are different acts. Common barriers: fear of hurting a partner's feelings (about 42%), discomfort with explicit talk (about 40%), embarrassment about desire (38%), worry about seeming demanding (35%).

Those fears usually overestimate the damage. Partners tend to receive clear preference language more positively than people predict—especially when it is specific and kind.` }
        ],
        statistic: {
          value: '55%',
          label: 'Of women want to communicate but decide not to',
          source: 'Herbenick et al., 2019',
        },
      },
      {
        title: 'What tends to work',
        content: [
          {
            type: 'text', content: `Positive framing ("I love when you…") lands more easily than critique. Specific guidance ("a little slower," "right there") beats vague hints. Some conversations belong outside the bedroom—patterns, curiosities, what you have learned about yourself. Some belong in the moment—pressure, speed, place.` },
          { type: 'callout', title: 'Why vocabulary helps', content: 'When you can name angling, pairing, or a warmup window, the ask gets precise—and less like a vague complaint.' }
        ]
      },
      {
        title: 'From knowing to saying',
        content: [
          {
            type: 'text', content: `Start smaller than a summit talk. "That feels good" and "a little softer" train both your voice and their listening. Notice & Name phrases are private language you can borrow and adapt—words ready when the moment is live.

Temporary awkwardness for clearer pleasure is a fair trade. Naming what you want is intimacy, not a demand letter.` },
          { type: 'quote', content: 'Temporary discomfort for lasting improvement is a worthwhile trade.', accent: 'secondary' }
        ]
      },
    ],

    misconceptions: [
      {
        myth: 'Good partners should just know what you want',
        fact: 'No one can read a changing body perfectly. Preferences differ and shift. Asking is care, not a failure of romance.',
      },
      {
        myth: 'Asking for what you want ruins the mood',
        fact: 'Clear guidance usually raises satisfaction. Brief, kind direction helps a partner succeed—for both of you.',
      },
      {
        myth: 'Being direct means being demanding or critical',
        fact: 'Preferences are trust. Most partners prefer knowing what feels good to guessing in the dark.',
      },
    ],

    keySources: [
      {
        citation: 'Mallory, A. B. (2022). Journal of Sex Research, meta-analysis.',
        finding: 'Meta-analysis finding r=.43 correlation between sexual communication and satisfaction, with stronger effects for women.',
      },
      {
        citation: 'Herbenick, D., et al. (2019). PLOS ONE.',
        finding: 'Survey finding 55% of women want to communicate about sex but decide not to, with barriers including fear of hurting feelings.',
      },
      {
        citation: 'Frederick, D. A., et al. (2017). Journal of Sex Research.',
        finding: 'Women who ask for what they want during sex report significantly higher orgasm frequency.',
      },
      {
        citation: 'MacNeil, S., & Byers, E. S. (2009). Journal of Sex Research.',
        finding: 'Research on self-disclosure in sexual relationships showing positive outcomes from vulnerability.',
      },
    ],

    relatedConceptIds: ['responsive-desire', 'warmup-window', 'spectatoring'],
    relatedExplainerIds: ['orgasm-gap', 'mind-body'],
    tier: 'free',
  },
];

// Helper functions
export function getExplainerById(id: string): ResearchExplainer | undefined {
  return explainers.find((e) => e.id === id);
}

export function getExplainersForConcept(conceptId: string): ResearchExplainer[] {
  return explainers.filter((e) => e.relatedConceptIds.includes(conceptId));
}

export function getAllExplainers(): ResearchExplainer[] {
  return explainers;
}
