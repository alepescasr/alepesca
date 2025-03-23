'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useEffect } from 'react';
import Image from 'next/image';

const brands = [
  {
    id: 1,
    name: 'Alepesca',
    logo: '/images/logos/logo-1.png'
  },
  {
    id: 2,
    name: 'Mauri',
    logo: '/images/logos/Apolo.png'
  },
  {
    id: 3,
    name: 'Penn',
    logo: '/images/logos/Caster.png'
  },
  {
    id: 4,
    name: 'Daiwa',
    logo: '/images/logos/Coleman.png'
  },
  {
    id: 5,
    name: 'Abu Garcia',
    logo: '/images/logos/Payo.png'
  },
  {
    id: 6,
    name: 'Berkley',
    logo: '/images/logos/tica.png'
  }
];

const BrandSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
    containScroll: 'keepSnaps',
    align: 'center',
    slidesToScroll: 2,
    skipSnaps: false
  });

  useEffect(() => {
    if (emblaApi) {
      const autoplay = setInterval(() => {
        emblaApi.scrollNext();
      }, 3000);

      return () => clearInterval(autoplay);
    }
  }, [emblaApi]);

  return (
    <div className="w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {[...brands, ...brands].map((brand, index) => {
              const needsLargerSize = ['Mauri', 'Penn', 'Abu Garcia', 'Berkley'].includes(brand.name);
              
              return (
                <div
                  key={`${brand.id}-${index}`}
                  className="flex-[0_0_calc(50%-1rem)] md:flex-[0_0_200px] mx-2 md:mx-6"
                >
                  <div className={`relative grayscale hover:grayscale-0 transition-all duration-300 ${needsLargerSize ? 'h-20 md:h-24' : 'h-16 md:h-20'}`}>
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, 200px"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSlider; 