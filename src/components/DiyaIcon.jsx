import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * DiyaIcon — stylized architectural Diya honoring the ARCH design language
 * Combines minimal architectural geometry with a warm festive flame and glow.
 */
const DiyaIcon = ({ size = 'md', className = '' }) => {
  const flameRef = useRef(null);
  const glowRef = useRef(null);
  const innerFlameRef = useRef(null);

  useEffect(() => {
    if (!flameRef.current || !glowRef.current) return;

    // Organic flame flicker
    const flameTl = gsap.timeline({ repeat: -1, yoyo: true });
    flameTl
      .to(flameRef.current, {
        scaleY: 1.25,
        scaleX: 0.92,
        rotation: 2,
        duration: 0.45,
        ease: 'power1.inOut',
      })
      .to(flameRef.current, {
        scaleY: 0.88,
        scaleX: 1.12,
        rotation: -2,
        duration: 0.35,
        ease: 'power1.inOut',
      })
      .to(flameRef.current, {
        scaleY: 1.15,
        scaleX: 0.96,
        rotation: 1,
        duration: 0.5,
        ease: 'power1.inOut',
      });

    // Inner bright core pulsation
    if (innerFlameRef.current) {
      gsap.to(innerFlameRef.current, {
        scaleY: 1.2,
        scaleX: 0.85,
        opacity: 0.95,
        duration: 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // Warm ambient halo glow
    gsap.to(glowRef.current, {
      opacity: 0.65,
      scale: 1.35,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      flameTl.kill();
    };
  }, []);

  const dimensions =
    size === 'sm'
      ? { w: 'w-7', h: 'h-7', diyaW: 'w-5', diyaH: 'h-2.5', flameW: 'w-2', flameH: 'h-3.5', top: '-top-3' }
      : size === 'lg'
      ? { w: 'w-12', h: 'h-12', diyaW: 'w-9', diyaH: 'h-4', flameW: 'w-3.5', flameH: 'h-6', top: '-top-5' }
      : { w: 'w-9', h: 'h-9', diyaW: 'w-7', diyaH: 'h-3', flameW: 'w-2.5', flameH: 'h-4.5', top: '-top-4' };

  return (
    <div className={`relative flex items-center justify-center ${dimensions.w} ${dimensions.h} ${className}`}>
      {/* Warm Ambient Radial Halo */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-2 rounded-full opacity-45 blur-md"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.75) 0%, rgba(234, 88, 12, 0.35) 45%, transparent 75%)',
        }}
      />

      {/* Flame Container */}
      <div
        ref={flameRef}
        className={`absolute ${dimensions.top} left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center justify-center`}
        style={{ transformOrigin: 'center bottom' }}
      >
        {/* Outer Flame */}
        <div
          className={`${dimensions.flameW} ${dimensions.flameH}`}
          style={{
            background: 'radial-gradient(ellipse at 50% 85%, #ffffff 0%, #fef08a 25%, #f59e0b 60%, #ea580c 90%)',
            borderRadius: '50% 50% 35% 35% / 60% 60% 40% 40%',
            filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.9)) drop-shadow(0 0 12px rgba(234, 88, 12, 0.5))',
          }}
        />

        {/* Inner white-hot wick core */}
        <div
          ref={innerFlameRef}
          className="absolute bottom-0.5 w-1 h-2 rounded-full bg-white opacity-80"
          style={{ transformOrigin: 'center bottom' }}
        />
      </div>

      {/* Architectural Diya Vessel (Brass / Terracotta Geometry) */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Cotton Wick tip */}
        <div className="w-[1.5px] h-1.5 bg-[#451a03] -mb-0.5 z-10" />

        {/* Vessel Bowl */}
        <div
          className={`${dimensions.diyaW} ${dimensions.diyaH} relative border border-[#78350f] overflow-hidden`}
          style={{
            background: 'linear-gradient(180deg, #92400e 0%, #78350f 60%, #451a03 100%)',
            borderRadius: '2px 2px 14px 14px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.35), inset 0 1px 0 rgba(251, 191, 36, 0.4)',
          }}
        >
          {/* Molten oil / ghee surface with golden glint */}
          <div
            className="absolute top-0 inset-x-0.5 h-[2px] bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 opacity-90"
          />
        </div>

        {/* Minimal pedestal base */}
        <div className="w-3 h-[2px] bg-[#451a03] rounded-full mt-[1px] opacity-80" />
      </div>
    </div>
  );
};

export default DiyaIcon;
