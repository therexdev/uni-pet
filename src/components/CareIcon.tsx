export function CareIcon({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="uni-care-art">
      {kind === 'feed' ? (
        <>
          <path
            d="M10 23Q24 13 38 23L35 37Q24 43 13 37Z"
            fill="#edaa76"
            stroke="#854f38"
            strokeWidth="2.2"
          />
          <path d="M8 24Q24 15 40 24" stroke="#854f38" strokeWidth="3" strokeLinecap="round" />
          <circle cx="19" cy="20" r="7" fill="#e27683" />
          <circle cx="30" cy="19" r="7" fill="#ae85c4" />
          <path d="M23 13Q22 5 31 7Q31 13 23 13" fill="#638d50" />
          <path d="M21 31q3 4 6 0" stroke="#854f38" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : kind === 'play' ? (
        <>
          <circle cx="24" cy="25" r="16" fill="#f2cd68" stroke="#9a783d" strokeWidth="2.2" />
          <path d="M12 15q18 0 19 24M9 27q12-15 27-13" stroke="#fff1b5" strokeWidth="5" />
          <path d="m35 5 1-3m6 10 3-1" stroke="#9a783d" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : kind === 'clean' ? (
        <>
          <rect
            x="9"
            y="21"
            width="30"
            height="20"
            rx="9"
            fill="#9dcee0"
            stroke="#547d92"
            strokeWidth="2.2"
          />
          <circle cx="16" cy="15" r="7" fill="#fff8e8" stroke="#547d92" strokeWidth="2" />
          <circle cx="30" cy="11" r="5" fill="#fff8e8" stroke="#547d92" strokeWidth="2" />
          <path d="m31 28 2 3-2 3-2-3Z" fill="#fff8e8" />
          <path d="M15 33h9" stroke="#547d92" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path
            d="M24 39C-3 23 13 5 24 17C35 5 51 23 24 39Z"
            fill="#e7a0ae"
            stroke="#99566c"
            strokeWidth="2.2"
          />
          <path
            d="M18 23v2m12-2v2m-10 4q4 4 8 0"
            stroke="#99566c"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="m7 8 1-4m32 7 3-3" stroke="#99566c" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function UniFace() {
  return (
    <svg viewBox="0 0 36 36" width="25" height="25" fill="none" aria-hidden="true">
      <path
        d="M10 14Q3 1 10 4L16 12M23 12Q31 0 31 7L27 17"
        fill="#bed59a"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7 21Q7 11 18 11Q30 11 30 22Q31 31 18 31Q5 31 7 21Z"
        fill="#d6e7b5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M13 21v1m10-1v1m-8 3q3 3 6 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
