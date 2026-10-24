import React, { useMemo } from 'react';

// Векторная форма подлинного берёзового листа с зубчиками и прожилками
function BirchLeafSvg({ color, strokeColor, width = 24, height = 28 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Черешок */}
      <path d="M16 38 C16 34 16 30 16 28" stroke={strokeColor || '#1b4332'} strokeWidth="1.5" strokeLinecap="round" />
      {/* Тело берёзового листа с характерной треугольно-ромбической формой и зазубринами */}
      <path
        d="M16 28 
           C12 28 8 26 5 21 
           C3.5 18 4 15 5.5 13 
           C4.5 11 5.5 9 7 8 
           C8 6 10 5 11.5 4 
           C13.5 2.5 15 1 16 0 
           C17 1 18.5 2.5 20.5 4 
           C22 5 24 6 25 8 
           C26.5 9 27.5 11 26.5 13 
           C28 15 28.5 18 27 21 
           C24 26 20 28 16 28 Z"
        fill={color}
        stroke={strokeColor || '#1b4332'}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Центральная прожилка */}
      <path d="M16 28 C16 20 16 10 16 2" stroke={strokeColor || '#1b4332'} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      {/* Боковые прожилки */}
      <path d="M16 23 C13 21 10 20 7 20" stroke={strokeColor || '#1b4332'} strokeWidth="0.75" strokeLinecap="round" opacity="0.45" />
      <path d="M16 23 C19 21 22 20 25 20" stroke={strokeColor || '#1b4332'} strokeWidth="0.75" strokeLinecap="round" opacity="0.45" />
      <path d="M16 17 C13 15 10 14 8 13" stroke={strokeColor || '#1b4332'} strokeWidth="0.75" strokeLinecap="round" opacity="0.45" />
      <path d="M16 17 C19 15 22 14 24 13" stroke={strokeColor || '#1b4332'} strokeWidth="0.75" strokeLinecap="round" opacity="0.45" />
      <path d="M16 11 C13 9.5 11 8.5 9 8" stroke={strokeColor || '#1b4332'} strokeWidth="0.75" strokeLinecap="round" opacity="0.45" />
      <path d="M16 11 C19 9.5 21 8.5 23 8" stroke={strokeColor || '#1b4332'} strokeWidth="0.75" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

// Палитра листьев берёзы (зелёные и золотистые — в цвета Урала и берёзовского золота)
const LEAF_COLORS = [
  { fill: '#40916c', stroke: '#1b4332' }, // Изумрудно-зелёный
  { fill: '#52b788', stroke: '#2d6a4f' }, // Свежий берёзовый
  { fill: '#74c69d', stroke: '#2d6a4f' }, // Светло-зелёный
  { fill: '#d4af37', stroke: '#856404' }, // Золотистый (символ уральского золота)
  { fill: '#e9c46a', stroke: '#b08920' }, // Янтарный
  { fill: '#2d6a4f', stroke: '#081c15' }, // Тёмная хвоя и малахит
];

export default function BirchLeaves({ count = 22 }) {
  // Генерируем стабильный набор параметров для падающих листьев
  const leaves = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const colorScheme = LEAF_COLORS[i % LEAF_COLORS.length];
      const startX = (i * (100 / count) + ((i * 17) % 5 - 2.5)).toFixed(1);
      const duration = (9 + (i % 7) * 1.5).toFixed(1); // от 9 до 18 секунд
      const delay = ((i * 0.7) % 10).toFixed(1); // задержка старта
      const size = 18 + (i % 4) * 5; // размер от 18 до 33px
      const swayAmplitude = 25 + (i % 5) * 12; // амплитуда покачивания на ветру
      const opacity = 0.55 + (i % 4) * 0.12; // полупрозрачность для ненавязчивости
      const animType = (i % 3) + 1; // 3 разных типа покачивания

      return {
        id: i,
        color: colorScheme.fill,
        stroke: colorScheme.stroke,
        left: `${startX}%`,
        duration: `${duration}s`,
        delay: `-${delay}s`,
        size,
        swayAmplitude,
        opacity,
        animType,
      };
    });
  }, [count]);

  return (
    <div className="birch-leaves-container" aria-hidden="true">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className={`birch-leaf birch-leaf-anim-${leaf.animType}`}
          style={{
            left: leaf.left,
            animationDuration: leaf.duration,
            animationDelay: leaf.delay,
            opacity: leaf.opacity,
            '--sway-amp': `${leaf.swayAmplitude}px`,
          }}
        >
          <BirchLeafSvg
            color={leaf.color}
            strokeColor={leaf.stroke}
            width={leaf.size}
            height={Math.round(leaf.size * 1.2)}
          />
        </div>
      ))}
    </div>
  );
}
