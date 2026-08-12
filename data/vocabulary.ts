// Vocabulary content for Notice & Name
// Based on research from Hensel et al., 2021 (PLOS ONE)

import { Concept } from '@/types';
import { getPathwayById } from './pathways';

export const concepts: Concept[] = [
  {
    id: 'angling',
    name: 'Angling',
    category: 'technique',
    definition:
      'Tilting or shifting the pelvis during penetration so internal pressure lands somewhere better.',
    description: `Angling is a small pelvic tilt — forward, back, or side to side — that changes where pressure lands inside.

Many people already do it without a name: hips shift mid-way because something suddenly feels more right. Naming the move makes that catch repeatable, and easier to ask for.

It does not have to be dramatic. A few degrees can redirect everything; some people chase one favorite tilt, others keep adjusting as sensation moves.`,
    researchBasis:
      'Identified in the OMGyes Pleasure Report research as one of four named techniques associated with enhanced pleasure. The research found that having language for this movement helped women recognize and replicate what works for them.',
    source: 'Hensel et al., 2021, PLOS ONE',
    recognitionPrompts: [
      'Have you ever noticed yourself tilting your hips to change how something feels?',
      'Do certain positions feel better because of the angle they create?',
      'Have you found yourself adjusting your body position to intensify or change sensations?',
    ],
    relatedConcepts: ['rocking', 'pairing'],
    tier: 'free',
    thumbnail: require('@/assets/images/concepts/thumbnails/angling.png'),
    diagramType: 'angling',
    slides: [
      {
        type: 'recognize',
        content: 'Ever tilted your hips mid-way and felt the whole thing land differently?',
      },
      {
        type: 'name',
        content: 'Angling is tilting your pelvis—forward, back, or side to side—so internal pressure lands somewhere better.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/angling.png'),
        illustrationCaption: 'A few degrees of tilt — pressure landing somewhere new',
      },
      {
        type: 'understand',
        content: 'A tiny pelvic shift can change where pressure lands. Hensel et al. (2021) found angling widely reported; giving that shift a name helps you catch and repeat what works instead of hoping it happens again.',
      },
      {
        type: 'explore',
        title: 'Try This',
        content: 'During penetration, try tilting your pelvis slightly forward, then back. Even a small shift can change which areas receive pressure. Notice which angle feels strongest—solo or with a partner.',
      },
    ],
  },
  {
    id: 'rocking',
    name: 'Rocking',
    category: 'technique',
    definition:
      'A grinding or rocking motion that keeps steady external contact during penetration.',
    description: `Rocking is staying close and moving in a grind, circle, or wave during penetration — so external contact doesn't break with each thrust.

Unlike in-and-out thrusting, rocking keeps bodies pressed together with a rhythmic motion that can hold pressure on external sensitive areas alongside whatever is happening inside.

The motion comes from the hips and pelvis. For many people it is a way to get continuous external stimulation without needing hands — closeness doing the work that distance loses.`,
    researchBasis:
      'Research shows that consistent external stimulation is important for pleasure for many women. Rocking was identified as a specific named technique that facilitates this during partnered penetrative activity.',
    source: 'Hensel et al., 2021, PLOS ONE',
    recognitionPrompts: [
      'Have you noticed a difference between grinding/rocking motions versus thrusting?',
      'Do you find that staying close and moving rhythmically feels different than more separated movement?',
      'Have you experienced how certain motions maintain more consistent contact with sensitive areas?',
    ],
    relatedConcepts: ['angling', 'pairing'],
    tier: 'free',
    thumbnail: require('@/assets/images/concepts/thumbnails/rocking.png'),
    diagramType: 'rocking',
    slides: [
      {
        type: 'recognize',
        content: 'Ever stayed pressed close and ground in small circles — and felt that hold better than thrusting in and out?',
      },
      {
        type: 'name',
        content: 'Rocking is a grinding or wave-like motion that keeps steady external contact during penetration—often without using your hands.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/rocking.png'),
        illustrationCaption: 'Bodies close — pressure holding instead of breaking with each thrust',
      },
      {
        type: 'understand',
        content: 'If steady external contact matters to your pleasure, pulling apart with each thrust can interrupt it. Rocking keeps bodies close so pressure can stay continuous; Hensel et al. (2021) identified it as one named way people do that.',
      },
      {
        type: 'explore',
        title: 'Try This',
        content: 'Instead of in-and-out, stay close and move your hips in a slow wave or figure eight. Notice what changes in external sensation when contact stays steady.',
      },
    ],
  },
  {
    id: 'shallowing',
    name: 'Shallowing',
    category: 'technique',
    definition:
      'Focusing stimulation at or just inside the vaginal entrance — treating shallow as the destination, not a warm-up.',
    description: `Shallowing is pleasurable touch right at the vaginal entrance and the first inch or two inside — fingertips, tongue, tip of a toy or partner — without treating depth as the goal.

That rim is nerve-rich. For many people it is more sensitive than deeper contact, and lingering there can make later touch land better.

Circling, light pressure, teasing, or simply staying put reframes shallow penetration as intentional pleasure, not something incomplete.`,
    researchBasis:
      'The vaginal entrance (introitus) contains a high density of nerve endings. Research identified shallowing as a distinct technique that many women find pleasurable, challenging assumptions that deeper always means better.',
    source: 'Hensel et al., 2021, PLOS ONE',
    recognitionPrompts: [
      'Have you noticed that the entrance area can feel especially sensitive?',
      'Do you sometimes enjoy the beginning moments of penetration most?',
      'Have you experienced pleasure from gentle, shallow touch rather than deeper stimulation?',
    ],
    relatedConcepts: ['pairing'],
    tier: 'free',
    thumbnail: require('@/assets/images/concepts/thumbnails/shallowing.png'),
    diagramType: 'shallowing',
    slides: [
      {
        type: 'recognize',
        content: 'Noticed that right at the entrance can feel more alive than going deep — and that lingering there is the point?',
      },
      {
        type: 'name',
        content: 'Shallowing means making the entrance and first inch or two the focus—not treating depth as the goal.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/shallowing.png'),
        illustrationCaption: 'The entrance — shallow contact as the destination',
      },
      {
        type: 'understand',
        content: 'The entrance can be the most responsive part for you, and staying there can make later touch feel better. Hensel et al. (2021) found shallowing widely reported; it is a preference and a point of pleasure, not “just teasing.”',
      },
      {
        type: 'explore',
        title: 'Try This',
        content: 'Instead of rushing deeper, stay at the entrance. Circle slowly or hold gentle pressure. Treat this zone as a destination. Notice how sensation changes when you slow down.',
      },
    ],
  },
  {
    id: 'pairing',
    name: 'Pairing',
    category: 'technique',
    thumbnail: require('@/assets/images/concepts/thumbnails/pairing.png'),
    definition:
      'Adding external clitoral touch during penetration — hand, partner, toy, or position — so inside and outside work together.',
    description: `Pairing is penetration plus clitoral touch at the same time — your hand, a partner's, a toy, or a position that keeps outside contact alive.

Penetration alone often skips the tissue that does most of the work. Pairing treats that as information, not a flaw: two inputs, one experience.

Reaching down, guiding a hand, or picking a closer position are all pairing. The point is combination, not either-or.`,
    researchBasis:
      'Extensive research shows that the clitoris, not the vagina, is the primary site of orgasmic sensation for most women. Studies find that adding clitoral stimulation during penetration significantly increases likelihood of orgasm.',
    source: 'Hensel et al., 2021, PLOS ONE; Frederick et al., 2018',
    recognitionPrompts: [
      'Do you find that penetration feels better when combined with external touch?',
      'Have you added your own touch during partnered experiences?',
      'Do you notice a difference in intensity when both internal and external stimulation happen together?',
    ],
    relatedConcepts: ['angling', 'rocking', 'shallowing'],
    tier: 'free',
    diagramType: 'pairing',
    slides: [
      {
        type: 'recognize',
        content: 'Found that penetration alone doesn\'t quite get you there, but adding clitoral touch changes everything?',
      },
      {
        type: 'name',
        content: 'Pairing means keeping clitoral touch alongside penetration—by hand, toy, partner, or position.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/pairing.png'),
        illustrationCaption: 'Inside and outside touch at once — not either-or',
      },
      {
        type: 'understand',
        content: 'Clitoral involvement tracks with higher orgasm likelihood during partnered sex (Frederick et al., 2018; Hensel et al., 2021). Pairing adds that touch during penetration — common physiology, not a workaround for something broken.',
      },
      {
        type: 'explore',
        title: 'Try This',
        content: 'During penetration, add clitoral touch in whatever way feels natural—your hand, a toy, or guiding a partner\'s hand. Notice whether intensity or focus changes.',
      },
    ],
  },

  // ============ SENSATIONS & QUALITIES ============
  {
    id: 'building',
    name: 'Building',
    category: 'sensation',
    definition:
      'Arousal that gathers gradually — warmth and intensity rising over time, not all at once.',
    description: `Building is arousal gathering — a little warmth that turns insistent if you leave it alone long enough.

It can feel like momentum under the skin: subtle at first, then more focused, more hard to ignore. Anticipation and sensation blend here.

Rushing past the climb often flattens the peak. Letting it accumulate is not delay — for many people it is the good part.`,
    researchBasis:
      'Research on sexual response cycles identifies arousal building as a distinct phase. Studies show that extended arousal periods often correlate with more satisfying experiences and stronger orgasms.',
    source: 'Masters & Johnson; Basson, 2000',
    recognitionPrompts: [
      'Have you noticed pleasure intensifying gradually rather than all at once?',
      'Do you experience a gathering or accumulating quality to arousal?',
      'Have you found that taking time to let sensations build leads to different outcomes?',
    ],
    relatedConcepts: ['plateauing', 'edging', 'warmup-window'],
    tier: 'free',
    diagramType: 'building',
    thumbnail: require('@/assets/images/concepts/thumbnails/building.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Felt arousal start as barely anything — a little warmth — then slowly grow into something undeniable?',
      },
      {
        type: 'name',
        content: 'Building is arousal that gathers gradually—warmth and intensity increasing over time rather than arriving all at once.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/building.png'),
        illustrationVideo: require('@/assets/videos/building.mp4'),
        illustrationCaption: 'Warmth gathering under the skin, intensity rising',
      },
      {
        type: 'understand',
        content: 'Arousal can gather in stages: a little warmth, then more focus and intensity. Sexual response models describe this building phase (Masters & Johnson; Basson, 2000); leaving it room to accumulate can make the climb itself feel fuller.',
      },
      {
        type: 'explore',
        title: 'Notice This',
        content: 'Next time arousal begins, stay with subtle sensations before increasing intensity. Let them grow at their own pace. Notice whether the build itself becomes part of the pleasure.',
      },
    ],
  },
  {
    id: 'plateauing',
    name: 'Plateauing',
    category: 'sensation',
    thumbnail: require('@/assets/images/concepts/thumbnails/plateauing.png'),
    definition:
      'Arousal that holds steady — not climbing, not fading — a hover you can savor or read as a cue to change.',
    description: `Plateauing is arousal holding altitude — steady, not tipping over, not dropping away.

Sometimes that hover is the good part: high and even, worth staying with. Other times it is information that pace, pressure, or kind of touch wants a shift.

Naming the plateau drops the panic that something stalled. You can stay, or change — both are responses, not failures.`,
    researchBasis:
      'Sexual response research identifies a plateau phase as common in arousal cycles. Understanding this phase helps differentiate between a natural pause and a signal that stimulation needs adjustment.',
    source: 'Masters & Johnson sexual response cycle',
    recognitionPrompts: [
      'Have you noticed arousal leveling off at a consistent intensity?',
      'Do you sometimes reach a point where pleasure is steady but not increasing?',
      'Have you experienced moments of "hovering" at high arousal before orgasm?',
    ],
    relatedConcepts: ['building', 'edging'],
    tier: 'free',
    diagramType: 'plateauing',
    slides: [
      {
        type: 'recognize',
        content: 'Reached a point where arousal just holds — steady, not fading, not climbing — like hovering?',
      },
      {
        type: 'name',
        content: 'Plateauing is arousal holding steady—neither climbing toward orgasm nor fading away.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/plateauing.png'),
        illustrationCaption: 'Arousal holding altitude — not climbing, not dropping',
      },
      {
        type: 'understand',
        content: 'High arousal can hold steady without meaning anything has gone wrong. Sexual response models call this a plateau phase (Masters & Johnson); you can stay with the hover or change what you are doing if you want movement again.',
      },
      {
        type: 'explore',
        title: 'Notice This',
        content: 'When you feel arousal holding steady, ask: Is this a delicious hover? Or is my body asking for something different? Both are valid. The awareness itself is the skill.',
      },
    ],
  },
  {
    id: 'edging',
    name: 'Edging',
    category: 'sensation',
    definition:
      'Intentionally approaching the edge of orgasm, then easing back before it happens — often repeated multiple times.',
    description: `Edging is bringing yourself (or being brought) close to orgasm, then deliberately pausing or slowing before you cross — often more than once.

Some people edge to stretch the climb, finding prolonged arousal satisfying on its own. Others find the eventual release hits harder after the wait, as if the buildup had somewhere to go.

It asks for body awareness: catching your own pre-orgasm signals in time to ease off. The point is not a perfect performance of control — it is turning a rush to the finish into something you can actually feel.`,
    researchBasis:
      'Studies on orgasm intensity suggest that delayed orgasm following extended arousal often feels more powerful. Edging is also studied as a technique for orgasm control and sexual mindfulness.',
    source: 'Research on orgasm delay and intensity',
    recognitionPrompts: [
      'Have you ever intentionally paused right before orgasm to prolong the experience?',
      'Do you notice that delayed orgasms sometimes feel more intense?',
      'Have you explored the sensations of being close to the edge without going over?',
    ],
    relatedConcepts: ['building', 'plateauing', 'embodied-presence'],
    tier: 'free',
    thumbnail: require('@/assets/images/concepts/thumbnails/edging.png'),
    diagramType: 'edging',
    slides: [
      {
        type: 'recognize',
        content: 'Ever get almost there, ease off on purpose, then climb again — and found the release hit harder for the wait?',
      },
      {
        type: 'name',
        content: 'Edging is deliberately approaching orgasm, then easing back before you cross—often repeating the cycle.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/edging.png'),
        illustrationCaption: 'Climbing toward the edge, then easing back',
      },
      {
        type: 'understand',
        content: 'Research on orgasm delay suggests that prolonged arousal before release is often subjectively more intense for some people. Edging can also sharpen awareness of your own pre-orgasm signals—when to slow, pause, or change rhythm.',
      },
      {
        type: 'explore',
        title: 'Try This',
        content: 'When you feel orgasm approaching, slow down or pause. Let the intensity recede slightly. Then build again. Notice: does the eventual release feel different when you\'ve edged first?',
      },
    ],
  },
  {
    id: 'spreading',
    name: 'Spreading',
    category: 'sensation',
    definition:
      'Pleasure radiating outward from where you\'re touched, through the rest of the body.',
    description: `Spreading is when pleasure leaves the contact point and moves — through the pelvis, up the spine, into the limbs, or across the whole body.

Some people feel it as warmth; others as tingling, electricity, or slow waves. It is often what makes arousal feel full-body rather than purely genital.

Noticing it can shift the night: less chasing one spot, more room for the feeling to travel. For some, spreading shows up when they are relaxed enough to stop gripping the moment.`,
    researchBasis:
      'Research on embodied sexuality notes that awareness of whole-body sensation often correlates with more satisfying sexual experiences. Spreading relates to concepts of body-wide arousal versus localized stimulation.',
    source: 'Embodied sexuality research; sensate focus studies',
    recognitionPrompts: [
      'Have you noticed pleasure traveling from one area through other parts of your body?',
      'Do you experience tingling, warmth, or waves that spread beyond the point of stimulation?',
      'Have you felt arousal in areas that aren\'t being directly touched?',
    ],
    relatedConcepts: ['building', 'pulsing', 'embodied-presence'],
    tier: 'free',
    diagramType: 'spreading',
    thumbnail: require('@/assets/images/concepts/thumbnails/spreading.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Felt pleasure leave the spot you were touching — warmth or tingling traveling through the rest of you?',
      },
      {
        type: 'name',
        content: 'Spreading is arousal moving outward from where you\'re touched—into the pelvis, spine, limbs, or whole body.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/spreading.png'),
        illustrationVideo: require('@/assets/videos/spreading.mp4'),
        illustrationCaption: 'Warmth moving past the place you\'re touched',
      },
      {
        type: 'understand',
        content: 'Sometimes pleasure stops feeling pinned to one contact point and starts moving through the rest of you. Research on embodied sexuality links attention to whole-body sensation with more satisfying experiences; spreading is one way people describe that movement.',
      },
      {
        type: 'explore',
        title: 'Notice This',
        content: 'During arousal, expand your attention beyond where you\'re being touched. Can you feel sensation in areas that aren\'t receiving direct contact? Let your awareness follow wherever the pleasure spreads.',
      },
    ],
  },
  {
    id: 'pulsing',
    name: 'Pulsing',
    category: 'sensation',
    definition:
      'A rhythmic, wave-like quality in high arousal or orgasm — beating or throbbing rather than flat.',
    description: `Pulsing is pleasure with a beat — throbbing, wave-like, not a flat steady hum. You may notice it during high arousal or orgasm, and it may invite touch that matches, holds, or plays against the rhythm.

Sometimes it tracks the heartbeat; sometimes it is its own tempo. Either way, it is information: some people want touch that matches that beat, holds still with it, or plays against it.

Naming the pulse makes it easier to ask for the rhythm that actually carries you, instead of treating every night like it should escalate the same way.`,
    researchBasis:
      'Orgasm research documents rhythmic pelvic muscle contractions occurring approximately every 0.8 seconds during orgasm. Many people report subjective experiences that correspond to these physical rhythms.',
    source: 'Meston & Buss, 2009; physiology of orgasm research',
    recognitionPrompts: [
      'Have you noticed a rhythmic, beating quality to arousal or orgasm?',
      'Do you experience waves or pulses of sensation during high arousal?',
      'Have you felt throbbing or rhythmic contractions during orgasm?',
    ],
    relatedConcepts: ['building', 'spreading'],
    tier: 'free',
    diagramType: 'pulsing',
    thumbnail: require('@/assets/images/concepts/thumbnails/pulsing.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Caught a throb or wave-beat in high arousal — sensation with its own tempo, not a flat hum?',
      },
      {
        type: 'name',
        content: 'Pulsing is the rhythmic, throbbing quality pleasure can take—waves of sensation rather than a flat steady tone.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/pulsing.png'),
        illustrationVideo: require('@/assets/videos/pulsing.mp4'),
        illustrationCaption: 'A beat running through the body at the high end of arousal',
      },
      {
        type: 'understand',
        content: 'A pulse can give pleasure its own tempo. Physiology studies describe rhythmic pelvic muscle contractions during orgasm, often about once per second (Meston & Buss, 2009); some people feel a similar rhythm earlier and like touch that meets it or moves differently.',
      },
      {
        type: 'explore',
        title: 'Notice This',
        content: 'During high arousal, tune into any rhythmic quality. Can you feel a pulse or throb? Some find that syncing stimulation to this natural rhythm—or playing against it—creates interesting effects.',
      },
    ],
  },

  // ============ TIMING & PACING ============
  {
    id: 'warmup-window',
    name: 'Warm-up Window',
    category: 'timing',
    thumbnail: require('@/assets/images/concepts/thumbnails/warmup-window.png'),
    definition:
      'The time many bodies need for whole-body arousal before genital-focused touch feels best — often twenty minutes or more.',
    description: `The warm-up window is how long many bodies need before genital-focused touch feels good — often twenty minutes or more of unhurried, whole-body contact. It is timing, not a delay to apologize for.

For many vulva-owners, blood flow, lubrication, and full-body arousal take roughly twenty to forty-five minutes to catch up. Jumping straight to genital touch can feel muted, scratchy, or simply less than it could.

Owning the window reframes that slower start as the good part of the night, not a chore you rush so the “real” sex can begin.`,
    researchBasis:
      'Studies on genital blood flow and arousal timing show significant gender differences. Research indicates that adequate warm-up time correlates with better lubrication, comfort, and reported pleasure.',
    source: 'Chivers et al., 2010; arousal timing research',
    recognitionPrompts: [
      'Do you find that touch feels better after you\'ve had time to get warmed up?',
      'Have you noticed that rushing can make stimulation feel less enjoyable?',
      'Does your body seem to have its own timeline for getting fully aroused?',
    ],
    relatedConcepts: ['building', 'responsive-desire'],
    tier: 'free',
    diagramType: 'warmup-window',
    slides: [
      {
        type: 'recognize',
        content: 'Ever notice genital touch feels muted until you\'ve had unhurried time first — then suddenly it lands?',
      },
      {
        type: 'name',
        content: 'The warm-up window is the time before genital-focused touch feels best—often twenty unhurried minutes or more of whole-body contact.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/warmup-window.png'),
        illustrationCaption: 'Warmth building before touch gets specific',
      },
      {
        type: 'understand',
        content: 'Arousal often rises gradually—blood flow, lubrication, and wanting can take twenty to forty-five minutes to catch up (Chivers et al., 2010). Skipping that window isn\'t efficiency; it\'s skipping the part that makes the rest feel good.',
      },
      {
        type: 'explore',
        title: 'Reframe This',
        content: 'If you need time to warm up, that is information—not a flaw. Experiment with treating whole-body touch as central, not as a prelude you must rush through.',
      },
    ],
  },
  {
    id: 'responsive-desire',
    name: 'Responsive Desire',
    category: 'timing',
    definition:
      'Wanting that wakes once touch, mood, or connection is already underway — not as a spontaneous urge beforehand.',
    description: `Responsive desire is wanting that shows up after something has started — a kiss, a hand, a mood — not as an out-of-the-blue urge.

It is a common, healthy pattern, especially in longer relationships. Missing a spontaneous spark beforehand is not low desire by itself; many people get fully into it once the on-ramp begins.

Naming this drops the pressure to “feel like it” first. You can begin gently, stay free to pause, and let wanting arrive when the conditions are right.`,
    researchBasis:
      'Dr. Emily Nagoski\'s synthesis of desire research highlights responsive desire as a normal, common pattern. Studies show responsive desire is particularly common for women and doesn\'t indicate low libido.',
    source: 'Nagoski, 2015; Basson circular model of desire',
    recognitionPrompts: [
      'Do you rarely feel spontaneous urges for sex, but enjoy it once you get started?',
      'Does your desire seem to show up after physical touch or kissing begins?',
      'Have you felt like something must be wrong because you don\'t often think about wanting sex?',
    ],
    relatedConcepts: ['spontaneous-desire', 'warmup-window'],
    tier: 'free',
    diagramType: 'responsive-desire',
    thumbnail: require('@/assets/images/concepts/thumbnails/responsive-desire.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Notice you don\'t get many out-of-the-blue urges — but once things get going, you\'re all in?',
      },
      {
        type: 'name',
        content: 'Responsive desire is wanting that wakes after stimulation, context, or connection—not as a spontaneous urge beforehand.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/responsive-desire.png'),
        illustrationVideo: require('@/assets/videos/responsive-desire.mp4'),
        illustrationCaption: 'Context first — wanting blooming once things begin',
      },
      {
        type: 'understand',
        content: 'Desire research describes responsive desire as a common, healthy pattern (Basson, 2000; Nagoski, 2015) — interest that wakes once touch or mood engages you. Missing a spontaneous spark beforehand is not low desire by itself.',
      },
      {
        type: 'explore',
        title: 'Reframe This',
        content: 'You do not need to feel “in the mood” before you begin. If desire often arrives after you start, experiment with conditions that help you get curious—comfort, pacing, type of touch—then notice what unfolds.',
      },
    ],
  },
  {
    id: 'spontaneous-desire',
    name: 'Spontaneous Desire',
    category: 'timing',
    definition:
      'Wanting that shows up on its own — an urge without an obvious external trigger.',
    description: `Spontaneous desire is wanting that arrives without a warm-up scene — an internal urge people often call “being in the mood.”

It is one common pattern, not the ideal. Plenty of people feel it early in relationships or some days and not others; responsive desire (wanting that wakes once things start) is equally ordinary.

Naming it as one door among others drops the pressure that desire should always strike first. Frequency shifts with stress, sleep, relationship stage, and life — no moral attached.`,
    researchBasis:
      'Research distinguishes between spontaneous and responsive desire patterns. Studies show that spontaneous desire is more common in men but occurs in all genders, and often decreases in frequency during long-term relationships.',
    source: 'Basson, 2000; desire research',
    recognitionPrompts: [
      'Do you sometimes feel sexually interested without any obvious cause?',
      'Have you experienced random urges or thoughts about wanting sex?',
      'Does desire ever seem to appear out of nowhere?',
    ],
    relatedConcepts: ['responsive-desire'],
    tier: 'free',
    diagramType: 'spontaneous-desire',
    thumbnail: require('@/assets/images/concepts/thumbnails/spontaneous-desire.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Ever get hit with wanting out of nowhere — mid-commute, mid-dish, no warm-up scene required?',
      },
      {
        type: 'name',
        content: 'Spontaneous desire is wanting that appears on its own—often “being in the mood” without an obvious trigger.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/spontaneous-desire.png'),
        illustrationCaption: 'Wanting rising on its own, before anyone starts',
      },
      {
        type: 'understand',
        content: 'Desire research distinguishes spontaneous from responsive patterns (Basson, 2000). Spontaneous desire shows up across genders and life stages, often more early in relationships — one valid pattern in a mix, not a required standard.',
      },
      {
        type: 'explore',
        title: 'Reframe This',
        content: 'Spontaneous desire isn\'t the "right" kind of desire—it\'s just one kind. If it shows up for you, enjoy it. If it doesn\'t, that\'s equally normal. Desire can arrive through many doors.',
      },
    ],
  },
  {
    id: 'golden-trio',
    name: 'Golden Trio',
    category: 'timing',
    thumbnail: require('@/assets/images/concepts/thumbnails/golden-trio.png'),
    definition:
      'A pattern where more than one kind of touch works together in the same encounter — especially when clitoral touch is part of the mix.',
    description: `Sometimes pleasure is built from more than one kind of touch. For some people, hands, mouth, and penetration work together in the same encounter — not necessarily all at once.

Research finds this mix associated with higher reported orgasm rates than intercourse alone or any single pair of acts. That is information about patterns, not a script to perform.

The useful question is not whether you can fit every act in. It is which combination helps your body stay interested and feel good.`,
    researchBasis:
      'Frederick et al. (2018) found that women who received genital stimulation, oral sex, and deep kissing in addition to vaginal intercourse reported the highest rates of orgasm during partnered sex.',
    source: 'Frederick et al., 2018, Archives of Sexual Behavior',
    recognitionPrompts: [
      'Have you noticed that combining different types of touch leads to different experiences?',
      'Do you find that variety in a sexual encounter affects your likelihood of orgasm?',
      'Has adding oral or manual stimulation to penetration changed your experience?',
    ],
    relatedConcepts: ['pairing', 'warmup-window'],
    tier: 'free',
    diagramType: 'golden-trio',
    slides: [
      {
        type: 'recognize',
        content: 'Ever noticed one kind of touch alone rarely gets you there — but layering hands, mouth, and penetration finally does?',
      },
      {
        type: 'name',
        content: 'The golden trio is a pattern of combining intercourse, manual, and oral stimulation—not a checklist, just one way variety can work.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/golden-trio.png'),
        illustrationCaption: 'Hands, mouth, and penetration — layered, not a script',
      },
      {
        type: 'understand',
        content: 'One kind of touch is not always the whole story. In reports studied by Frederick et al. (2018), women who experienced intercourse alongside manual genital stimulation and oral sex reported orgasm more often than those reporting intercourse alone. That describes a pattern, not a recipe: choose the mix that actually feels good.',
      },
      {
        type: 'explore',
        title: 'Consider This',
        content: 'This is not a checklist to perform. Notice whether combining types of touch—including clitoral—changes your experience. Choose variety that fits you, not a fixed script.',
      },
    ],
  },

  // ============ PSYCHOLOGICAL FACTORS ============
  {
    id: 'spectatoring',
    name: 'Spectatoring',
    category: 'psychological',
    definition:
      'Watching and grading yourself during sex instead of staying with what you feel.',
    description: `Spectatoring is stepping outside yourself mid-sex to watch and grade — how you look, how long you're taking, whether you're responding “right,” what they might be thinking.

Attention leaves sensation and lands in commentary. Instead of feeling the touch, you're running a live review: too slow, too much, not enough.

It is common, and it flattens pleasure. Coming back is rarely a pep talk — it is noticing the commentary, then dropping attention back onto one concrete feeling.`,
    researchBasis:
      'Masters and Johnson identified spectatoring as a common barrier to sexual enjoyment. Research shows that self-focused attention during sex correlates with lower arousal, reduced pleasure, and increased sexual difficulties.',
    source: 'Masters & Johnson; Barlow, 1986',
    recognitionPrompts: [
      'Do you sometimes find yourself watching yourself during sex as if from the outside?',
      'Have you been pulled out of the moment by thoughts about how you look or perform?',
      'Do you notice running mental commentary during sex instead of just feeling?',
    ],
    relatedConcepts: ['embodied-presence', 'sexual-self-esteem'],
    tier: 'free',
    diagramType: 'spectatoring',
    thumbnail: require('@/assets/images/concepts/thumbnails/spectatoring.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Ever caught yourself watching yourself during sex — how you look, how long you\'re taking, what they\'re thinking?',
      },
      {
        type: 'name',
        content: 'Spectatoring is watching and grading yourself during sex instead of staying with sensation—performance thoughts replacing feeling.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/spectatoring.png'),
        illustrationCaption: 'Split between the touch and the inner commentary',
      },
      {
        type: 'understand',
        content: 'When attention turns into a live review of your body or performance, sensation has less room. Masters and Johnson named spectatoring as a barrier to enjoyment; later work links self-focused attention with lower arousal and satisfaction (Barlow, 1986). Returning to one concrete sensation can help (Brotto, 2018).',
      },
      {
        type: 'explore',
        title: 'Practice This',
        content: 'When you notice yourself watching rather than feeling, gently redirect attention to sensation. What does this touch actually feel like? What sensations are present right now? Return to your body.',
      },
    ],
  },
  {
    id: 'embodied-presence',
    name: 'Embodied Presence',
    category: 'psychological',
    definition:
      'Staying with what your body feels during intimacy — attention in sensation, not in commentary.',
    description: `Embodied presence is being all the way in the touch — heat, pressure, breath — instead of narrating or grading it.

It is not a blank mind. Attention wanders; you notice, then drop back onto one concrete feeling. Opposite of spectatoring, not a mindfulness homework module.

When attention lands on sensation, pleasure usually sharpens. Quiet can be presence, not distance.`,
    researchBasis:
      'Mindfulness-based interventions for sexual difficulties show significant improvements in arousal and satisfaction. Research links present-focused attention during sex to better outcomes across multiple measures.',
    source: 'Brotto, 2018; mindfulness and sexuality research',
    recognitionPrompts: [
      'Have you experienced moments of being completely absorbed in physical sensation?',
      'Do you notice a difference in pleasure when you\'re fully present versus distracted?',
      'Have you tried bringing your attention back to sensation when your mind wanders?',
    ],
    relatedConcepts: ['spectatoring', 'body-appreciation'],
    tier: 'free',
    diagramType: 'embodied-presence',
    thumbnail: require('@/assets/images/concepts/thumbnails/embodied-presence.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Ever been so deep in a touch that the commentary cut out — just heat, pressure, breath?',
      },
      {
        type: 'name',
        content: 'Embodied presence is staying with bodily sensation during intimacy—feeling the touch instead of commenting on it.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/embodied-presence.png'),
        illustrationCaption: 'Heat and pressure filling the body, commentary gone quiet',
      },
      {
        type: 'understand',
        content: 'Present-focused attention during sex tracks with higher arousal and satisfaction in clinical work (Brotto, 2018). The adult move is simple: when the mind drifts, return to one concrete sensation — not a performance of mindfulness.',
      },
      {
        type: 'explore',
        title: 'Practice This',
        content: 'When your mind wanders, gently return attention to physical sensation. What does this touch feel like? Where exactly do you feel it? Embodied presence is a skill you can strengthen through practice.',
      },
    ],
  },
  {
    id: 'non-concordance',
    name: 'Non-concordance',
    category: 'psychological',
    definition:
      'When physical arousal signs (lubrication, erection) and how turned on you feel don\'t match — either way.',
    description: `Non-concordance is when body signs and wanting split. You might feel very into it with nothing obvious showing — or notice wetness or an erection when you are not actually interested.

For many women, research finds only modest overlap between genital response and felt arousal (often cited around 10–25%). Bodies can respond to sexually relevant cues without desire; desire can show up without a clear physical signal.

That split is ordinary, not a verdict. Trust words and felt wanting over body signs alone — physical response is not consent, and a quiet body is not proof of no interest.`,
    researchBasis:
      'Chivers et al. meta-analysis found low correlation between genital response and subjective arousal in women (~10%). This non-concordance is now understood as normal rather than dysfunctional.',
    source: 'Chivers et al., 2010; Nagoski, 2015',
    recognitionPrompts: [
      'Have you ever felt turned on without your body showing typical signs of arousal?',
      'Has your body responded physically to something that didn\'t actually interest you?',
      'Have you experienced disconnect between how aroused you felt and what your body was doing?',
    ],
    relatedConcepts: ['responsive-desire', 'embodied-presence'],
    tier: 'free',
    diagramType: 'non-concordance',
    thumbnail: require('@/assets/images/concepts/thumbnails/non-concordance.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Felt very into it while nothing showed — or noticed wetness when you weren\'t actually interested?',
      },
      {
        type: 'name',
        content: 'Non-concordance is when physical arousal signs and how turned on you feel don\'t match—wetness without wanting, or wanting without obvious signs.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/non-concordance.png'),
        illustrationCaption: 'Body signs and wanting running on different tracks',
      },
      {
        type: 'understand',
        content: 'Meta-analyses find only modest correlation between genital response and subjective arousal in women—often cited around 10–30% overlap (Chivers et al., 2010; Nagoski, 2015). Genital response can happen without desire; desire can exist without obvious signs. Wanting is communicated — not inferred from wetness or erection.',
      },
      {
        type: 'explore',
        title: 'Reframe This',
        content: 'Physical response doesn\'t equal wanting. Lack of visible response doesn\'t mean absence of interest. You get to trust your own experience of arousal rather than judging by physical signs alone.',
      },
    ],
  },
  {
    id: 'sexual-self-esteem',
    name: 'Sexual Self-Esteem',
    category: 'psychological',
    definition:
      'How you regard yourself as a sexual person — whether pleasure feels like something you get to want.',
    description: `Sexual self-esteem is the quiet background sense of whether you belong in your own desire — whether wanting, asking, and taking up space feel allowed, or somehow earned.

Higher sexual self-esteem tends to travel with more pleasure, more communication, and more satisfaction. Feeling entitled to your own pleasure creates room to notice what you like and say it.

It can be shaped by upbringing, past experiences, body image, relationship history, and cultural messages. It can also shift — through lived experiences that contradict the old story, not through pep talks alone.`,
    researchBasis:
      'Research consistently links sexual self-esteem to sexual satisfaction and function. Studies show it predicts orgasm frequency, arousal, and relationship satisfaction.',
    source: 'Sexuality research; self-esteem and outcomes studies',
    recognitionPrompts: [
      'How do you generally feel about yourself as a sexual person?',
      'Do you feel confident in your sexuality and desirability?',
      'Have negative feelings about your sexuality held you back from pleasure or communication?',
    ],
    relatedConcepts: ['body-appreciation', 'spectatoring'],
    tier: 'free',
    diagramType: 'sexual-self-esteem',
    thumbnail: require('@/assets/images/concepts/thumbnails/sexual-self-esteem.png'),
    slides: [
      {
        type: 'recognize',
        content: "Caught an old story mid-intimacy — that you're too much, not enough, or somehow failing at wanting what you want?",
      },
      {
        type: 'name',
        content: 'Sexual self-esteem is how you regard yourself as a sexual person—whether pleasure feels like something you get to want, not something you have to deserve.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/sexual-self-esteem.png'),
        illustrationCaption: 'Letting your own wanting take up room',
      },
      {
        type: 'understand',
        content: 'Research links sexual self-esteem with satisfaction, communication, and sexual function. Feeling entitled to your own pleasure—not perfect confidence every day—tends to travel with better outcomes over time.',
      },
      {
        type: 'explore',
        title: 'Reflect On This',
        content: 'What beliefs about yourself as a sexual person might be limiting your pleasure? Sexual self-esteem can be developed—through positive experiences, self-exploration, and challenging inherited shame.',
      },
    ],
  },
  {
    id: 'body-appreciation',
    name: 'Body Appreciation',
    category: 'psychological',
    definition:
      'Valuing your body for what it feels and does in the moment, instead of grading its appearance.',
    description: `Body appreciation is staying with sensation — what your body feels, holds, and opens to — rather than running a live review of how it looks.

During sex, that means attention on touch and response instead of appearance monitoring. The shift is not about deciding your body is perfect; it is about not letting appearance concerns steal the sensory experience.

Research links this orientation with greater satisfaction and less distraction. How you relate to your body in the moment often matters more than how it measures up.`,
    researchBasis:
      'Studies link body appreciation and positive body image to better sexual satisfaction. Women who focus on body function versus appearance during sex report more orgasms and less distraction.',
    source: 'Body image and sexuality research; Satinsky et al., 2012',
    recognitionPrompts: [
      'During sex, are you more focused on how your body looks or how it feels?',
      'Can you appreciate what your body does and feels, separate from appearance?',
      'Do appearance concerns pull you out of sensory experience during intimacy?',
    ],
    relatedConcepts: ['embodied-presence', 'sexual-self-esteem', 'spectatoring'],
    tier: 'free',
    diagramType: 'body-appreciation',
    thumbnail: require('@/assets/images/concepts/thumbnails/body-appreciation.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Mid-touch, caught yourself checking how you look instead of what you\'re feeling?',
      },
      {
        type: 'name',
        content: 'Body appreciation is valuing your body for sensation and capacity in the moment—not mainly for how it looks.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/body-appreciation.png'),
        illustrationCaption: 'Sensation first — not a live review of how you look',
      },
      {
        type: 'understand',
        content: 'Body image research links appreciating body function during sex with greater satisfaction and less appearance distraction (Satinsky et al., 2012). Weight alone does not predict sexual function; how you relate to your body in the moment often matters more.',
      },
      {
        type: 'explore',
        title: 'Practice This',
        content: 'During intimacy, when appearance concerns arise, redirect to sensation. What does this feel like? What is your body capable of experiencing right now? Let function matter more than form.',
      },
    ],
  },

  // ============ ANATOMY UNDERSTANDING ============
  {
    id: 'clitoral-structure',
    name: 'Clitoral Structure',
    category: 'anatomy',
    definition:
      'The clitoris is more than the visible glans — a connected organ with internal parts that can be reached in different ways.',
    description: `What you can see of the clitoris is only one part of the organ. It continues inside the body, with legs (crura) and bulbs that can be reached through different kinds of pressure and contact.

That shape can reframe “vaginal” pleasure: external and internal feeling may be the same organ, accessed differently.

Knowing the map makes indirect touch count — not as a compromise, but as reaching the rest of the structure.`,
    researchBasis:
      'MRI imaging studies have mapped the full clitoral structure, revealing it to be approximately 9cm including internal tissue. This research transformed understanding of female genital anatomy.',
    source: 'O\'Connell et al., 2005; clitoral anatomy research',
    recognitionPrompts: [
      'Did you know the clitoris extends internally beyond what\'s visible?',
      'Have you thought about how internal sensations might relate to clitoral structure?',
      'Does understanding this anatomy change how you think about pleasure?',
    ],
    relatedConcepts: ['nerve-density', 'clitourethrovaginal', 'internal-stimulation'],
    tier: 'free',
    diagramType: 'iceberg',
    thumbnail: require('@/assets/images/concepts/thumbnails/clitoral-structure.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Ever noticed pleasure show up deeper or wider than the little tip you can see — like the whole area is involved?',
      },
      {
        type: 'name',
        content: 'The clitoris is more than the visible glans—its connected structure includes the shaft, legs (crura), and bulbs.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/clitoral-structure.png'),
        illustrationCaption: 'Internal legs and bulbs — more than the tip you can see',
      },
      {
        type: 'understand',
        content: 'The visible glans is only one part of a larger organ, which helps explain why pressure around the front wall can feel connected to clitoral pleasure. MRI and dissection mapped that internal structure at about 9 cm in total (O\'Connell et al., 2005); the map is useful, but your own felt access still varies.',
      },
      {
        type: 'explore',
        title: 'Know This',
        content: 'Understanding this internal structure changes the picture. External stimulation matters because that\'s where the clitoris is most accessible—but the whole organ can be engaged from multiple angles.',
      },
    ],
  },
  {
    id: 'nerve-density',
    name: 'Nerve Density',
    category: 'anatomy',
    definition:
      'How densely packed with nerve endings the clitoral glans is — intense sensitivity in a small area.',
    description: `The clitoral glans is a small, highly sensitive area, so tiny changes in pressure, angle, or rhythm can land loudly.

That is why direct, hard touch can tip into too much, while lighter or more indirect contact can feel intensely good. Sensitivity also shifts with arousal.

Quality beats force here. Those nerves are picky in a useful way: they reward precision more than pressure.`,
    researchBasis:
      'Anatomical studies have counted approximately 8,000 nerve endings in the clitoral glans. This exceeds nerve density in almost any other body part of similar size.',
    source: 'Clitoral anatomy research; O\'Connell et al.',
    recognitionPrompts: [
      'Have you noticed how sensitive the clitoral area is to different types of touch?',
      'Does knowing about this concentration of nerves inform your understanding of pleasure?',
      'Have you experienced how the same area can feel too sensitive or just right depending on approach?',
    ],
    relatedConcepts: ['clitoral-structure', 'pairing'],
    tier: 'free',
    diagramType: 'nerve-density',
    thumbnail: require('@/assets/images/concepts/thumbnails/nerve-density.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Noticed how a tiny shift in pressure there can tip from perfect to too much in a second?',
      },
      {
        type: 'name',
        content: 'Nerve density helps explain why touch quality matters so much in the small, sensitive glans.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/nerve-density.png'),
        illustrationCaption: 'A small tip where tiny pressure changes land loud',
      },
      {
        type: 'understand',
        content: 'A small change in pressure can feel enormous when touch lands on a densely sensitive area. Anatomical studies count thousands of nerve endings in the clitoral glans (O\'Connell et al.), which helps explain why lighter, indirect, or well-timed touch can work better than force.',
      },
      {
        type: 'explore',
        title: 'Know This',
        content: 'Direct, intense touch on the glans can feel like too much, while the right touch produces intense pleasure. Sensitivity varies individually and changes with arousal level. Your nerve endings are communicating—listen to them.',
      },
    ],
  },
  {
    id: 'clitourethrovaginal',
    name: 'CUV Complex',
    category: 'anatomy',
    definition:
      'The linked cluster of clitoris, urethra, and front vaginal wall — the anatomy behind many “G-spot” feelings.',
    description: `The CUV complex is how the clitoris, urethra, and front vaginal wall share tissue and pressure — one connected area, not three lonely parts.

When the front wall feels especially good, it is often because pressure there reaches internal clitoral and urethral tissue together. The sensitivity is real; a separate magic button is the myth.

That shift helps: stop hunting a spot, explore what pressure and angle actually feel like in that area.`,
    researchBasis:
      'Anatomical imaging and dissection studies show the clitoris, urethra, and vaginal wall form an integrated complex. Stimulation of one component affects the others.',
    source: 'Jannini et al., 2014; anatomical imaging studies',
    recognitionPrompts: [
      'Have you experienced sensitivity on the front wall of the vagina?',
      'Does understanding how these structures connect change your view of internal pleasure?',
      'Have you explored how different angles or pressures affect sensation in this area?',
    ],
    relatedConcepts: ['clitoral-structure', 'internal-stimulation'],
    tier: 'free',
    diagramType: 'cuv-complex',
    thumbnail: require('@/assets/images/concepts/thumbnails/clitourethrovaginal.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Ever felt several kinds of sensation meet in the same front-wall area — pressure, warmth, and a deeper yes together?',
      },
      {
        type: 'name',
        content: 'The CUV complex is the connected area where the clitoris, urethra, and front vaginal wall meet.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/clitourethrovaginal.png'),
        illustrationCaption: 'Front-wall pressure reaching shared internal tissue',
      },
      {
        type: 'understand',
        content: 'That front-wall feeling can involve several connected tissues, which is why it may feel fuller than one isolated point. Imaging shows the clitoris, urethra, and anterior wall are physically linked (Jannini et al., 2014); explore the area without needing to find a separate organ.',
      },
      {
        type: 'explore',
        title: 'Know This',
        content: 'The CUV complex is a connected map, not a target to find. Notice what the whole area feels like, and let your own response matter more than a label.',
      },
    ],
  },
  {
    id: 'internal-stimulation',
    name: 'Internal Clitoral Stimulation',
    category: 'anatomy',
    definition:
      'Pleasure from front-wall pressure that reaches internal clitoral tissue — often what people mean by “G-spot” feeling.',
    description: `Internal clitoral stimulation is front-wall pressure that reaches the rest of the clitoris through the vaginal lining — toward the belly button, not deeper for depth's sake.

CUV names the linked anatomy; angling is one way to get there. This concept is the felt part: a fuller, different yes than surface touch, still the same organ accessed from inside.

When deep alone does little, the tissue that matters may simply not be getting pressed. Angle and curve usually beat force.`,
    researchBasis:
      'Studies suggest that vaginal orgasms likely involve internal clitoral stimulation. The anterior vaginal wall\'s sensitivity corresponds to underlying clitoral and urethral tissue.',
    source: 'Foldes & Buisson, 2009; G-spot research',
    recognitionPrompts: [
      'Have you experienced pleasure from stimulation on the front wall of the vagina?',
      'Do certain angles during penetration create different or more intense internal sensations?',
      'Have you explored how internal and external stimulation might work together?',
    ],
    relatedConcepts: ['clitourethrovaginal', 'clitoral-structure', 'angling'],
    tier: 'free',
    diagramType: 'internal-stimulation',
    thumbnail: require('@/assets/images/concepts/thumbnails/internal-stimulation.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Felt a fuller yes when pressure found the front wall — not deeper, just angled right?',
      },
      {
        type: 'name',
        content: 'Internal clitoral stimulation is front-wall pressure that reaches internal clitoral tissue—often what people mean by “G-spot” feeling.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/internal-stimulation.png'),
        illustrationCaption: 'A fuller internal feeling from front-wall contact',
      },
      {
        type: 'understand',
        content: 'A fuller internal feeling does not necessarily come from going deeper. Imaging and clinical work suggest many “vaginal” orgasms involve internal clitoral stimulation (Foldes & Buisson, 2009); angling helps when it brings contact toward the front wall where that tissue sits close.',
      },
      {
        type: 'explore',
        title: 'Notice This',
        content: 'Notice whether pressure toward the front wall creates a fuller or different feeling. It may be more about contact and angle than depth; if it does not feel good, there is nothing to force.',
      },
    ],
  },
];

