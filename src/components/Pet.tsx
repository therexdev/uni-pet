import type { Skin } from '../lib/types';
export const skins: { id: Skin; name: string; description: string; color: string }[] = [
  { id: 'sprout', name: 'Sprout', description: 'A little wild. A lot of love.', color: '#b6d485' },
  { id: 'cloud', name: 'Cloud', description: 'Your softest little daydream.', color: '#c8c5ed' },
  { id: 'ember', name: 'Ember', description: 'Small wings. Big feelings.', color: '#edb898' },
];
export function Pet({
  skin = 'sprout',
  action = '',
  sleeping = false,
  small = false,
}: {
  skin?: Skin;
  action?: string;
  sleeping?: boolean;
  small?: boolean;
}) {
  const palette =
    skin === 'cloud'
      ? ['#d9d6fa', '#b5addd', '#f3efff']
      : skin === 'ember'
        ? ['#f2b99d', '#d58b74', '#ffe6c9']
        : ['#bdd78d', '#8eb365', '#e2edb9'];
  return (
    <svg
      className={`pet-art ${action ? 'is-' + action : ''} ${sleeping ? 'is-sleeping' : ''} ${small ? 'pet-small' : ''}`}
      viewBox="0 0 360 330"
      role="img"
      aria-label={`${skin} character ${sleeping ? 'sleeping' : action || 'smiling'}`}
    >
      <ellipse
        className="pet-shadow"
        cx="180"
        cy="297"
        rx="99"
        ry="15"
        fill="#3e6845"
        opacity=".12"
      />
      <g className="pet-body">
        {skin === 'ember' && (
          <g className="wings" fill="#d78976" stroke="#744b40" strokeWidth="3">
            <path d="M104 157Q19 73 47 217L109 222Z" />
            <path d="M253 157Q338 73 313 217L250 222Z" />
          </g>
        )}
        <path
          d="M113 251Q79 270 97 288Q115 300 141 280"
          fill={palette[1]}
          stroke="#466044"
          strokeWidth="3"
        />
        <path
          d="M225 254Q272 267 258 286Q241 302 216 278"
          fill={palette[1]}
          stroke="#466044"
          strokeWidth="3"
        />
        <path
          d="M109 129Q72 61 99 49Q125 45 147 110"
          fill={palette[0]}
          stroke="#466044"
          strokeWidth="3"
        />
        <path
          d="M217 108Q239 42 267 54Q290 66 251 134"
          fill={palette[0]}
          stroke="#466044"
          strokeWidth="3"
        />
        <path d="M111 105Q100 75 105 71Q116 70 130 104" fill={palette[2]} />
        <path d="M232 107Q249 71 261 74Q264 85 248 113" fill={palette[2]} />
        <path
          d="M84 178C84 113 122 96 180 98C242 94 278 128 278 185L276 233C272 271 239 288 181 287C121 290 86 269 83 233Z"
          fill={palette[0]}
          stroke="#466044"
          strokeWidth="3"
        />
        <ellipse cx="180" cy="233" rx="61" ry="43" fill={palette[2]} opacity=".8" />
        <g className="pet-arm left">
          <path
            d="M93 196Q54 196 66 219Q72 232 93 224"
            fill={palette[0]}
            stroke="#466044"
            strokeWidth="3"
          />
        </g>
        <g className="pet-arm right">
          <path
            d="M269 196Q306 185 301 209Q297 224 271 225"
            fill={palette[0]}
            stroke="#466044"
            strokeWidth="3"
          />
        </g>
        <g className="pet-face">
          {sleeping ? (
            <g fill="none" stroke="#324a35" strokeWidth="6" strokeLinecap="round">
              <path d="M126 169q12 10 23 0" />
              <path d="M210 169q12 10 23 0" />
            </g>
          ) : (
            <g className="eyes">
              <ellipse cx="138" cy="168" rx="8" ry="12" fill="#324a35" />
              <ellipse cx="223" cy="168" rx="8" ry="12" fill="#324a35" />
              <circle cx="141" cy="164" r="2.5" fill="white" />
              <circle cx="225" cy="164" r="2.5" fill="white" />
            </g>
          )}
          <ellipse cx="117" cy="189" rx="16" ry="9" fill="#e9a59d" opacity=".65" />
          <ellipse cx="245" cy="189" rx="16" ry="9" fill="#e9a59d" opacity=".65" />
          <path
            d="M171 188q9 11 19 0"
            fill="none"
            stroke="#324a35"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
        {skin === 'sprout' && (
          <g className="sprout">
            <path d="M180 107q-8-34 10-48" fill="none" stroke="#517945" strokeWidth="5" />
            <path d="M185 79Q148 79 158 52Q187 50 185 79" fill="#779c56" />
            <path d="M184 79Q221 74 210 50Q184 51 184 79" fill="#9fbe69" />
          </g>
        )}
        {skin === 'cloud' && (
          <path
            d="M157 106q-19-12-5-23q10-8 20 2q11-28 28-10q6 8-1 18q20-2 16 13"
            fill={palette[2]}
          />
        )}
        {skin === 'ember' && (
          <path d="M164 102l17-29 17 29" fill="#f4d692" stroke="#744b40" strokeWidth="2" />
        )}
        <path d="M171 237q10-12 18 0q1 8-9 14q-11-8-9-14" fill={palette[1]} />
      </g>
      {(action === 'comfort' || action === 'feed') && (
        <g className="floating-hearts" fill="#df8d96">
          <path d="M58 87c-12-18-32 4 0 24c31-21 12-43 0-24" />
          <path d="M293 53c-10-15-27 4 0 21c27-18 10-37 0-21" />
        </g>
      )}
      {action === 'clean' && (
        <g className="bubbles" fill="#edf9fd" stroke="#a0c6d0" strokeWidth="2">
          <circle cx="64" cy="148" r="16" />
          <circle cx="283" cy="98" r="11" />
          <circle cx="303" cy="158" r="19" />
        </g>
      )}
      {sleeping && (
        <text x="280" y="100" fill="#6d8468" fontSize="26" className="sleep-z">
          z z
        </text>
      )}
    </svg>
  );
}
export function Landscape() {
  return (
    <svg
      className="landscape"
      viewBox="0 0 1000 650"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x2="0" y2="1">
          <stop stopColor="#e9efdc" />
          <stop offset="1" stopColor="#f8f7e7" />
        </linearGradient>
      </defs>
      <rect width="1000" height="650" fill="url(#sky)" />
      <circle cx="810" cy="135" r="51" fill="#fbf0bc" />
      <g fill="#fff" opacity=".6">
        <path d="M117 127q9-35 44-22q29-29 56 5q39-4 35 25H111Z" />
        <path d="M610 82q12-20 32-10q25-31 47 5q33-7 38 16H608Z" />
      </g>
      <path d="M0 390Q191 250 393 377Q688 182 1000 361V650H0Z" fill="#dce7cd" />
      <path d="M0 433Q174 366 365 443Q644 304 1000 398V650H0Z" fill="#cbdcba" />
      <path d="M0 508Q349 422 535 482Q786 421 1000 488V650H0Z" fill="#bdd09f" />
      <ellipse cx="508" cy="557" rx="249" ry="57" fill="#dce4b5" />
      <g stroke="#819b65" strokeWidth="3" fill="none">
        <path d="M115 548v-23m0 12l-9-8m9 16l8-7M880 504v-24m0 13l9-9M749 604v-23m0 12l-9-8" />
      </g>
      <g fill="#f6efc8">
        <circle cx="140" cy="483" r="5" />
        <circle cx="817" cy="558" r="6" />
        <circle cx="291" cy="610" r="5" />
      </g>
      <g fill="#9db884">
        <ellipse cx="41" cy="580" rx="52" ry="82" />
        <ellipse cx="-5" cy="536" rx="39" ry="58" />
        <ellipse cx="991" cy="562" rx="51" ry="88" />
        <ellipse cx="941" cy="605" rx="34" ry="49" />
      </g>
      <g fill="#91aa72">
        <ellipse cx="78" cy="621" rx="49" ry="66" />
        <ellipse cx="1010" cy="625" rx="93" ry="47" />
      </g>
    </svg>
  );
}
