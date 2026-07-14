"use client";

import Image from "next/image";
import Link from "next/link";
import { RESOURCES, type Resource } from "@/lib/resources";

function ResourceCard({ resource }: { resource: Resource }) {
  // Blog has no v2 art, so fall back to the v1 image.
  const src = resource.image2 ?? resource.image;

  const cardBody = (
    <>
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-[0_18px_40px_-24px_rgba(32,37,54,0.5)]">
        <div className="relative aspect-[2/3] w-full bg-surface-container">
          <Image
            src={src}
            alt={resource.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </div>
      <h3 className="mt-5 flex items-start gap-1.5 font-headline text-xl font-bold tracking-tight text-on-secondary-fixed transition group-hover:text-[#1f6b4e]">
        <span>{resource.title}</span>
        {resource.external && (
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="mt-1 h-4 w-4 flex-none opacity-40 transition group-hover:opacity-70"
          >
            <path
              d="M7 17L17 7M17 7H8M17 7v9"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-on-surface-variant">
        {resource.description}
      </p>
    </>
  );

  const className = "group flex flex-col";

  return resource.external ? (
    <a
      href={resource.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {cardBody}
    </a>
  ) : (
    <Link href={resource.href} className={className}>
      {cardBody}
    </Link>
  );
}

export default function ResourcesGrid() {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {RESOURCES.map((resource) => (
        <ResourceCard key={resource.title} resource={resource} />
      ))}
    </div>
  );
}
