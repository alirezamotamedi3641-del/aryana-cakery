'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Lock } from 'lucide-react';

interface UploadedImage {
  name: string;
  url: string;
}

interface FormState {
  occasion: string;
  birthdayFor: string;
  childFor: string;
  birthdayName: string;
  birthdayAge: string;
  milestone: string;
  occasionSub: string;
  occasionName: string;
  eventDetails: string;
  weddingVenue: string;
  company: string;
  logoCake: string;
  theme: string;
  customTheme: string;
  tiers: string;
  portions: string;
  shape: string;
  sponge: string;
  filling: string;
  dietary: string[];
  allergies: string;
  colours: string;
  inscription: string;
  designNotes: string;
  budget: string;
  date: string;
  time: string;
  handover: string;
  postcode: string;
  address: string;
  deliveryNotes: string;
  name: string;
  email: string;
  phone: string;
  contactMethod: string;
  agreement: boolean;
  images: UploadedImage[];
}

const INITIAL_STATE: FormState = {
  occasion: '',
  birthdayFor: '',
  childFor: '',
  birthdayName: '',
  birthdayAge: '',
  milestone: '',
  occasionSub: '',
  occasionName: '',
  eventDetails: '',
  weddingVenue: '',
  company: '',
  logoCake: '',
  theme: '',
  customTheme: '',
  tiers: '',
  portions: '',
  shape: '',
  sponge: '',
  filling: '',
  dietary: [],
  allergies: '',
  colours: '',
  inscription: '',
  designNotes: '',
  budget: '',
  date: '',
  time: '',
  handover: '',
  postcode: '',
  address: '',
  deliveryNotes: '',
  name: '',
  email: '',
  phone: '',
  contactMethod: '',
  agreement: false,
  images: [],
};

const occasionChoices: [string, string, string][] = [
  ['Birthday', '🎂', 'Birthday'],
  ['Wedding', '💍', 'Wedding'],
  ['Baby shower', '🍼', 'Baby shower'],
  ['Anniversary', '💕', 'Anniversary'],
  ['Engagement', '💎', 'Engagement'],
  ['Graduation', '🎓', 'Graduation'],
  ['Corporate', '🎁', 'Corporate'],
  ['Other', '✨', 'Something else'],
];

const kidThemeBoy: [string, string][] = [
  ['Superheroes', '🦸'],
  ['Football', '⚽'],
  ['Dinosaurs', '🦕'],
  ['Cars & racing', '🏎️'],
  ['Gaming', '🎮'],
  ['Animals', '🦁'],
  ['Animated characters', '🎬'],
  ['Space', '🚀'],
  ['Princess / fairytale', '👑'],
  ['Surprise me', '🎉'],
];

const kidThemeGirl: [string, string][] = [
  ['Princess / fairytale', '👑'],
  ['Disney / animation', '✨'],
  ['Unicorns & rainbows', '🦄'],
  ['Butterflies & flowers', '🦋'],
  ['Mermaids', '🧜'],
  ['Animals', '🐻'],
  ['Superheroes', '🦸'],
  ['Football', '⚽'],
  ['Gaming', '🎮'],
  ['Surprise me', '🎉'],
];

const adultThemes: [string, string][] = [
  ['Minimal & elegant', '🤍'],
  ['Floral', '🌸'],
  ['Vintage piping', '🎀'],
  ['Glam & sparkle', '✨'],
  ['Favourite hobby', '🎨'],
  ['Sports', '⚽'],
  ['Funny / playful', '🎈'],
  ['Photo cake', '📷'],
  ['Classic', '🎂'],
  ['Surprise me', '🎉'],
];

const seniorThemes: [string, string][] = [
  ['Classic elegance', '🎂'],
  ['Garden & flowers', '🌷'],
  ['Family memories', '💕'],
  ['Favourite hobby', '🎨'],
  ['Vintage / nostalgic', '📻'],
  ['Gold & luxury', '✨'],
  ['Traditional', '🫖'],
  ['Photo cake', '📷'],
  ['Simple & understated', '🤍'],
  ['Surprise me', '🎉'],
];

