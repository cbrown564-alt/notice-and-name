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
      'Rotating, raising, or lowering the pelvis during penetration to adjust where internal stimulation occurs.',
    description: `Angling involves making subtle adjustments to pelvic position during penetrative activity. By tilting, raising, or lowering your pelvis, you can change the angle of penetration to target different areas of internal sensation.

Many people discover this technique intuitively - you might notice yourself naturally shifting position to find an angle that feels better. Naming this movement makes it easier to recognize when you're doing it and to communicate about it.

The adjustment can be small - even a slight change in pelvic tilt can shift sensations significantly. Some find certain angles consistently feel better, while others enjoy varying the angle throughout an experience.`,
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
        content: 'Have you ever shifted your hips during penetration to find an angle that felt better?',
      },
      {
        type: 'name',
        content: 'Angling is tilting your pelvis—forward, back, or side to side—to change where internal stimulation lands.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/angling.png'),
        illustrationCaption: 'How pelvic tilt redirects pressure along the anterior wall',
      },
      {
        type: 'understand',
        content: 'In the OMGyes Pleasure Report (Hensel et al., 2021), about nine in ten women reported using angling. Research suggests that naming a movement can help you notice it in the moment and repeat what works—instead of relying on vague “that felt good last time.”',
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
        content: 'Most women need some form of clitoral stimulation for orgasm; penetration alone often breaks external contact with each thrust. Rocking keeps bodies close so that pressure can stay continuous (Hensel et al., 2021).',
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
      'Focusing stimulation at or just inside the vaginal entrance rather than deeper penetration.',
    description: `Shallowing describes pleasurable touch that focuses on the vaginal entrance and the area just inside - using fingertips, tongue, or the tip of a toy or partner rather than deeper penetration.

The entrance area has a high concentration of nerve endings, and many people find stimulation here to be particularly sensitive and pleasurable. Shallowing treats this area as a destination rather than just a passage to somewhere else.

This technique can involve gentle circling, light pressure, teasing movements, or simply pausing to appreciate sensations in this area. It reframes shallow penetration as intentional and pleasurable rather than incomplete.`,
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
        content: 'Have you noticed that the first moments of penetration—right at the entrance—can feel especially sensitive?',
      },
      {
        type: 'name',
        content: 'Shallowing is focusing touch at the vaginal entrance and the first inch or two inside—not treating depth as the goal.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/shallowing.png'),
        illustrationCaption: 'Nerve-rich tissue at the introitus',
      },
      {
        type: 'understand',
        content: 'The introitus is densely innervated. In Hensel et al. (2021), shallowing was widely reported, and many participants said lingering at the entrance made later touch feel better—consistent with anatomy, not “just teasing.”',
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
      'Adding external clitoral stimulation during penetration, either solo or with a partner.',
    description: `Pairing means combining internal penetration with external clitoral stimulation - using your own hand, a partner's hand, a toy, or body positioning to add external touch during penetrative activity.

This technique directly addresses what research consistently shows: most women need clitoral stimulation for orgasm, and penetration alone often doesn't provide sufficient clitoral contact. Pairing treats this not as a problem but as useful information about how bodies work.

Pairing can happen in many ways - reaching down yourself, guiding a partner's hand, using a small vibrator, or choosing positions that naturally create external contact. The key insight is that adding this stimulation is normal, common, and makes physiological sense.`,
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
        content: 'Have you found that penetration alone doesn\'t quite get you there—but adding clitoral touch changes everything?',
      },
      {
        type: 'name',
        content: 'Pairing is combining penetration with clitoral stimulation—your hand, a partner\'s hand, a toy, or positioning that adds external touch.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/pairing.png'),
        illustrationCaption: 'Internal and external stimulation in parallel',
      },
      {
        type: 'understand',
        content: 'Research consistently links clitoral stimulation with higher orgasm likelihood during partnered sex. Frederick et al. (2018) and the OMGyes work (Hensel et al., 2021) report that many women pair penetration with external touch—not as a fix, but as a common, physiologically sensible pattern.',
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
      'A gradual increase in arousal intensity over time, like a wave gathering strength.',
    description: `Building describes the experience of arousal intensifying progressively - not jumping immediately to peak sensation, but allowing pleasure to accumulate and deepen over time.

This sensation often feels like something is gathering momentum. It might start as a subtle warmth or tingling, then gradually become more pronounced, more focused, more insistent. The building phase is often where anticipation and actual sensation blend together.

Understanding building as a named experience helps recognize that arousal doesn't need to be instant or linear. Some people find that rushing through this phase diminishes the eventual peak, while allowing building to unfold naturally leads to more intense experiences.`,
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
    thumbnail: require('@/assets/images/concepts/thumbnails/building.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Have you felt arousal start small—a hint of warmth, a whisper of tingling—then slowly intensify into something unmistakable?',
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
        illustrationCaption: 'Vascular and neural intensity rising over time',
      },
      {
        type: 'understand',
        content: 'Sexual response models describe an arousal-building phase before plateau or orgasm. Research suggests that allowing sensation to accumulate—rather than rushing—is often associated with stronger peaks (Masters & Johnson; Basson, 2000).',
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
      'Sustained arousal at a consistent level without increase - a holding pattern that may precede orgasm or signal a need for change.',
    description: `Plateauing is the experience of arousal staying at a steady level - neither building toward climax nor fading. It's like reaching a landing on a staircase and staying there for a while.

This can happen for different reasons. Sometimes plateauing is a natural pause before orgasm, a moment of hovering at high arousal. Other times, it signals that what's happening isn't quite leading where you want to go - perhaps something needs to shift, change pace, or add new stimulation.

Recognizing a plateau helps you respond to it intentionally. You might choose to savor the sustained pleasure, or you might use it as information that it's time to try something different.`,
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
    slides: [
      {
        type: 'recognize',
        content: 'Have you reached a point where arousal stays steady—not fading, but not climbing either? Like hovering at a certain altitude?',
      },
      {
        type: 'name',
        content: 'Plateauing is arousal holding steady—neither climbing toward orgasm nor fading away.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/plateauing.png'),
        illustrationCaption: 'Sustained activation without a new peak',
      },
      {
        type: 'understand',
        content: 'Classic sexual response research describes a plateau phase—high arousal maintained without immediate climax (Masters & Johnson). Recognizing it helps you choose: savor the hover, or adjust stimulation if you want something to change.',
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
      'Intentionally approaching the edge of orgasm, then easing back before it happens - often repeated multiple times.',
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
        content: 'Embodied sexuality research links attention to whole-body sensation with more satisfying experiences. Spreading is one pattern people name when arousal feels less pinned to a single spot and more free to travel.',
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
    description: `Pulsing is pleasure with a beat — throbbing, wave-like, not a flat steady hum. It shows up clearest in orgasm, when pelvic muscles contract in rhythm, but many people feel a pulse earlier in high arousal too.

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
        content: 'Physiology studies describe rhythmic pelvic muscle contractions during orgasm, often about once per second (Meston & Buss, 2009). Many people also feel a pulse earlier in arousal—and some prefer touch that matches or plays against that tempo.',
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
    slides: [
      {
        type: 'recognize',
        content: 'Ever notice genital touch feels muted until you\'ve had unhurried time first — then suddenly it lands?',
      },
      {
        type: 'name',
        content: 'The warm-up window is how long many bodies need before genital-focused touch feels best—often twenty unhurried minutes or more of whole-body contact.',
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
      'Sexual interest that arises in response to stimulation or erotic context, rather than appearing spontaneously beforehand.',
    description: `Responsive desire describes a pattern where sexual interest emerges in response to something - a partner's initiation, an erotic situation, or physical stimulation that's already begun - rather than arising spontaneously as an internal urge.

This is an extremely common pattern, especially for women in long-term relationships. Research suggests that responsive desire is just as valid and healthy as spontaneous desire - it's simply a different pathway to the same destination.

Understanding responsive desire can be liberating. It means you don't need to "feel like it" beforehand to enjoy sex. Many people with responsive desire find that once things start and they get into the experience, desire and arousal build naturally. The absence of spontaneous desire isn't a problem to fix.`,
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
    thumbnail: require('@/assets/images/concepts/thumbnails/responsive-desire.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Do you rarely feel random urges for sex—but once things start, you get into it and enjoy yourself fully?',
      },
      {
        type: 'name',
        content: 'Responsive desire is interest that shows up after stimulation, context, or connection—not as a spontaneous urge beforehand.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/responsive-desire.png'),
        illustrationVideo: require('@/assets/videos/responsive-desire.mp4'),
        illustrationCaption: 'A spark of context, then desire blooming',
      },
      {
        type: 'understand',
        content: 'Desire research (Basson, 2000; Nagoski, 2015) describes responsive desire as a common, healthy pattern—especially for women and in long-term relationships. Lack of spontaneous urge beforehand does not mean low libido; many people become interested once touch or mood engages them.',
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
      'Sexual interest that arises on its own, without an external trigger - a seemingly random urge for sexual activity.',
    description: `Spontaneous desire is sexual interest that appears to come from nowhere - an internal urge or wanting that arises without an obvious external stimulus. This is what people typically think of as "being in the mood" or "feeling horny."

While often portrayed as the normal or ideal form of desire, spontaneous desire is actually just one of two common patterns. It tends to be more common in men and in the early stages of relationships, becoming less frequent over time for many people.

Understanding spontaneous desire as one pattern among others helps remove the expectation that it should always be present. People experience different mixes of spontaneous and responsive desire, and this can vary with life circumstances, stress, relationship stage, and other factors.`,
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
    thumbnail: require('@/assets/images/concepts/thumbnails/spontaneous-desire.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Do you sometimes feel sexually interested out of nowhere—an urge that appears without any obvious cause?',
      },
      {
        type: 'name',
        content: 'Spontaneous desire is interest that appears on its own—often described as “being in the mood” without an obvious trigger.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/spontaneous-desire.png'),
        illustrationCaption: 'Internal arousal signals rising independently',
      },
      {
        type: 'understand',
        content: 'Population studies suggest spontaneous desire is reported more often by men than women, and more often early in relationships (Basson, 2000). It is one valid pattern—not the only one. Many people experience a mix of spontaneous and responsive desire over time.',
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
      'Combining intercourse with manual and oral stimulation in the same encounter — a pattern where variety often serves pleasure better than one act alone.',
    description: `The Golden Trio names a combination that shows up often in satisfying encounters: vaginal intercourse plus manual stimulation plus oral sex in the same session — not necessarily all at once.

Research finds this mix associated with higher reported orgasm rates than intercourse alone or any single pair of acts. That is information about patterns, not a script to perform.

The quieter takeaway: variety and clitoral involvement usually serve pleasure better than a singular focus. Penetration alone rarely does the whole job.`,
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
    slides: [
      {
        type: 'recognize',
        content: 'Ever noticed one kind of touch alone rarely gets you there — but layering hands, mouth, and penetration finally does?',
      },
      {
        type: 'name',
        content: 'The golden trio is intercourse plus manual and oral stimulation in the same encounter—not a checklist, just a pattern where variety (especially clitoral touch) tends to show up.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/golden-trio.png'),
        illustrationCaption: 'Hands, mouth, and penetration — layered, not a script',
      },
      {
        type: 'understand',
        content: 'Frederick et al. (2018) found that women who received intercourse, manual genital stimulation, and oral sex in the same encounter reported orgasm more often than with intercourse alone. The takeaway is statistical, not prescriptive: variety and clitoral involvement are common in high-satisfaction reports.',
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
        content: 'Masters and Johnson named spectatoring as a barrier to enjoyment; later work links self-focused attention during sex with lower arousal and satisfaction (Barlow, 1986). Coming back to one concrete sensation is often more useful than trying to think your way into presence (Brotto, 2018).',
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
      'Focused attention on bodily sensations during intimacy - being fully in your body rather than in your head.',
    description: `Embodied presence is the opposite of spectatoring - it's being fully in your body and present to sensations rather than caught up in thoughts, judgments, or mental chatter. It's what happens when you're so absorbed in feeling that thinking temporarily fades.

This isn't about forcing your mind to be blank, but about gently returning attention to physical sensation whenever you notice it has wandered. What does this touch actually feel like? What sensations are present right now? Where in my body do I feel pleasure?

Cultivating embodied presence can significantly enhance sexual experience. When attention is fully on sensation, pleasure typically intensifies. Mindfulness practices outside the bedroom can strengthen this capacity over time.`,
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
    thumbnail: require('@/assets/images/concepts/thumbnails/embodied-presence.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Have you experienced moments of being so absorbed in physical sensation that thinking temporarily faded—fully in your body rather than your head?',
      },
      {
        type: 'name',
        content: 'Embodied presence is staying with bodily sensation during intimacy—attention in the body rather than in commentary or judgment.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/embodied-presence.png'),
        illustrationCaption: 'Attention filling the outline of the body',
      },
      {
        type: 'understand',
        content: 'Mindfulness-based interventions for sexual concerns show improvements in arousal and satisfaction in clinical studies (Brotto, 2018). Present-moment focus on touch is a skill—when the mind wanders, you can gently return.',
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
        illustrationCaption: 'Belonging in your own desire',
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
      'The full clitoral organ is approximately 9cm in size, with internal legs (crura) and bulbs extending inside the body.',
    description: `The clitoris is much larger than it appears from the outside. What's visible - the glans and hood - is just the tip of an organ that extends about 9cm internally, with legs (crura) that wrap around the vaginal canal and erectile bulbs that fill with blood during arousal.

Understanding this internal structure reframes anatomy. The "G-spot" area is actually where internal clitoral tissue can be stimulated through the vaginal wall. Much of what we call vaginal pleasure involves indirect clitoral stimulation.

This anatomical reality explains why external stimulation is important for most women's pleasure and orgasm - the clitoris is the primary pleasure organ, and its visible portion is just the most accessible part of a larger structure.`,
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
    thumbnail: require('@/assets/images/concepts/thumbnails/clitoral-structure.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Did you know that what you can see of the clitoris is just the tip? The full structure extends about 9cm inside your body.',
      },
      {
        type: 'name',
        content: 'The clitoris is mostly internal: glans, shaft, crura (“legs”), and vestibular bulbs—about 9 cm total, not just the visible tip.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/clitoral-structure.png'),
        illustrationCaption: 'Crura and bulbs wrapping the vaginal canal',
      },
      {
        type: 'understand',
        content: 'MRI and dissection work mapped the full clitoral structure (O\'Connell et al., 2005). Anterior vaginal sensitivity often reflects internal clitoral and urethral tissue—not a separate “spot.” Most vaginal pleasure is still clitoral stimulation, accessed indirectly.',
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
      'The clitoral glans contains over 8,000 nerve endings - approximately equal to the entire penis.',
    description: `The clitoral glans (the visible external portion) contains more than 8,000 nerve endings - a remarkable concentration in a structure much smaller than the penis, which has approximately the same number spread across a larger area.

This density of nerve endings makes the clitoral glans extremely sensitive. This is why direct, intense stimulation of the glans can sometimes feel like too much, while the right kind of touch can produce intense pleasure. Sensitivity varies individually and can change with arousal level.

Understanding nerve density helps explain why clitoral stimulation is central to most women's orgasms - this is where the highest concentration of pleasure-sensing nerves exists. It's also why touch approach matters so much - all those nerves respond to subtleties of pressure, rhythm, and technique.`,
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
    thumbnail: require('@/assets/images/concepts/thumbnails/nerve-density.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Have you noticed how incredibly sensitive the clitoral area can be—how subtle differences in pressure or touch create dramatically different sensations?',
      },
      {
        type: 'name',
        content: 'Nerve density describes how packed with nerve endings the clitoral glans is—roughly 8,000 in a small area, comparable to the penis but more concentrated.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/nerve-density.png'),
        illustrationCaption: 'Dense neural network in the glans',
      },
      {
        type: 'understand',
        content: 'Anatomical studies count thousands of nerve endings in the clitoral glans (O\'Connell et al.). That density helps explain why touch quality—pressure, rhythm, indirect vs direct—matters so much, and why intensity can feel “too much” for some people at the wrong moment.',
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
      'The integrated tissue cluster where clitoris, urethra, and anterior vaginal wall interact - explaining "G-spot" sensitivity.',
    description: `The clitourethrovaginal (CUV) complex describes how the clitoris, urethra, and front vaginal wall are interconnected rather than separate structures. This tissue cluster explains the sensitivity of the area often called the "G-spot."

When the front wall of the vagina feels particularly sensitive, it's because pressure there affects the internal portions of the clitoris and the urethra - all richly supplied with nerves. There isn't a distinct "spot" so much as an area where multiple sensitive structures can be stimulated together.

Understanding the CUV complex resolves debates about whether the G-spot "exists." The sensitivity is real, but it's explained by anatomy rather than a mysterious separate organ. This integrated understanding helps explore what actually feels good rather than searching for a magic button.`,
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
    thumbnail: require('@/assets/images/concepts/thumbnails/clitourethrovaginal.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Have you experienced sensitivity on the front wall of the vagina—an area that feels different from the rest?',
      },
      {
        type: 'name',
        content: 'The CUV complex (clitourethrovaginal) is the integrated cluster of clitoris, urethra, and anterior vaginal wall—often discussed as the “G-spot” area.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/clitourethrovaginal.png'),
        illustrationCaption: 'Shared tissue and pressure between three structures',
      },
      {
        type: 'understand',
        content: 'Imaging studies show these structures are physically connected, not isolated (Jannini et al., 2014). Front-wall sensitivity is real because pressure there compresses internal clitoral and urethral tissue—there is no separate magic organ to hunt for.',
      },
      {
        type: 'explore',
        title: 'Know This',
        content: 'There isn\'t a magic button to find. Instead, the front vaginal wall is an area where multiple sensitive structures can be reached. Understanding this shifts focus from "finding the spot" to exploring what actually feels good.',
      },
    ],
  },
  {
    id: 'internal-stimulation',
    name: 'Internal Clitoral Stimulation',
    category: 'anatomy',
    definition:
      'Stimulating internal clitoral tissue through the vaginal wall - what\'s often called "G-spot" sensation.',
    description: `Internal clitoral stimulation refers to reaching the internal portions of the clitoris through the vaginal wall. The area of sensitivity on the front vaginal wall (toward the belly button) is where internal clitoral tissue and the urethral sponge can be felt through the vaginal lining.

This reframes "vaginal orgasm" - rather than a completely different type of orgasm, internal stimulation is often still clitoral stimulation, just accessed differently. The sensations may feel distinct from external touch because different portions of the structure are being stimulated.

Techniques like angling and certain positions work because they optimize contact with this anterior wall area. Understanding this helps with intentional exploration rather than hoping to accidentally find the right spot.`,
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
    thumbnail: require('@/assets/images/concepts/thumbnails/internal-stimulation.png'),
    slides: [
      {
        type: 'recognize',
        content: 'Have you noticed that certain angles or positions create pleasurable sensations on the front wall of the vagina—different from deeper penetration?',
      },
      {
        type: 'name',
        content: 'Internal clitoral stimulation is reaching clitoral tissue through the vaginal wall—especially the anterior (front) wall toward the belly button.',
      },
      {
        type: 'illustrate',
        content: '',
        illustrationAsset: require('@/assets/images/concepts/illustrations/internal-stimulation.png'),
        illustrationCaption: 'Pressure on the anterior wall engaging internal crura',
      },
      {
        type: 'understand',
        content: 'Research suggests many “vaginal” orgasms involve internal clitoral stimulation (Foldes & Buisson, 2009). Techniques like angling can improve contact with the anterior wall where crura and urethral sponge lie close to the surface.',
      },
      {
        type: 'explore',
        title: 'Try This',
        content: 'Explore the front wall (toward your belly button) with fingers or a curved toy. Notice if certain spots feel more sensitive. Understanding the anatomy helps you explore intentionally rather than hoping to find something by accident.',
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
