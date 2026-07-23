"use client";

import { useState } from "react";

export function MenuCarousel({
    photos,
}: {
    photos: { plat_id: number; titre_plat: string }[];
}) {
    const [index, setIndex] = useState(0);

    if (photos.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-white/20 text-primary-foreground/60">
                Aucune photo
            </div>
        );
    }

    const photo = photos[index];

    function previous() {
        if (index === 0) {
            setIndex(photos.length - 1);
        } else {
            setIndex(index - 1);
        }
    }

    function next() {
        if (index === photos.length - 1) {
            setIndex(0);
        } else {
            setIndex(index + 1);
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-2xl bg-white/20">
                <img
                    src={"/api/plats/" + photo.plat_id + "/photo"}
                    alt={photo.titre_plat}
                    className="h-72 w-full object-cover"
                />
                {photos.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={previous}
                            className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/90 px-3 py-1 text-sm">
                            ←
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/90 px-3 py-1 text-sm">
                            →
                        </button>
                    </>
                )}
            </div>
            <p className="text-center text-sm text-primary-foreground/70">
                {photo.titre_plat} ({index + 1}/{photos.length})
            </p>
        </div>
    );
}