const nonBirthdayThemes: Record<string, [string, string][]> = {
  Wedding: [
    ['Romantic floral', '🌷'],
    ['Classic white', '🤍'],
    ['Modern minimal', '✨'],
    ['Rustic', '🌿'],
    ['Luxury', '💎'],
    ['Bold colour', '🌈'],
  ],
  'Baby shower': [
    ['Teddy bear', '🧸'],
    ['Moon & stars', '🌙'],
    ['Pastel clouds', '☁️'],
    ['Cute animals', '🐣'],
    ['Floral', '🌸'],
    ['Gender reveal', '🎈'],
  ],
  Anniversary: [
    ['Romantic', '💕'],
    ['Classic floral', '🌹'],
    ['Minimalist', '🤍'],
    ['Elegant gold', '✨'],
    ['Photo memories', '📷'],
    ['Funny & personal', '🎉'],
  ],
  Engagement: [
    ['Romantic floral', '🌹'],
    ['White & gold', '💍'],
    ['Modern minimal', '🤍'],
    ['Pastel', '🌸'],
    ['Statement cake', '✨'],
    ['Personalised', '💕'],
  ],
  Graduation: [
    ['Cap & diploma', '🎓'],
    ['University colours', '🎨'],
    ['Modern', '✨'],
    ['Photo cake', '📷'],
    ['Favourite hobby', '🎮'],
    ['Custom design', '🎂'],
  ],
  Corporate: [
    ['Brand colours', '🎨'],
    ['Company logo', '🏢'],
    ['Elegant minimal', '🤍'],
    ['Milestone celebration', '🥂'],
    ['Product-inspired', '🎁'],
    ['Custom design', '✨'],
  ],
  Other: [
    ['Minimal & elegant', '🤍'],
    ['Floral', '🌸'],
    ['Colourful & fun', '🌈'],
    ['Statement cake', '✨'],
    ['Personalised', '💕'],
    ['Not sure yet', '💭'],
  ],
};

interface StepDef {
  id: string;
  name: string;
  title: string;
  desc: string;
}

