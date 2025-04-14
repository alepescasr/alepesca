"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Color } from '@/types';

interface FilterProps {
  valueKey: string;
  name: string;
  data: Color[];
}

const Filter: React.FC<FilterProps> = ({
  valueKey,
  name,
  data
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedValue = searchParams.get(valueKey);

  const onClick = (id: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    current.set(valueKey, id);

    const search = current.toString();
    const query = search ? `?${search}` : '';

    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold">
        {name}
      </h3>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-2">
        {data.map((filter) => (
          <div key={filter.id} className="flex items-center">
            <input
              type="radio"
              id={filter.id}
              name={valueKey}
              checked={selectedValue === filter.id}
              onChange={() => onClick(filter.id)}
              className="sr-only"
            />
            <label
              htmlFor={filter.id}
              className="flex flex-col gap-y-3 font-medium cursor-pointer"
            >
              <div className="flex items-center gap-x-2">
                <div
                  className="h-6 w-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: filter.value }}
                />
                <span>{filter.name}</span>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;