import { useRef } from 'react';
import type { ReactNode } from 'react';
export function TouchPet({
  children,
  react,
}: {
  children: ReactNode;
  react: (part: string) => void;
}) {
  const stroke = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  return (
    <div className="touch-pet">
      {children}
      {['head', 'poke', 'belly'].map((part) => (
        <button
          key={part}
          className={`pet-touch touch-${part}`}
          aria-label={part === 'poke' ? 'Poke Uni' : `Pet Uni’s ${part}`}
          onPointerDown={(e) => {
            e.stopPropagation();
            stroke.current = { x: e.clientX, y: e.clientY, moved: false };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            e.stopPropagation();
            const s = stroke.current;
            if (s && !s.moved && Math.hypot(e.clientX - s.x, e.clientY - s.y) > 10) {
              s.moved = true;
              react(part);
            }
          }}
          onPointerCancel={() => {
            stroke.current = null;
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            if (stroke.current && !stroke.current.moved) react(part);
            stroke.current = null;
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (e.detail === 0) react(part);
          }}
        />
      ))}
    </div>
  );
}
