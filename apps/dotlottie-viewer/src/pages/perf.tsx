import { useCallback, useEffect, useState } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { DotLottieWorkerReact, DotLottieReact, setWasmUrl as setDotLottieWasmUrl } from '@lottiefiles/dotlottie-react';
import { Player as LottieWeb } from '@lottiefiles/react-lottie-player';
import { isMobile } from 'react-device-detect';
import { setCanvasKit, Skottie as SkottiePlayer } from '../components/skottie';
import skottieWasmUrl from '../../node_modules/canvaskit-wasm/bin/full/canvaskit.wasm?url';
import InitCanvasKit from 'canvaskit-wasm/bin/full/canvaskit';
import dotLottieWasmUrl from '../../../../packages/web/src/core/dotlottie-player.wasm?url';

setDotLottieWasmUrl(window.location.origin + dotLottieWasmUrl);

const animations = [
  '1643-exploding-star.json',
  '5317-fireworkds.json',
  '5344-honey-sack-hud.json',
  '11555.json',
  '27746-joypixels-partying-face-emoji-animation.json',
  'a_mountain.json',
  'abstract_circle.json',
  'alien.json',
  'anubis.json',
  'balloons_with_string.json',
  'batman.json',
  'birth_stone_logo.json',
  'calculator.json',
  'card_hover.json',
  'cat_loader.json',
  'coin.json',
  'confetti.json',
  'confetti2.json',
  'confettiBird.json',
  'customer.json',
  'dancing_book.json',
  'dancing_star.json',
  'day_to_night.json',
  'dodecahedron.json',
  'down.json',
  'dropball.json',
  'duck.json',
  'earth_hour.json',
  'emoji_enjoying.json',
  'emoji.json',
  'error_404.json',
  'fiery_skull.json',
  'fleche.json',
  'flipping_page.json',
  'fly_in_beaker.json',
  'focal_test.json',
  'foodrating.json',
  'frog_vr.json',
  'fun_animation.json',
  'funky_chicken.json',
  'game_finished.json',
  'geometric.json',
  'glow_loading.json',
  'gradient_background.json',
  'gradient_infinite.json',
  'gradient_sleepy_loader.json',
  'gradient_smoke.json',
  'growup.json',
  'guitar.json',
  'hamburger.json',
  'happy_holidays.json',
  'happy_trio.json',
  'hola.json',
  'holdanimation.json',
  'hourglass.json',
  'insta_camera.json',
  'isometric.json',
  'kote.json',
  'la_communaute.json',
  'like_button.json',
  'like.json',
  'loading_rectangle.json',
  'lolo_walk.json',
  'lolo.json',
  'loveface_emoji.json',
  'masking.json',
  'material_wave_loading.json',
  'merging_shapes.json',
  'message.json',
  'morphing_anim.json',
  'open_envelope.json',
  'personal_character.json',
  'polystar_anim.json',
  'polystar.json',
  'property_market.json',
  'radar.json',
  'ripple_loading_animation.json',
  'rufo.json',
  'sad_emoji.json',
  'sample.json',
  'seawalk.json',
  'skullboy.json',
  'snail.json',
  'starburst.json',
  'starstrips.json',
  'starts_transparent.json',
  'stroke_dash.json',
  'swinging.json',
  'text.json',
  'text_anim.json',
  'text2.json',
  'threads.json',
  'train.json',
  'uk_flag.json',
  'voice_recognition.json',
  'walker.json',
  'water_filling.json',
  'waves.json',
  'woman.json',
  'yarn_loading.json',
];

const urlPrefix = `${import.meta.env.BASE_URL}lottie/`;

const countOptions = [
  { id: 0, name: '10' },
  { id: 1, name: '20' },
  { id: 2, name: '50' },
  { id: 3, name: '100' },
];

const playerOptions = [
  { id: 0, name: 'dotlottie-web' },
  { id: 1, name: 'dotlottie-web/worker' },
  { id: 2, name: 'lottie-web' },
  { id: 3, name: 'skia/skottie' },
];