function getTwoDaysFromNow(): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + 2);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function InteractiveOrderPreview({ onLock }: { onLock?: () => void }) {
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const isFirstRender = useRef(true);
  const imagesRef = useRef<UploadedImage[]>([]);

  useEffect(() => {
    imagesRef.current = state.images;
  }, [state.images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, []);

  const steps: StepDef[] = useMemo(() => {
    if (state.occasion === 'Birthday') {
      return [
        {
          id: 'occasion',
          name: 'Occasion',
          title: 'What are we celebrating?',
          desc: 'Every unforgettable cake begins with a special occasion.',
        },
        {
          id: 'birthday-person',
          name: 'Birthday details',
          title: 'Who is the birthday star?',
          desc: 'A few details help us make their cake feel personal.',
        },
        {
          id: 'birthday-theme',
          name: 'Birthday theme',
          title: 'Let’s find their perfect theme',
          desc: 'Choose a starting idea. You can always describe something different.',
        },
        {
          id: 'cake',
          name: 'Cake details',
          title: 'The delicious details',
          desc: 'Choose the size, shape and flavours you have in mind.',
        },
        {
          id: 'design',
          name: 'Make it yours',
          title: 'Add the finishing touches',
          desc: 'Colours, a little message, and all those personal touches.',
        },
        {
          id: 'date',
          name: 'Date & delivery',
          title: 'When do you need it?',
          desc: 'Tell us when and how you’d like to receive your cake.',
        },
        {
          id: 'contact',
          name: 'Your details',
          title: 'How can we reach you?',
          desc: 'So we can discuss the design, availability and quotation.',
        },
        {
          id: 'review',
          name: 'Review',
          title: 'Your cake story, so far ♡',
          desc: 'Review your choices and see what the bakery would receive.',
        },
      ];
    }

    return [
      {
        id: 'occasion',
        name: 'Occasion',
        title: 'What are we celebrating?',
        desc: 'Every unforgettable cake begins with a special occasion.',
      },
      {
        id: 'event',
        name: 'Event details',
        title: 'Tell us about your occasion',
        desc: 'We’ll tailor the next questions to your celebration.',
      },
      {
        id: 'cake',
        name: 'Cake details',
        title: 'The delicious details',
        desc: 'Choose the size, shape and flavours you have in mind.',
      },
      {
        id: 'design',
        name: 'Make it yours',
        title: 'Bring your ideas to life',
        desc: 'Choose a style, colours and personal touches.',
      },
      {
        id: 'date',
        name: 'Date & delivery',
        title: 'When do you need it?',
        desc: 'Tell us when and how you’d like to receive your cake.',
      },
      {
        id: 'contact',
        name: 'Your details',
        title: 'How can we reach you?',
        desc: 'So we can discuss the design, availability and quotation.',
      },
      {
        id: 'review',
        name: 'Review',
        title: 'Your cake story, so far ♡',
        desc: 'Review your choices and see what the bakery would receive.',
      },
    ];
  }, [state.occasion]);

  const safeCurrent = Math.max(0, Math.min(current, steps.length - 1));
  const step = steps[safeCurrent];
  const minDate = useMemo(() => getTwoDaysFromNow(), []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [safeCurrent, finished]);

  const handleSelect = (field: keyof FormState, value: string) => {
    setState((prev) => {
      const nextState = { ...prev, [field]: value };
      if (field === 'occasion') {
        nextState.theme = '';
        nextState.customTheme = '';
        nextState.occasionSub = '';
        nextState.eventDetails = '';
      } else if (field === 'birthdayFor') {
        nextState.theme = '';
        nextState.childFor = '';
      } else if (field === 'childFor') {
        nextState.theme = '';
      } else if (field === 'handover' && value !== 'Delivery') {
        nextState.postcode = '';
        nextState.address = '';
      }
      return nextState;
    });
    if (field === 'occasion') {
      setCurrent(0);
    }
  };

  const handleMultiToggle = (label: string) => {
    setState((prev) => {
      if (label === 'No special request') {
        return { ...prev, dietary: ['No special request'] };
      }
      const filtered = prev.dietary.filter((x) => x !== 'No special request');
      const exists = filtered.includes(label);
      return {
        ...prev,
        dietary: exists
          ? filtered.filter((x) => x !== label)
          : [...filtered, label],
      };
    });
  };

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files);
    const failures: string[] = [];
    const added: UploadedImage[] = [];

    for (const file of list) {
      if (state.images.length + added.length >= 3) {
        failures.push('Maximum 3 images.');
        break;
      }
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        failures.push(`${file.name} is not a supported image.`);
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        failures.push(`${file.name} is over 8 MB.`);
        continue;
      }
      added.push({ name: file.name, url: URL.createObjectURL(file) });
    }

    if (added.length > 0) {
      setState((prev) => ({ ...prev, images: [...prev.images, ...added] }));
    }
    setUploadError(failures.join(' '));
  };

  const handleRemoveImage = (index: number) => {
    setState((prev) => {
      const target = prev.images[index];
      if (target) URL.revokeObjectURL(target.url);
      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      };
    });
    setUploadError('');
  };

  const handleReset = () => {
    state.images.forEach((img) => URL.revokeObjectURL(img.url));
    setState(INITIAL_STATE);
    setCurrent(0);
    setFinished(false);
    setUploadError('');
  };

  const handleNext = () => {
    if (step.id === 'review') {
      if (finished) {
        handleReset();
        return;
      }
      setFinished(true);
      return;
    }
    setCurrent((c) => Math.min(steps.length - 1, c + 1));
  };

  const handleBack = () => {
    setCurrent((c) => Math.max(0, c - 1));
    setFinished(false);
  };

  const handleJump = (index: number) => {
    if (index <= safeCurrent) {
      setCurrent(index);
      setFinished(false);
    }
  };

  const handleEdit = (stepId: string) => {
    const idx = steps.findIndex((s) => s.id === stepId);
    if (idx >= 0) {
      setCurrent(idx);
      setFinished(false);
    }
  };

  const renderNotice = (kind: '' | 'warm' | 'pink', content: React.ReactNode) => (
    <div className={`notice ${kind}`}>
      <span aria-hidden="true">
        {kind === 'warm' ? '◷' : kind === 'pink' ? '♡' : '✓'}
      </span>
      <div>{content}</div>
    </div>
  );

  const renderHeading = (label: string, desc?: string) => (
    <>
      <div className="section-label">{label}</div>
      {desc && <p className="hint">{desc}</p>}
    </>
  );

  const renderField = (
    key: keyof FormState,
    label: string,
    placeholder = '',
    opt: {
      optional?: boolean;
      area?: boolean;
      rows?: number;
      type?: string;
      min?: string;
      autocomplete?: string;
      help?: string;
    } = {}
  ) => (
    <div className="field">
      <label htmlFor={key}>
        {label}
        {opt.optional && <span className="optional"> (optional)</span>}
      </label>
      {opt.area ? (
        <textarea
          id={key}
          value={String(state[key] ?? '')}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          placeholder={placeholder}
          rows={opt.rows || 3}
        />
      ) : (
        <input
          id={key}
          type={opt.type || 'text'}
          value={String(state[key] ?? '')}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          placeholder={placeholder}
          min={opt.min}
          autoComplete={opt.autocomplete}
        />
      )}
      {opt.help && <div className="help">{opt.help}</div>}
    </div>
  );

  const renderChoices = (
    field: keyof FormState,
    items: [string, string, string, string?][],
    { classes = '', compact = false }: { classes?: string; compact?: boolean } = {}
  ) => (
    <div className={`choices ${classes}`}>
      {items.map(([value, emoji, label, extra]) => {
        const selected = state[field] === value;
        return (
          <button
            key={value}
            type="button"
            className={`choice ${compact ? 'compact' : ''} ${selected ? 'selected' : ''}`}
            onClick={() => handleSelect(field, value)}
            aria-pressed={selected}
          >
            <span className="emoji" aria-hidden="true">
              {emoji}
            </span>
            <span className="choice-text">
              {label}
              {extra && (
                <small style={{ display: 'block', fontWeight: 500, marginTop: 4 }}>
                  {extra}
                </small>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );

  const renderChips = (
    field: keyof FormState,
    labels: string[],
    multi = false
  ) => (
    <div className="chip-wrap">
      {labels.map((label) => {
        const selected = multi
          ? state.dietary.includes(label)
          : state[field] === label;
        return (
          <button
            key={label}
            type="button"
            className={`chip ${selected ? 'selected' : ''}`}
            onClick={() =>
              multi ? handleMultiToggle(label) : handleSelect(field, label)
            }
            aria-pressed={selected}
          >
            {label}
          </button>
        );
      })}
    </div>
  );

  const renderReadable = (value: string | string[] | null | undefined) => {
    if (
      value == null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return <span className="summary-empty">Not selected</span>;
    }
    return Array.isArray(value) ? value.join(', ') : value;
  };

  const renderReviewGroup = (
    id: string,
    title: string,
    items: [string, string | string[] | null | undefined][]
  ) => (
    <div className="review-card">
      <div className="review-top">
        <h3>{title}</h3>
        <button type="button" onClick={() => handleEdit(id)}>
          Edit ↗
        </button>
      </div>
      <dl>
        {items.map(([label, val]) => (
          <div key={label} style={{ display: 'contents' }}>
            <dt>{label}</dt>
            <dd>{renderReadable(val)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  const renderStepBody = () => {
    switch (step.id) {
      case 'occasion':
        return (
          <>
            {renderHeading(
              '01 / THE CELEBRATION',
              'First, choose the occasion. The following steps will adapt automatically.'
            )}
            {renderChoices('occasion', occasionChoices)}
            <div className="gap">
              {renderNotice(
                'pink',
                <>
                  <b>Interactive example:</b> Choose Birthday to see different
                  pathways for children, adults and older adults. Choose Wedding or
                  another occasion to see different questions.
                </>
              )}
            </div>
          </>
        );

      case 'birthday-person':
        return (
          <>
            {renderHeading(
              'ABOUT THE BIRTHDAY PERSON',
              'Choose the age group for more relevant cake ideas.'
            )}
            {renderChoices('birthdayFor', [
              ['Child', '🧸', 'Child', 'Little birthday magic'],
              ['Adult', '🎉', 'Adult', 'A stylish celebration'],
              ['Older adult', '🌷', 'Older adult', 'A milestone to treasure'],
            ])}
            {state.birthdayFor === 'Child' && (
              <div className="gap">
                {renderHeading(
                  'A LITTLE MORE ABOUT THEM',
                  'This helps suggest themes; every theme remains available to everyone.'
                )}
                {renderChoices('childFor', [
                  ['Boy', '🚀', 'Boy'],
                  ['Girl', '🦋', 'Girl'],
                  ['Any', '🌈', 'No preference'],
                ])}
              </div>
            )}
            <div className="grid two gap">
              {renderField('birthdayName', 'Birthday person’s name', 'e.g. Oliver', {
                optional: true,
              })}
              {renderField('birthdayAge', 'Age they’re turning', 'e.g. 7, 30, 80', {
                optional: true,
                type: 'number',
              })}
            </div>
            {state.birthdayFor === 'Older adult' && (
              <div className="gap">
                {renderNotice(
                  'pink',
                  'Milestone birthdays can be beautifully personal. You can describe favourite memories, colours or family traditions later.'
                )}
              </div>
            )}
          </>
        );

      case 'birthday-theme': {
        let list: [string, string][];
        if (state.birthdayFor === 'Child') {
          if (state.childFor === 'Girl') {
            list = kidThemeGirl;
          } else if (state.childFor === 'Boy') {
            list = kidThemeBoy;
          } else {
            list = Array.from(
              new Map([...kidThemeBoy, ...kidThemeGirl].map((i) => [i[0], i])).values()
            );
          }
        } else if (state.birthdayFor === 'Older adult') {
          list = seniorThemes;
        } else {
          list = adultThemes;
        }

        const hintText =
          state.birthdayFor === 'Child'
            ? 'Here are some child-friendly theme ideas. All themes are available for any child.'
            : state.birthdayFor === 'Older adult'
            ? 'A few thoughtful ideas for a beautiful celebration.'
            : 'What kind of birthday cake feels right?';

        return (
          <>
            {renderHeading('THE LOOK & FEEL', hintText)}
            {renderChoices(
              'theme',
              list.map(([v, e]) => [v, e, v]),
              { classes: 'two' }
            )}
            <div className="gap">
              {renderField(
                'customTheme',
                'Your own theme or character idea',
                'Tell us your dream theme — even if you have a photo',
                { optional: true }
              )}
            </div>
            {state.birthdayFor === 'Child' && (
              <div className="gap">
                {renderNotice(
                  'pink',
                  'Theme ideas are suggestions, not restrictions. Any design can be requested for any child.'
                )}
              </div>
            )}
          </>
        );
      }

      case 'event': {
        const kind = state.occasion || 'Other';
        const styleList = nonBirthdayThemes[kind] || nonBirthdayThemes.Other;

        return (
          <>
            {renderHeading('A LITTLE CONTEXT', `Selected occasion: ${kind}`)}
            <div className="tag">♡ {kind}</div>

            {kind === 'Wedding' && (
              <>
                <div className="grid two">
                  {renderField(
                    'occasionName',
                    'Couple’s names',
                    'Names for the celebration',
                    { optional: true }
                  )}
                  {renderField(
                    'weddingVenue',
                    'Venue / reception location',
                    'Where will the cake be displayed?',
                    { optional: true }
                  )}
                </div>
                <div className="gap">
                  {renderHeading('WEDDING STYLE')}
                  {renderChips('occasionSub', [
                    'Traditional',
                    'Modern',
                    'Intimate / small',
                    'Large celebration',
                    'Not sure yet',
                  ])}
                </div>
              </>
            )}

            {kind === 'Baby shower' && (
              <>
                {renderHeading('WHAT KIND OF CELEBRATION?')}
                {renderChips('occasionSub', [
                  'Baby shower',
                  'Gender reveal',
                  'Welcome baby',
                  'Not sure',
                ])}
                <div className="gap">
                  {renderField(
                    'occasionName',
                    'Name(s) to celebrate',
                    'Parent(s) or baby name, if you wish',
                    { optional: true }
                  )}
                </div>
              </>
            )}

            {kind === 'Corporate' && (
              <>
                <div className="grid two">
                  {renderField(
                    'company',
                    'Company / organisation',
                    'Business name',
                    { optional: true }
                  )}
                  {renderField(
                    'occasionName',
                    'Event name',
                    'e.g. 10th anniversary',
                    { optional: true }
                  )}
                </div>
                <div className="gap">
                  {renderHeading('BRANDING ON THE CAKE')}
                  {renderChips('logoCake', [
                    'Logo cake',
                    'Brand colours',
                    'No branding',
                    'Not sure yet',
                  ])}
                </div>
              </>
            )}

            {(kind === 'Anniversary' || kind === 'Engagement') && (
              <div className="grid two">
                {renderField(
                  'occasionName',
                  'Names to celebrate',
                  'e.g. Sara & Ali',
                  { optional: true }
                )}
                {renderField(
                  'milestone',
                  'Milestone / year',
                  'e.g. 25 years',
                  { optional: true }
                )}
              </div>
            )}

            {kind === 'Graduation' && (
              <div className="grid two">
                {renderField('occasionName', 'Graduate’s name', 'Name', {
                  optional: true,
                })}
                {renderField(
                  'milestone',
                  'School / university',
                  'Name of institution',
                  { optional: true }
                )}
              </div>
            )}

            {kind !== 'Wedding' &&
              kind !== 'Baby shower' &&
              kind !== 'Corporate' &&
              kind !== 'Anniversary' &&
              kind !== 'Engagement' &&
              kind !== 'Graduation' && (
                <div className="grid two">
                  {renderField(
                    'occasionName',
                    'Who are we celebrating?',
                    'Name or group',
                    { optional: true }
                  )}
                  {renderField(
                    'occasionSub',
                    'Type of occasion',
                    'e.g. retirement, congratulations',
                    { optional: true }
                  )}
                </div>
              )}

            <div className="gap">
              {renderField(
                'eventDetails',
                kind === 'Wedding'
                  ? 'Anything else about the wedding?'
                  : 'Tell us more about this celebration',
                'Any special details we should know?',
                { area: true, optional: true }
              )}
            </div>

            <div className="gap">
              {renderHeading(
                'A CAKE STYLE THAT SUITS',
                'These are suggested starting points, not fixed designs.'
              )}
              {renderChoices(
                'theme',
                styleList.map(([v, e]) => [v, e, v]),
                { classes: 'two' }
              )}
              <div className="gap">
                {renderField(
                  'customTheme',
                  'Another theme or idea',
                  'Describe your own concept',
                  { optional: true }
                )}
              </div>
            </div>
          </>
        );
      }

      case 'cake':
        return (
          <>
            {renderHeading(
              'CAKE STRUCTURE',
              'Choose your preferences — it’s fine if you’re not sure yet.'
            )}
            {renderHeading('HOW MANY TIERS?')}
            {renderChoices(
              'tiers',
              [
                ['1 tier', '🎂', '1 tier'],
                ['2 tiers', '🍰', '2 tiers'],
                ['3+ tiers', '✨', '3+ tiers'],
                ['Not sure', '💭', 'Advise me'],
              ],
              { classes: 'four' }
            )}
            <div className="gap">
              {renderHeading('HOW MANY PEOPLE ARE YOU SERVING?')}
              {renderChips('portions', [
                'Up to 10',
                '11–20',
                '21–40',
                '41–70',
                '70+',
                'Not sure',
              ])}
            </div>
            <div className="gap">
              {renderHeading('PREFERRED SHAPE')}
              {renderChoices(
                'shape',
                [
                  ['Round', '⚪', 'Round'],
                  ['Square', '◻️', 'Square'],
                  ['Heart', '💗', 'Heart'],
                  ['Custom', '🌟', 'Custom / unsure'],
                ],
                { classes: 'four', compact: true }
              )}
            </div>
            <div className="gap">
              {renderHeading(
                'SPONGE FLAVOUR',
                'Illustrative choices — the bakery can confirm available flavours.'
              )}
              {renderChips('sponge', [
                'Vanilla',
                'Chocolate',
                'Red velvet',
                'Lemon',
                'Carrot',
                'Other / advise me',
              ])}
            </div>
            <div className="gap">
              {renderHeading(
                'FILLING',
                'Illustrative choices — final combinations are subject to bakery confirmation.'
              )}
              {renderChips('filling', [
                'Vanilla cream',
                'Chocolate ganache',
                'Strawberry',
                'Raspberry',
                'Buttercream',
                'Not sure',
              ])}
            </div>
            <div className="gap">
              {renderHeading('DIETARY & ALLERGY INFORMATION')}
              {renderChips(
                'dietary',
                [
                  'Vegetarian',
                  'Vegan request',
                  'Gluten-free request',
                  'Dairy-free request',
                  'Nut-free request',
                  'No special request',
                ],
                true
              )}
              <div className="gap">
                {renderField(
                  'allergies',
                  'Any allergies we should know about?',
                  'Please list all relevant allergens, even if requesting an alternative',
                  { area: true, optional: true, rows: 2 }
                )}
              </div>
            </div>
            <div className="gap">
              {renderNotice(
                'warm',
                <>
                  <b>Allergy note:</b> All special dietary requirements and allergen
                  suitability must be confirmed directly by the bakery before an order
                  is accepted.
                </>
              )}
            </div>
          </>
        );

      case 'design':
        return (
          <>
            {renderHeading(
              'COLOURS & PERSONAL TOUCHES',
              'Anything that will make the cake unmistakably theirs.'
            )}
            {renderField(
              'colours',
              'Preferred colours',
              'e.g. blush pink, sage green and ivory',
              { optional: true }
            )}
            <div className="gap">
              {renderField(
                'inscription',
                'Message written on the cake',
                'e.g. Happy 8th Birthday, Mia! ♡',
                { optional: true }
              )}
            </div>
            <div className="gap">
              {renderField(
                'designNotes',
                'Other design details',
                'Favourites, decorations, inspiration, fondant preferences, anything you imagine…',
                { optional: true, area: true }
              )}
            </div>
            <div className="gap">
              {renderHeading(
                'INSPIRATION PHOTOS',
                'Add up to 3 pictures. They are previewed locally in your browser only.'
              )}
              <label className="upload" htmlFor="images">
                <span style={{ fontSize: 29, color: 'var(--berry)' }}>⇧</span>
                <strong>Choose inspiration images</strong>
                <span>JPG, PNG or WebP · maximum 8 MB each · up to 3 images</span>
              </label>
              <input
                type="file"
                id="images"
                style={{ display: 'none' }}
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={(e) => {
                  handleImageUpload(e.target.files);
                  e.target.value = '';
                }}
              />
              <div className="uploads" id="upload-items">
                {state.images.map((image, i) => (
                  <div className="upload-item" key={`${image.name}-${i}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt="Uploaded cake inspiration" />
                    <span title={image.name}>{image.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      aria-label={`Remove ${image.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="gap">
              {renderHeading(
                'APPROXIMATE BUDGET',
                'Optional — useful for suggesting a suitable design and size.'
              )}
              {renderChips('budget', [
                'Under £50',
                '£50–£100',
                '£100–£200',
                '£200–£400',
                '£400+',
                'Open to suggestions',
              ])}
            </div>
            <p
              className="help"
              id="upload-error"
              style={uploadError ? { color: '#aa294c' } : undefined}
            >
              {uploadError}
            </p>
          </>
        );

      case 'date':
        return (
          <>
            {renderHeading(
              'YOUR CELEBRATION DATE',
              'Let us know when your cake will be needed.'
            )}
            {renderNotice(
              '',
              <>
                <b>A little time for a little magic.</b> The existing website requests
                at least two days’ notice for bespoke cakes. Availability still needs
                bakery confirmation.
              </>
            )}
            <div className="grid two gap">
              {renderField('date', 'Date required', '', {
                type: 'date',
                min: minDate,
                help: 'Earliest selectable date is two days from today.',
              })}
              {renderField(
                'time',
                'Preferred time',
                'e.g. 12:30 pm or flexible',
                { optional: true }
              )}
            </div>
            <div className="gap">
              {renderHeading('HOW WOULD YOU LIKE TO RECEIVE IT?')}
              {renderChoices(
                'handover',
                [
                  ['Collection', '🛍️', 'Collection'],
                  ['Delivery', '🚚', 'Delivery', 'Subject to availability'],
                ],
                { classes: 'two' }
              )}
            </div>
            {state.handover === 'Delivery' && (
              <>
                <div className="grid two gap">
                  {renderField('postcode', 'Delivery postcode', 'e.g. LS6 2AA')}
                  {renderField(
                    'address',
                    'Delivery address',
                    'Street, city, property details'
                  )}
                </div>
                <div className="gap">
                  {renderField(
                    'deliveryNotes',
                    'Delivery instructions',
                    'Anything we should know about access or delivery?',
                    { optional: true, area: true, rows: 2 }
                  )}
                </div>
                <div className="gap">
                  {renderNotice(
                    'warm',
                    <>
                      <b>Delivery is not guaranteed.</b> The bakery will confirm
                      whether delivery is available, along with any fee.
                    </>
                  )}
                </div>
              </>
            )}
          </>
        );

      case 'contact':
        return (
          <>
            {renderHeading(
              'A FEW FINAL DETAILS',
              'We’d use these to respond to your cake enquiry.'
            )}
            <div className="grid two">
              {renderField('name', 'Full name', 'Your first and last name', {
                autocomplete: 'name',
              })}
              {renderField('phone', 'Phone number', 'Your contact number', {
                type: 'tel',
                autocomplete: 'tel',
              })}
            </div>
            <div className="gap">
              {renderField('email', 'Email address', 'you@example.com', {
                type: 'email',
                autocomplete: 'email',
              })}
            </div>
            <div className="gap">
              {renderHeading('HOW SHOULD WE CONTACT YOU?')}
              {renderChips('contactMethod', [
                'WhatsApp',
                'Phone call',
                'Email',
                'No preference',
              ])}
            </div>
            <div className="gap">
              {renderNotice(
                'pink',
                <>
                  <b>Preview only:</b> No personal information is submitted, emailed or
                  stored by this file. A real website would need a secure order
                  submission system and privacy policy.
                </>
              )}
            </div>
          </>
        );

      case 'review': {
        const isBirthday = state.occasion === 'Birthday';
        return (
          <>
            {renderNotice(
              'pink',
              <>
                <b>This is an interactive owner preview, not a live ordering system.</b>{' '}
                You can go back, adjust answers and take screenshots. Nothing gets
                sent to the business.
              </>
            )}
            <div className="gap review-grid">
              {renderReviewGroup('occasion', 'Celebration', [
                ['Occasion', state.occasion],
              ])}
              {isBirthday
                ? renderReviewGroup('birthday-person', 'Birthday details', [
                    ['For', state.birthdayFor],
                    ...(state.birthdayFor === 'Child'
                      ? [['Child / preference', state.childFor] as [string, string]]
                      : []),
                    ['Name', state.birthdayName],
                    ['Turning age', state.birthdayAge],
                  ])
                : renderReviewGroup('event', 'Event details', [
                    ['Celebrating', state.occasionName],
                    ['Event information', state.eventDetails],
                    ...(state.occasion === 'Wedding'
                      ? [['Venue', state.weddingVenue] as [string, string]]
                      : []),
                    ...(state.occasion === 'Corporate'
                      ? ([
                          ['Company', state.company],
                          ['Branding', state.logoCake],
                        ] as [string, string][])
                      : []),
                    ['Style / type', state.occasionSub],
                    ['Milestone', state.milestone],
                  ])}
              {renderReviewGroup(
                isBirthday ? 'birthday-theme' : 'event',
                'Design theme',
                [
                  ['Theme', state.theme],
                  ['Custom idea', state.customTheme],
                ]
              )}
              {renderReviewGroup('cake', 'Cake preferences', [
                ['Tiers', state.tiers],
                ['Servings', state.portions],
                ['Shape', state.shape],
                ['Sponge', state.sponge],
                ['Filling', state.filling],
                ['Dietary requests', state.dietary],
                ['Allergies', state.allergies],
              ])}
              {renderReviewGroup('design', 'Personal touches', [
                ['Colours', state.colours],
                ['Inscription', state.inscription],
                ['Other design notes', state.designNotes],
                ['Budget', state.budget],
                [
                  'Photos',
                  state.images.length
                    ? `${state.images.length} image(s) attached in this browser`
                    : null,
                ],
              ])}
              {renderReviewGroup('date', 'Date & handover', [
                ['Required date', state.date],
                ['Time', state.time],
                ['Handover', state.handover],
                ...(state.handover === 'Delivery'
                  ? ([
                      ['Postcode', state.postcode],
                      ['Address', state.address],
                      ['Notes', state.deliveryNotes],
                    ] as [string, string][])
                  : []),
              ])}
              {renderReviewGroup('contact', 'Contact', [
                ['Full name', state.name],
                ['Phone', state.phone],
                ['Email', state.email],
                ['Preferred contact', state.contactMethod],
              ])}
            </div>
            <div className="gap">
              {renderNotice(
                'warm',
                <>
                  <b>Before any live order can be confirmed:</b> the bakery will need
                  to agree availability, design, size, price, allergies and
                  collection/delivery arrangements.
                </>
              )}
            </div>
            <div className="gap">
              <label className="checkline">
                <input
                  type="checkbox"
                  checked={state.agreement}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, agreement: e.target.checked }))
                  }
                />
                <span>
                  I understand this is an enquiry preview and not a confirmed booking
                  or actual submission.
                </span>
              </label>
            </div>
            {finished && (
              <div className="gap complete">
                <h3>Preview completed ♡</h3>
                <p>
                  That&apos;s the full customer journey. No request was submitted. You
                  can go back to review any step, or restart with a different
                  occasion.
                </p>
              </div>
            )}
          </>
        );
      }

      default:
        return null;
    }
  };

  const isLast = step.id === 'review';

  return (
    <>
      <header className="top">
        <div className="topin">
          <div className="wordmark">
            aryana<small>C A K E R Y</small>
          </div>
          <div className="top-right">
            <div className="preview-pill">
              <i /> Interactive form preview · no orders sent
            </div>
            {onLock && (
              <button
                type="button"
                className="lock-btn"
                onClick={onLock}
                aria-label="Lock preview"
                title="Lock preview"
              >
                <Lock size={13} aria-hidden="true" />
                <span>Lock</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="wrap">
        <aside className="side" aria-label="Aryana Cakery brand panel">
          <div className="eyebrow">♡ Let&apos;s make it yours</div>
          <h1>
            Dream it.
            <br />
            <em>We&apos;ll cake it.</em>
          </h1>
          <p>
            A little imagination. A lot of love. Let&apos;s create a cake that&apos;s
            as special as your celebration.
          </p>
          <div className="cake-art" aria-hidden="true">
            <div className="plate" />
            <div className="base" />
            <div className="top-tier" />
            <div className="frosting1" />
            <div className="flower">✿</div>
            <div className="flower two">✿</div>
            <div className="candle" />
            <div className="flame">✦</div>
          </div>
          <div className="little">
            <div className="heart">♡</div>
            <div>
              <strong>Made with love, just for you</strong>
              <span>Explore every step to shape your perfect cake.</span>
            </div>
          </div>
          <div className="side-foot">
            Aryana Cakery · Bespoke cakes &amp; sweet celebrations
          </div>
        </aside>

        <div>
          <section className="main" aria-label="Cake order request preview">
            <div className="head">
              <div className="head-upper">
                <span>YOUR CAKE STORY</span>
                <span id="stepcount" className="count">
                  Step {safeCurrent + 1} of {steps.length}
                </span>
              </div>
              <h2 id="steptitle">{step.title}</h2>
              <p id="stepdesc">{step.desc}</p>
              <nav id="progress" className="progress" aria-label="Form progress">
                {steps.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    title={s.name}
                    aria-label={`${s.name}${
                      i <= safeCurrent ? '' : ' (complete previous steps first)'
                    }`}
                    className={
                      i === safeCurrent ? 'active' : i < safeCurrent ? 'done' : ''
                    }
                    disabled={i > safeCurrent}
                    aria-current={i === safeCurrent ? 'step' : 'false'}
                    onClick={() => handleJump(i)}
                  />
                ))}
              </nav>
              <div className="steps-inline">
                <span>Choose your celebration</span>
                <b id="progress-name">{step.name}</b>
                <span>Review your request</span>
              </div>
            </div>

            <div
              key={step.id}
              className="form-body fade-up"
              id="form-body"
              aria-live="polite"
            >
              {renderStepBody()}
            </div>

            <div className="foot">
              <button
                type="button"
                className="btn ghost"
                id="back"
                disabled={safeCurrent === 0}
                style={{ visibility: safeCurrent === 0 ? 'hidden' : 'visible' }}
                onClick={handleBack}
              >
                ← Back
              </button>
              <span className="caption">
                Your details stay on this page during the preview.
              </span>
              <button
                type="button"
                className="btn primary"
                id="next"
                onClick={handleNext}
              >
                {isLast ? (
                  finished ? (
                    'Restart preview ↻'
                  ) : (
                    'Finish preview ♡'
                  )
                ) : (
                  <>
                    Continue <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </div>
          </section>

          <p className="note-bottom">
            Design and question options are for business-owner review only. This
            offline preview does not transmit or save customer enquiries.
          </p>
        </div>
      </main>
    </>
  );
}
