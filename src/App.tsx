import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Crown,
  Droplets,
  ExternalLink,
  Flower2,
  Gift,
  Heart,
  Leaf,
  LoaderCircle,
  Menu,
  MessageCircle,
  Palette,
  RefreshCw,
  Share2,
  ShieldCheck,
  Shovel,
  Smile,
  Sparkles,
  Sprout,
  Sun,
  Users,
  Wallet,
  WandSparkles,
  X,
} from 'lucide-react';
import type { Action, ActionKind, Config, Gateway, Owner, Skin, View } from './lib/types';
import { WEEK } from './lib/types';
import { loadConfig } from './lib/config';
import { Playground } from './lib/playground';
import { Pet, Landscape, skins } from './components/Pet';
import { Dialog } from './components/Dialog';
const tabs = ['Our pet', 'The garden', 'Adventures', 'Rewards', 'Journal'] as const;
type Tab = (typeof tabs)[number];
type Modal = 'connect' | 'looks' | 'about' | 'share' | 'reset' | 'builders' | null;
const short = (a: string) =>
  a === 'playground-you' ? 'You' : a ? `${a.slice(0, 5)}…${a.slice(-4)}` : 'A new friend';
const verbs: Record<string, string> = {
  feed: 'gave Uni a snack',
  play: 'played with Uni',
  clean: 'gave Uni a bath',
  comfort: 'gave Uni a cuddle',
  plant: 'planted a berry seed',
  water: 'watered a garden plot',
  harvest: 'picked fresh berries',
  craft: 'made a berry treat',
  contribute: 'helped the community picnic',
  vote: 'voted for a destination',
  adventure: 'set off exploring',
  return: 'returned with berries',
};
const care = [
  { kind: 'feed', label: 'Feed', sub: 'A little snack', icon: Leaf, color: 'peach' },
  { kind: 'play', label: 'Play', sub: 'Make some mischief', icon: Sun, color: 'yellow' },
  { kind: 'clean', label: 'Clean', sub: 'Fresh as a daisy', icon: Droplets, color: 'blue' },
  { kind: 'comfort', label: 'Cuddle', sub: 'A little extra love', icon: Heart, color: 'pink' },
] as const;
function duration(ms: number) {
  if (ms <= 0) return 'Ready';
  const m = Math.ceil(ms / 60000);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}