// Helper to get concept by ID
export function getConceptById(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}

// Helper to get concepts by category
export function getConceptsByCategory(category: Concept['category']): Concept[] {
  return concepts.filter((c) => c.category === category);
}

// Helper to get concepts by tier
export function getConceptsByTier(tier: Concept['tier']): Concept[] {
  return concepts.filter((c) => c.tier === tier);
}

// Get all free concepts (for Phase 1)
export function getFreeConcepts(): Concept[] {
  return concepts.filter((c) => c.tier === 'free');
}
// Helper to get next concept for linear navigation
export function getNextConcept(currentId: string, pathwayId?: string): Concept | null {
  // 1. If a specific pathway is provided, follow that order
  if (pathwayId && pathwayId !== 'default') {
    const pathway = getPathwayById(pathwayId);

    if (pathway) {
      const currentIndex = pathway.conceptIds.indexOf(currentId);

      // If found and not the last item
      if (currentIndex !== -1 && currentIndex < pathway.conceptIds.length - 1) {
        const nextId = pathway.conceptIds[currentIndex + 1];
        return getConceptById(nextId) || null;
      }

      // If it's the last item in pathway, return null (end of pathway)
      if (currentIndex === pathway.conceptIds.length - 1) {
        return null;
      }
    }
  }

  // 2. Fallback: Default linear navigation or category-based
  const currentIndex = concepts.findIndex((c) => c.id === currentId);

  // If not found or last item, return null
  if (currentIndex === -1 || currentIndex === concepts.length - 1) {
    return null;
  }

  return concepts[currentIndex + 1];
}