export const Perf = (): JSX.Element => {
  const size = isMobile ? { width: 150, height: 150 } : { width: 180, height: 180 };
  const [count, setCount] = useState(countOptions[1]);
  const [player, setPlayer] = useState(playerOptions[0]);
  const [animationList, setAnimationList] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const playerParam = params.get('player');
    const countParam = params.get('count');
    const seed = params.get('seed');

    const selectedCount = countOptions.find((c) => c.name === countParam) || countOptions[1];
    const selectedPlayer = playerOptions.find((p) => p.name === playerParam) || playerOptions[0];

    setCount(selectedCount);
    setPlayer(selectedPlayer);

    const load = async () => {
      if (selectedPlayer.id === 3) await loadCanvasKit();

      loadProfiler();

      if (seed) {
        loadSeed(seed);
        return;
      }

      loadAnimationByCount(parseInt(selectedCount.name));
    };

    setTimeout(() => {
      load();
    }, 500);
  }, []);

  const loadCanvasKit = useCallback(async () => {
    const canvasKit = await InitCanvasKit({ locateFile: () => skottieWasmUrl });
    setCanvasKit(canvasKit);
  }, []);

  const loadProfiler = useCallback(() => {
    const script = document.createElement('script');
    script.src = `${import.meta.env.BASE_URL}profiler.js`;
    document.body.appendChild(script);
  }, []);

  const loadAnimationByCount = useCallback(async (count: number) => {
    const newAnimationList = Array.from({ length: count }, () => {
      const animation = animations[Math.floor(Math.random() * animations.length)];
      return {
        name: animation.split('/').pop()?.split('.')[0] || 'Unknown',
        lottieURL: `${urlPrefix}${animation}`,
        location: `Type: ${animation.split('/').pop()?.split('.')[1] || 'Unknown'}`,
      };
    });

    setAnimationList(newAnimationList);
    saveCurrentSeed(newAnimationList);
  }, []);

  const saveCurrentSeed = useCallback((animationList: any[]) => {
    const seed = btoa(animationList.map((v) => v.name).join(','));
    setQueryStringParameter('seed', seed);
  }, []);

  const loadSeed = useCallback((seed: string) => {
    const nameList = atob(seed).split(',');
    const newAnimationList = nameList.map((name) => {
      const animation = animations.find((anim) => anim === `${name.trim()}.json`) || animations[0];
      return {
        name,
        lottieURL: `${urlPrefix}${animation}`,
        location: `Type: ${animation.split('/').pop()?.split('.')[1] || 'Unknown'}`,
      };
    });
    setAnimationList(newAnimationList);
  }, []);

  const spawnAnimation = useCallback(() => {
    if (!text.trim()) {
      alert('Please enter a valid link');
      return;
    }

    const randomIndex = Math.floor(Math.random() * animationList.length);
    const updatedAnimationList = [...animationList];
    updatedAnimationList[randomIndex] = {
      ...updatedAnimationList[randomIndex],
      lottieURL: text,
      name: text.split('/').pop()?.split('.')[0] || 'Unknown',
      location: `Type: ${text.split('/').pop()?.split('.')[1] || 'Unknown'}`,
    };
    setAnimationList(updatedAnimationList);

    setTimeout(() => {
      document
        .querySelector(`.${updatedAnimationList[randomIndex].name}-${randomIndex}`)
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }, [text, animationList]);

  const setQueryStringParameter = (name: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(name, value);
    window.history.replaceState({}, '', decodeURIComponent(`${window.location.pathname}?${params}`));
  };

  const updatePlayerAndRefresh = (playerOption: { id: number; name: string }) => {
    setPlayer(playerOption);
    setQueryStringParameter('player', playerOption.name);
    window.location.reload();
  };

  const updateCount = (countOption: { id: number; name: string }) => {
    setCount(countOption);
    setQueryStringParameter('count', countOption.name);
  };

  return (
    <div className="bg-gray-900 pt-4 pb-24 sm:pb-32 sm:pt-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <div className="mt-6 flex gap-x-4">
            <Dropdown label="Player" options={playerOptions} selected={player} onChange={updatePlayerAndRefresh} />
            <Dropdown label="Count" options={countOptions} selected={count} onChange={updateCount} />
            <button
              className="flex-none rounded-md bg-[#00deb5] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
              onClick={() => {
                setQueryStringParameter('seed', '');
                window.location.reload();
              }}
            >
              Set
            </button>
          </div>

          <div className="mt-6 flex gap-x-4">
            <input
              type="text"
              className="flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter Lottie link"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="flex-none rounded-md bg-[#00deb5] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
              onClick={spawnAnimation}
            >
              Spawn
            </button>
          </div>
        </div>

        <ul className="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-4 xl:grid-cols-5">
          {animationList.map((anim, index) => (
            <li key={`${anim.name}-${anim.lottieURL}-${index}`} className={`${anim.name}-${index}`}>
              {player.id === 0 && <DotLottieReact src={anim.lottieURL} style={size} loop autoplay />}
              {player.id === 1 && <DotLottieWorkerReact src={anim.lottieURL} style={size} loop autoplay />}
              {player.id === 2 && <LottieWeb src={anim.lottieURL} style={size} loop autoplay />}
              {player.id === 3 && <SkottiePlayer lottieURL={anim.lottieURL} width={size.width} height={size.height} />}
              <h3 className="mt-6 text-lg font-semibold text-white">{anim.name}</h3>
              <p className="text-sm text-gray-500">{anim.location}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface DropdownProps {
  label: string;
  options: Array<{ id: number; name: string }>;
  selected: { id: number; name: string };
  onChange: (option: { id: number; name: string }) => void;
}

const Dropdown = ({ label, options, selected, onChange }: DropdownProps) => (
  <div className="relative">
    <button
      className="inline-flex w-full justify-between rounded-md bg-white/5 py-3.5 px-3 pr-10 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-white/10"
      onClick={() => document.getElementById(`${label}-menu`)?.classList.toggle('hidden')}
    >
      {selected.name}
      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
    </button>
    <div
      className="hidden absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
      id={`${label}-menu`}
    >
      <div className="py-1">
        {options.map((option) => (
          <button
            key={option.id}
            className={`${
              option.id === selected.id ? 'bg-indigo-600 text-white' : 'text-gray-900'
            } block w-full px-4 py-2 text-left text-sm`}
            onClick={() => {
              onChange(option);
              document.getElementById(`${label}-menu`)?.classList.add('hidden');
            }}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  </div>
);