function date(ms: number) {
  return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
interface CustomLook {
  name: string;
  image: string;
  author: string;
}
export default function App() {
  const [config, setConfig] = useState<Config | null>(null),
    [gateway, setGateway] = useState<Gateway | null>(null),
    [view, setView] = useState<View | null>(null),
    [owner, setOwner] = useState<Owner | null>(null),
    [address, setAddress] = useState('');
  const [tab, setTab] = useState<Tab>('Our pet'),
    [modal, setModal] = useState<Modal>(null),
    [skin, setSkin] = useState<Skin>(() => {
      const s = localStorage.getItem('uni-pet-skin');
      return skins.some((x) => x.id === s) ? (s as Skin) : 'sprout';
    }),
    [custom, setCustom] = useState<CustomLook | null>(null);
  const [busy, setBusy] = useState(''),
    [error, setError] = useState(''),
    [fatal, setFatal] = useState(''),
    [notice, setNotice] = useState(''),
    [animation, setAnimation] = useState(''),
    [speech, setSpeech] = useState('Oh, hi! I was hoping you’d visit.'),
    [menu, setMenu] = useState(false),
    [clock, setClock] = useState(Date.now());
  const [reward, setReward] = useState({ eligible: false, claimed: false }),
    [rewardError, setRewardError] = useState(''),
    [manifest, setManifest] = useState('');
  const lock = useRef(false),
    readGeneration = useRef(0),
    readAt = useRef(Date.now()),
    card = useRef<HTMLCanvasElement>(null),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    loadConfig()
      .then(async (c) => {
        if (!mounted.current) return;
        setConfig(c);
        setGateway(
          c.mode === 'playground' ? new Playground() : new (await import('./lib/chain')).Chain(c),
        );
      })
      .catch((e) => setFatal(e.message));
    return () => {
      mounted.current = false;
    };
  }, []);
  const refresh = useCallback(async () => {
    if (!gateway) return;
    const request = ++readGeneration.current;
    try {
      const data = await gateway.read(address || undefined);
      if (request !== readGeneration.current) return;
      readAt.current = Date.now();
      setView(data.view);
      setOwner(data.owner);
      setError('');
    } catch (e) {
      if (request === readGeneration.current) setError((e as Error).message);
    }
  }, [gateway, address]);
  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), 30000);
    return () => {
      readGeneration.current++;
      clearInterval(id);
    };
  }, [refresh]);
  useEffect(() => {
    const id = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(''), 5000);
    return () => clearTimeout(id);
  }, [notice]);
  useEffect(() => {
    if (!animation) return;
    const id = setTimeout(() => setAnimation(''), 2400);
    return () => clearTimeout(id);
  }, [animation]);
  useEffect(() => {
    let cancelled = false;
    setReward({ eligible: false, claimed: false });
    setRewardError('');
    if (gateway && owner && (config?.mode === 'playground' || config?.rewardContractId))
      gateway
        .rewardStatus(address, owner.week)
        .then((r) => {
          if (!cancelled) setReward(r);
        })
        .catch((e) => {
          if (!cancelled) setRewardError(e.message);
        });
    return () => {
      cancelled = true;
    };
  }, [gateway, owner, address, config]);
  async function connect() {
    if (!gateway || lock.current) return;
    lock.current = true;
    setBusy('connect');
    setError('');
    try {
      const a = await gateway.connect();
      setAddress(a);
      setModal(null);
      setSpeech('You’re here! That makes today better.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
      lock.current = false;
    }
  }
  async function act(a: Action) {
    if (!address) {
      setModal('connect');
      return;
    }
    if (!gateway || lock.current) return;
    lock.current = true;
    setBusy(a.kind);
    setError('');
    try {
      await gateway.act(address, a);
      setAnimation(a.kind);
      setSpeech(
        (
          {
            feed: 'A snack? For me? Best. Day. Ever.',
            play: 'Again! Again! Okay… one little rest first.',
            clean: 'Squeaky clean. Ready for more adventures.',
            comfort: 'U n I. That’s my favorite kind of team.',
            contribute: 'A picnic with all my humans. Yes, please!',
            plant: 'A little seed. A whole lot of possibility.',
            harvest: 'Fresh berries! I knew you had a green thumb.',
          } as Record<string, string>
        )[a.kind] || 'Look what we did together!',
      );
      setNotice(
        config?.mode === 'playground'
          ? 'Playground progress saved on this device.'
          : 'Your action is confirmed on Koinos.',
      );
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
      lock.current = false;
    }
  }
  async function claim() {
    if (!gateway || !owner || lock.current) return;
    lock.current = true;
    setBusy('claim');
    try {
      await gateway.claim(address, owner.week);
      setReward({ eligible: true, claimed: true });
      setNotice('Your Care Club badge is claimed.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
      lock.current = false;
    }
  }
  async function share() {
    const url = new URL(location.href);
    url.hash = '';
    if (config?.mode === 'chain') {
      url.searchParams.set('pet', config.contractId);
      url.searchParams.set('network', config.network);
    }
    const text = 'Meet Uni. One little pet, all of us. The pet for U n I.';
    try {
      if (navigator.share) await navigator.share({ title: 'Uni Pet', text, url: url.toString() });
      else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setNotice('Invite link copied.');
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError')
        setNotice('Copy the page address to invite a friend.');
    }
  }
  function drawCard() {
    const c = card.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#f4f0e5';
    ctx.fillRect(0, 0, 1200, 630);
    ctx.fillStyle = '#d6e7b3';
    ctx.beginPath();
    ctx.ellipse(970, 440, 350, 350, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#293e31';
    ctx.font = 'bold 76px sans-serif';
    ctx.fillText('Uni Pet', 70, 120);
    ctx.font = '38px sans-serif';
    ctx.fillText('The pet for U n I.', 70, 182);
    ctx.font = 'bold 49px sans-serif';
    ctx.fillText(
      owner && view?.board.entries[0]?.address === address
        ? 'Officially a favorite human.'
        : 'One little pet. All of us.',
      70,
      315,
    );
    ctx.font = '27px sans-serif';
    ctx.fillText(
      config?.mode === 'playground'
        ? 'A little preview of our shared world.'
        : 'A shared creature living on Koinos.',
      70,
      370,
    );
    ctx.font = '22px sans-serif';
    ctx.fillText(location.host, 70, 562);
    const svg = document.querySelector('.pet-art');
    if (svg) {
      const img = new Image();
      const url = URL.createObjectURL(
        new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }),
      );
      img.onload = () => {
        ctx.drawImage(img, 760, 230, 370, 340);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }
  useEffect(() => {
    if (modal === 'share') drawCard();
  }, [modal]);
  function downloadCard() {
    card.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob),
        a = document.createElement('a');
      a.href = url;
      a.download = 'uni-pet-moment.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
  function installLook() {
    try {
      const data = JSON.parse(manifest);
      if (
        data.protocol !== 'uni-pet/v1' ||
        typeof data.name !== 'string' ||
        data.name.length > 40 ||
        typeof data.image !== 'string'
      )
        throw new Error('Use a uni-pet/v1 manifest with a name and HTTPS image.');
      const u = new URL(data.image);
      if (u.protocol !== 'https:') throw new Error('Character images must use HTTPS.');
      setCustom({
        name: data.name,
        image: u.href,
        author: typeof data.author === 'string' ? data.author.slice(0, 60) : 'Community creator',
      });
      setModal(null);
      setNotice('Character applied. Your pet and affection stay the same.');
    } catch (e) {
      setError((e as Error).message);
    }
  }
  if (fatal)
    return (
      <main className="loading-screen">
        <Sprout size={40} />
        <h1>Uni needs a moment</h1>
        <p>{fatal}</p>
        <button className="button primary" onClick={() => location.reload()}>
          Try again
        </button>
      </main>
    );
  if (!config || !view)
    return (
      <main className="loading-screen">
        <Sprout size={44} />
        <h1>Making room for U n I.</h1>
        <p>{error || 'Finding our little friend…'}</p>
        {error ? (
          <button className="button primary" onClick={() => void refresh()}>
            Try again
          </button>
        ) : (
          <LoaderCircle className="spin" />
        )}
      </main>
    );
  const p = view.pet,
    preview = config.mode === 'playground',
    leader = view.board.entries[0],
    time = Number(view.time) + Math.max(0, clock - readAt.current),
    week = view.board.week,
    weekEnd = (week + 1) * WEEK;
  const meters = [
    { label: 'Full tummy', value: p.nourishment, icon: Leaf, color: 'peach' },
    { label: 'Happiness', value: p.happiness, icon: Smile, color: 'yellow' },
    { label: 'Fresh & clean', value: p.cleanliness, icon: Droplets, color: 'blue' },
    { label: 'Energy', value: p.energy, icon: Sun, color: 'green' },
  ];
  const mood =
    p.energy < 15
      ? 'a little sleepy'
      : p.nourishment < 30
        ? 'ready for a snack'
        : p.happiness < 30
          ? 'in need of a cuddle'
          : 'happy to see you';
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#" onClick={() => setTab('Our pet')} aria-label="Uni Pet home">
          <span className="brand-mark">
            <Sprout size={27} />
          </span>
          <span>
            uni pet<span className="brand-dot">.</span>
            <small>The pet for U n I</small>
          </span>
        </a>
        <nav aria-label="Main navigation" className={menu ? 'open' : ''}>
          {tabs.map((t) => (
            <button
              key={t}
              className={tab === t ? 'active' : ''}
              onClick={() => {
                setTab(t);
                setMenu(false);
              }}
            >
              {t}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button appearance"
            onClick={() => setModal('looks')}
            aria-label="Change character"
          >
            <Palette size={21} />
          </button>
          <button
            className="button wallet"
            onClick={() => (address ? setModal('about') : setModal('connect'))}
          >
            <Wallet size={17} />
            {address ? short(address) : 'Join the family'}
          </button>
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle navigation"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main className="app-shell">
        <div className="mode-banner">
          <span className={`status-dot ${preview ? 'amber' : ''}`} />
          <span>
            {preview
              ? 'You’re in the playground. Progress stays on this device.'
              : `One shared pet on Koinos ${config.network === 'harbinger' ? 'testnet' : 'mainnet'}.`}
          </span>
          <button onClick={() => setModal('about')}>
            {preview ? 'How it works' : 'About this pet'}
            <ArrowRight size={14} />
          </button>
        </div>
        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button className="icon-button" onClick={() => setError('')} aria-label="Dismiss error">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="page-intro">
          <div>
            <span className="eyebrow">A LITTLE CREATURE. A BIG FAMILY.</span>
            <h1>
              {tab === 'Our pet' ? (
                <>
                  One little pet.
                  <br className="mobile-break" /> All of us.
                </>
              ) : tab === 'The garden' ? (
                'Good things take a little care.'
              ) : tab === 'Adventures' ? (
                'A small step into a big world.'
              ) : tab === 'Rewards' ? (
                'Good humans deserve a little love.'
              ) : (
                'Our story, one moment at a time.'
              )}
            </h1>
            <p>
              {tab === 'Our pet'
                ? 'A snack, a game, a little love. Let’s make Uni’s day.'
                : tab === 'The garden'
                  ? 'Plant something sweet. Make something to share.'
                  : tab === 'Adventures'
                    ? 'Explore, bring back berries, and choose where we go next.'
                    : tab === 'Rewards'
                      ? 'Meaningful moments. Shared memories. A few things to keep.'
                      : 'Every little act of kindness becomes part of Uni’s story.'}
            </p>
          </div>
          <button className="text-button invite" onClick={() => setModal('share')}>
            <Share2 size={17} />
            Invite a friend
            <ArrowUp />
          </button>
        </div>
        <div className="main-grid">
          <div className="main-column">
            {tab === 'Our pet' && (
              <>
                <section className="pet-scene" aria-label="Uni's home">
                  <Landscape />
                  <div className="scene-top">
                    <span className="scene-label">
                      <span className="status-dot" />
                      Uni’s little corner
                    </span>
                    <button className="scene-chip" onClick={() => setModal('looks')}>
                      <Palette size={15} />
                      {custom?.name || skins.find((s) => s.id === skin)?.name}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="speech-bubble" aria-live="polite">
                    {speech}
                    <Heart size={14} />
                  </div>
                  <div className="scene-pet">
                    {custom ? (
                      <img
                        className="custom-pet"
                        src={custom.image}
                        alt={custom.name}
                        onError={() => {
                          setCustom(null);
                          setNotice('That character could not load. Sprout is here instead.');
                        }}
                      />
                    ) : (
                      <Pet skin={skin} action={animation} sleeping={p.energy < 15} />
                    )}
                  </div>
                  <div className="pet-name">
                    <h2>
                      Uni <span>level {p.level}</span>
                    </h2>
                    <span>
                      {mood}
                      <span className="mood-dot">●</span>
                    </span>
                  </div>
                  <div className="scene-bottom">
                    <span>
                      <Sun size={15} /> A lovely day to be together
                    </span>
                    <button onClick={() => setModal('share')} aria-label="Save a Uni moment">
                      <Share2 size={17} />
                    </button>
                  </div>
                </section>
                <section className="care-controls" aria-label="Care for Uni">
                  {care.map((a) => (
                    <button
                      key={a.kind}
                      className={`care-button ${a.color}`}
                      disabled={!!busy}
                      onClick={() => void act({ kind: a.kind })}
                    >
                      <span className="care-icon">
                        {busy === a.kind ? (
                          <LoaderCircle className="spin" size={23} />
                        ) : (
                          <a.icon size={24} />
                        )}
                      </span>
                      <span>
                        <strong>{a.label}</strong>
                        <small>{a.sub}</small>
                      </span>
                      <span className="care-plus">+</span>
                    </button>
                  ))}
                </section>
                <section className="needs-section">
                  <div className="section-heading">
                    <h2>The little things that matter</h2>
                    <span>
                      {address
                        ? `${owner?.daily_points || 0} / 40 affection today`
                        : 'A little care goes a long way'}
                    </span>
                  </div>
                  <div className="meters">
                    {meters.map((m) => (
                      <div className="meter" key={m.label}>
                        <div>
                          <span>
                            <m.icon size={15} />
                            {m.label}
                          </span>
                          <strong>{m.value}%</strong>
                        </div>
                        <div
                          className={`meter-track ${m.color}`}
                          role="progressbar"
                          aria-label={m.label}
                          aria-valuenow={m.value}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <span style={{ width: `${m.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
            {tab === 'The garden' && (
              <section className="panel garden-panel">
                <div className="section-heading">
                  <h2>
                    <Sprout size={23} /> Your little patch
                  </h2>
                  <span>3 berry plots</span>
                </div>
                <p>Water once to harvest in 4 hours. Unwatered berries grow in 8 hours.</p>
                <div className="plots">
                  {(
                    owner?.plots ||
                    Array.from({ length: 3 }, () => ({ planted: '0', watered: false, crop: 0 }))
                  ).map((plot, i) => {
                    const planted = Number(plot.planted),
                      remaining = planted + (plot.watered ? 4 : 8) * 3600000 - time,
                      ready = !!planted && remaining <= 0;
                    return (
                      <article className={`plot ${planted ? 'planted' : ''}`} key={i}>
                        <span className="plot-number">PATCH {i + 1}</span>
                        <div className="plot-plant">
                          {ready ? (
                            <Flower2 size={73} />
                          ) : planted ? (
                            <Sprout size={65} />
                          ) : (
                            <Shovel size={47} />
                          )}
                        </div>
                        <h3>
                          {ready
                            ? 'Berry happy days'
                            : planted
                              ? 'Growing something good'
                              : 'A fresh beginning'}
                        </h3>
                        <p>
                          {ready
                            ? '3 berries ready to pick'
                            : planted
                              ? `${duration(remaining)} to harvest`
                              : 'One seed, a little patience'}
                        </p>
                        <button
                          className="button primary"
                          disabled={!!busy || (!!planted && plot.watered && !ready)}
                          onClick={() =>
                            void act({
                              kind: ready ? 'harvest' : planted ? 'water' : 'plant',
                              slot: i,
                            })
                          }
                        >
                          {ready
                            ? 'Pick berries'
                            : planted
                              ? plot.watered
                                ? 'Watered with love'
                                : 'Water this patch'
                              : 'Plant a seed'}
                        </button>
                      </article>
                    );
                  })}
                </div>
                <div className="crafting">
                  <div className="berry-badge">
                    <Leaf size={30} />
                  </div>
                  <div>
                    <h3>Something sweet for everyone</h3>
                    <p>
                      You have <strong>{owner?.berries || 0} berries</strong> and{' '}
                      <strong>{owner?.treats || 0} treats</strong>. Three berries make one picnic
                      treat.
                    </p>
                  </div>
                  <button
                    className="button"
                    disabled={!!busy || (!!owner && owner.berries < 3)}
                    onClick={() => void act({ kind: 'craft' })}
                  >
                    Make a treat
                    <WandSparkles size={16} />
                  </button>
                </div>
              </section>
            )}
            {tab === 'Adventures' && (
              <>
                <section className="adventure-hero">
                  <div className="adventure-art">
                    <Sun size={54} />
                    <div className="hill hill-one" />
                    <div className="hill hill-two" />
                    <Sprout className="trail-sprout" size={76} />
                  </div>
                  <span className="eyebrow">THE BERRY TRAIL</span>
                  <h2>A pocket-sized adventure.</h2>
                  <p>
                    Spend an hour exploring Uni’s neighborhood. Come back with two berries and a
                    story worth keeping.
                  </p>
                  <button
                    className="button primary"
                    disabled={
                      !!busy ||
                      (!!Number(owner?.adventure_end) && Number(owner?.adventure_end) > time)
                    }
                    onClick={() =>
                      void act({ kind: Number(owner?.adventure_end) ? 'return' : 'adventure' })
                    }
                  >
                    {Number(owner?.adventure_end)
                      ? Number(owner?.adventure_end) > time
                        ? `Exploring · ${duration(Number(owner?.adventure_end) - time)}`
                        : 'Welcome back! Collect berries'
                      : 'Let’s go exploring'}
                    <ArrowRight size={17} />
                  </button>
                </section>
                <section className="panel">
                  <div className="section-heading">
                    <h2>Where should we dream of next?</h2>
                    <span>One vote per week</span>
                  </div>
                  <p>
                    Care for Uni to join the vote. These community preferences guide future
                    adventures.
                  </p>
                  <div className="destination-list">
                    {['The flower meadow', 'The quiet pond', 'The mossy woods'].map((name, i) => (
                      <button
                        key={name}
                        disabled={!!busy || !!owner?.voted}
                        onClick={() => void act({ kind: 'vote', choice: i })}
                      >
                        <span className={`destination-icon destination-${i}`}>
                          {i === 0 ? <Flower2 /> : i === 1 ? <Droplets /> : <Sprout />}
                        </span>
                        <span>
                          <strong>{name}</strong>
                          <small>{p.votes[i] || 0} lifetime votes</small>
                        </span>
                        {owner?.voted ? <Check size={18} /> : <ArrowRight size={18} />}
                      </button>
                    ))}
                  </div>
                </section>
              </>
            )}
            {tab === 'Rewards' && (
              <>
                <section className="reward-hero">
                  <div className="big-badge">
                    <Heart size={49} />
                    <span>CARE CLUB</span>
                  </div>
                  <div>
                    <span className="eyebrow">LITTLE ACTS. LASTING MEMORIES.</span>
                    <h2>You’re Uni’s kind of person.</h2>
                    <p>
                      Care on three different days this week to earn a Care Club badge. A keepsake
                      for showing up with love.
                    </p>
                    <div className="care-days">
                      {[1, 2, 3].map((i) => (
                        <span className={(owner?.care_days || 0) >= i ? 'done' : ''} key={i}>
                          {(owner?.care_days || 0) >= i ? <Check size={15} /> : i}
                        </span>
                      ))}
                      <small>{Math.min(owner?.care_days || 0, 3)} of 3 days</small>
                    </div>
                    {!preview && !config.rewardContractId ? (
                      <p className="muted">
                        The Care Club issuer has not been connected yet. Your care days are still
                        recorded.
                      </p>
                    ) : (
                      <button
                        className="button primary"
                        disabled={!!busy || reward.claimed || (!!address && !reward.eligible)}
                        onClick={() => (address ? void claim() : setModal('connect'))}
                      >
                        {reward.claimed ? (
                          <>
                            <Check size={17} /> Badge claimed
                          </>
                        ) : address ? (
                          'Claim your badge'
                        ) : (
                          'Join the Care Club'
                        )}
                      </button>
                    )}
                    {rewardError && <p role="alert">{rewardError}</p>}
                  </div>
                </section>
                <section className="panel">
                  <h2>A world of ways to say thank you</h2>
                  <p>
                    Any community can create its own reward contract for Uni’s caretakers. Their
                    rewards are separate from Uni’s affection, so your bond never depends on a
                    prize.
                  </p>
                  <div className="empty-campaign">
                    <Gift size={29} />
                    <div>
                      <h3>Room for your community</h3>
                      <p>No external reward campaigns are listed in this client yet.</p>
                    </div>
                    <button className="text-button" onClick={() => setModal('builders')}>
                      Build a reward
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </section>
              </>
            )}
            {tab === 'Journal' && (
              <section className="panel journal">
                <div className="section-heading">
                  <h2>A little history of kindness</h2>
                  <span>{preview ? 'This device' : 'Latest 20 on-chain moments'}</span>
                </div>
                {view.events.length ? (
                  view.events.map((e) => (
                    <div className="journal-row" key={e.sequence}>
                      <span className="journal-icon">
                        <Heart size={18} />
                      </span>
                      <div>
                        <strong>{short(e.actor)}</strong> {verbs[e.kind] || e.kind}
                        <small>
                          {new Date(Number(e.time)).toLocaleString()} · Moment {e.sequence}
                        </small>
                      </div>
                      {e.points > 0 && (
                        <span className="points">
                          +{e.points} <Heart size={12} />
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <MessageCircle size={36} />
                    <h3>Every friendship starts somewhere.</h3>
                    <p>Give Uni a little care to write the first page.</p>
                    <button className="button" onClick={() => setTab('Our pet')}>
                      Meet Uni
                      <ArrowRight size={17} />
                    </button>
                  </div>
                )}
              </section>
            )}
            <section className="community-project">
              <div className="picnic-art">
                <Flower2 size={46} />
                <span>♡</span>
              </div>
              <div>
                <span className="eyebrow">BETTER TOGETHER</span>
                <h2>Let’s throw a little picnic.</h2>
                <p>Bring a berry treat. Every 100 contributions helps Uni grow.</p>
                <div className="project-progress">
                  <div>
                    <span style={{ width: `${p.project % 100}%` }} />
                  </div>
                  <strong>{p.project % 100} / 100</strong>
                </div>
              </div>
              <button
                className="button"
                disabled={!!busy}
                onClick={() =>
                  owner?.treats ? void act({ kind: 'contribute' }) : setTab('The garden')
                }
              >
                {owner?.treats ? 'Bring a treat' : 'Visit the garden'}
                <ArrowRight size={17} />
              </button>
            </section>
          </div>
          <aside className="sidebar">
            <section className="favorites panel">
              <div className="section-heading">
                <h2>
                  <Crown size={21} /> My favorite humans
                </h2>
                <span className="tiny-tag">THIS WEEK</span>
              </div>
              <p>
                A little friendly competition.
                <br />A whole lot of love.
              </p>
              <div className="favorite-podium">
                <span className="crown-float">
                  <Crown size={26} />
                </span>
                <div className="human-avatar">
                  {leader ? <Heart size={33} /> : <Users size={32} />}
                </div>
                <h3>{leader ? short(leader.address) : 'A place for you'}</h3>
                <span>
                  {leader
                    ? `${leader.score} affection · Favorite Owner`
                    : 'Uni’s first favorite could be you.'}
                </span>
              </div>
              <div className="ranking-list">
                {view.board.entries.length ? (
                  view.board.entries.slice(0, 5).map((e, i) => (
                    <div className={e.address === address ? 'your-rank' : ''} key={e.address}>
                      <span className="rank-number">{i + 1}</span>
                      <span className="mini-avatar">
                        {e.address === address ? 'U' : e.address.slice(0, 1)}
                      </span>
                      <strong>{short(e.address)}</strong>
                      <span>
                        {e.score}
                        <Heart size={12} />
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="ranking-empty">
                    No favorites yet. A snack or a cuddle is a lovely place to start.
                  </p>
                )}
              </div>
              <div className="week-footer">
                <span>Fresh friendships every week</span>
                <strong>Next round {date(weekEnd)}</strong>
              </div>
            </section>
            <section className="bond-panel">
              <div className="section-heading">
                <h2>Your little bond</h2>
                <Heart size={18} />
              </div>
              <p>
                {address
                  ? 'Uni notices the little things you do.'
                  : 'There’s always room for one more human.'}
              </p>
              {address ? (
                <>
                  <div className="bond-stats">
                    <div>
                      <strong>{owner?.score || 0}</strong>
                      <span>affection this week</span>
                    </div>
                    <div>
                      <strong>{owner?.lifetime_days || 0}</strong>
                      <span>days of friendship</span>
                    </div>
                  </div>
                  <div className="friendship-note">
                    <Sparkles size={16} />
                    {(owner?.care_days || 0) > 2
                      ? 'A familiar face. A very happy pet.'
                      : 'Every friendship begins with hello.'}
                  </div>
                </>
              ) : (
                <button className="button primary" onClick={() => setModal('connect')}>
                  Say hello
                  <ArrowRight size={16} />
                </button>
              )}
            </section>
            <section className="open-note">
              <span className="open-icon">
                <ShieldCheck size={22} />
              </span>
              <h3>Our pet. Everyone’s world.</h3>
              <p>
                One shared creature on Koinos. Anyone can bring a new character, a new home, or
                their own rewards.
              </p>
              <button className="text-button" onClick={() => setModal('builders')}>
                Made to be built upon
                <ArrowRight size={15} />
              </button>
            </section>
          </aside>
        </div>
        <footer>
          <a className="footer-brand" href="#" onClick={() => setTab('Our pet')}>
            uni pet.
          </a>
          <span>The pet for U n I. Built on Koinos.</span>
          <div>
            <button onClick={() => setModal('about')}>About</button>
            <a href="https://github.com/therexdev/uni-pet" target="_blank" rel="noreferrer">
              Open source
              <ExternalLink size={12} />
            </a>
            <button onClick={() => setModal('looks')}>Change character</button>
          </div>
        </footer>
      </main>
      {notice && (
        <div className="toast" role="status">
          <Check size={17} />
          {notice}
        </div>
      )}
      {modal === 'connect' && (
        <Dialog
          title={preview ? 'Come meet Uni' : 'Connect your wallet'}
          onClose={() => setModal(null)}
        >
          <div className="dialog-pet">
            <Pet skin={skin} small />
          </div>
          <p>
            {preview
              ? 'Explore care, gardens, and adventures with a local playground profile. This is not a shared on-chain session.'
              : 'Your Koinos wallet is your identity. Uni Pet never asks for your private key. Choose an account in Kondor to start caring.'}
          </p>
          {error && (
            <p className="inline-error" role="alert">
              {error}
            </p>
          )}
          <button className="button primary wide" disabled={!!busy} onClick={() => void connect()}>
            {busy ? <LoaderCircle size={18} className="spin" /> : <Wallet size={18} />}{' '}
            {preview ? 'Start my playground visit' : 'Connect with Kondor'}
          </button>
          {!preview && (
            <p className="fine-print">
              Use a browser with the Kondor wallet extension. Mobile browsers without it can watch
              the pet, but cannot sign care actions in this release.
            </p>
          )}
        </Dialog>
      )}
      {modal === 'looks' && (
        <Dialog title="Same Uni. A different little face." onClose={() => setModal(null)}>
          <p>Your character is your choice. Uni’s care, friendships, and history stay the same.</p>
          <div className="skin-grid">
            {skins.map((s) => (
              <button
                key={s.id}
                className={skin === s.id && !custom ? 'selected' : ''}
                onClick={() => {
                  setSkin(s.id);
                  setCustom(null);
                  localStorage.setItem('uni-pet-skin', s.id);
                }}
              >
                <Pet skin={s.id} small />
                <strong>{s.name}</strong>
                <small>{s.description}</small>
                {skin === s.id && !custom && <Check size={17} />}
              </button>
            ))}
          </div>
          <details>
            <summary>Bring a community character</summary>
            <p>
              Paste a character manifest. Images load from the creator’s HTTPS address; they receive
              your normal image request. No scripts are executed.
            </p>
            <textarea
              aria-label="Character manifest"
              value={manifest}
              onChange={(e) => setManifest(e.target.value)}
              placeholder={
                '{"protocol":"uni-pet/v1","name":"My pet","image":"https://…","author":"You"}'
              }
            />
            <button className="button" onClick={installLook}>
              Use this character
            </button>
            {error && <p className="inline-error">{error}</p>}
          </details>
          <button className="button primary wide" onClick={() => setModal(null)}>
            That’s my Uni
            <Check size={16} />
          </button>
        </Dialog>
      )}
      {modal === 'about' && (
        <Dialog title="One pet belongs to all of us." onClose={() => setModal(null)}>
          <p>
            Uni Pet is a shared creature whose meaningful rules and progress run on Koinos. This
            website is one way to visit. Another community can build an entirely different face for
            the same pet.
          </p>
          <div className="about-facts">
            <div>
              <strong>Session</strong>
              <span>{preview ? 'Local playground' : config.network}</span>
            </div>
            <div>
              <strong>Favorite Owner</strong>
              <span>Weekly affection, capped at 40 per day</span>
            </div>
            <div>
              <strong>Your wallet</strong>
              <span>{address ? short(address) : 'Not connected'}</span>
            </div>
            {!preview && (
              <>
                <div>
                  <strong>Pet contract</strong>
                  <code>{config.contractId}</code>
                </div>
                <div>
                  <strong>Core upgrade policy</strong>
                  <span>
                    {config.coreFrozen
                      ? 'Declared frozen · verify deployment metadata'
                      : 'Replaceable development deployment'}
                  </span>
                </div>
              </>
            )}
          </div>
          <p className="fine-print">
            {preview
              ? 'This build is in playground mode until a Koinos contract deployment is configured. Playground data is kept only in this browser and may be lost if site data is cleared.'
              : 'Transactions need available mana. This client has no private game server. Core needs update from chain time; signed actions record progress.'}
          </p>
          <div className="dialog-actions">
            {address && (
              <button
                className="button"
                onClick={() => {
                  setAddress('');
                  setOwner(null);
                  setModal(null);
                }}
              >
                Disconnect
              </button>
            )}
            {preview && (
              <button className="text-button" onClick={() => setModal('reset')}>
                Reset my playground
              </button>
            )}
          </div>
        </Dialog>
      )}
      {modal === 'reset' && (
        <Dialog title="A fresh start for this playground?" onClose={() => setModal(null)}>
          <p>
            This clears your local care, garden, and friendships. It does not affect any on-chain
            pet.
          </p>
          <div className="dialog-actions">
            <button className="button" onClick={() => setModal(null)}>
              Keep our memories
            </button>
            <button
              className="button primary"
              onClick={() => {
                if (gateway instanceof Playground) {
                  gateway.reset();
                  void refresh();
                  setModal(null);
                  setNotice('A fresh little beginning.');
                }
              }}
            >
              Start fresh
            </button>
          </div>
        </Dialog>
      )}
      {modal === 'share' && (
        <Dialog title="A little moment worth sharing." onClose={() => setModal(null)}>
          <canvas
            ref={card}
            width={1200}
            height={630}
            className="share-card"
            aria-label="Uni Pet invitation card"
          />
          <div className="dialog-actions">
            <button className="button primary" onClick={() => void share()}>
              <Share2 size={17} />
              Invite a friend
            </button>
            <button className="button" onClick={downloadCard}>
              <ArrowDownToLine size={17} />
              Save this moment
            </button>
          </div>
          <p className="fine-print">
            {preview
              ? 'This card shares the playground, not an on-chain achievement.'
              : 'Your invite leads to this client. The public contract can also be used by other clients.'}
          </p>
        </Dialog>
      )}
      {modal === 'builders' && (
        <Dialog title="Bring your own little world." onClose={() => setModal(null)}>
          <Code2 size={33} className="builder-icon" />
          <p>
            Build a character pack, another frontend, or an independent reward campaign using the
            same public pet state. Core affection belongs to Uni’s rules, never to a particular
            website.
          </p>
          <ul className="builder-list">
            <li>Character overlays change appearance, not identity.</li>
            <li>Care and weekly eligibility are readable on-chain.</li>
            <li>Reward issuers can recognize caretakers independently.</li>
            <li>Static clients can run without a game backend.</li>
          </ul>
          <a
            className="button primary wide"
            href="https://github.com/therexdev/uni-pet/tree/main/docs"
            target="_blank"
            rel="noreferrer"
          >
            Read the builder guides
            <ExternalLink size={16} />
          </a>
        </Dialog>
      )}
    </>
  );
}
function ArrowUp() {
  return <span className="diagonal-arrow">↗</span>;
}
