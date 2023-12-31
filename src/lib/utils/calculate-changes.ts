import { get } from "svelte/store";
import type { SectionLookup } from "../contracts/model.type";
import type { Changes } from "../contracts/changes.type";

type CalculateChangesOptions = {
  id: string;
  sections: SectionLookup;
  leftSpace: number;
  isSpaceLeft: boolean;
  allClosed: boolean;
};

export function calculateChanges({
  id,
  sections,
  leftSpace,
  isSpaceLeft,
  allClosed,
}: CalculateChangesOptions): Changes {
  const { isOpened: _isOpened, refContentHeight } = sections[id]!;
  const contentHeight = get(refContentHeight);

  // ? 0️⃣  no changes
  const isOpened = get(_isOpened);
  if (contentHeight <= 0) {
    if (isOpened) return [{ id, height: 0 }];
    return [{ id, height: 150 }];
  }

  if (allClosed) {
    return [{ id, height: leftSpace || contentHeight }];
  }

  // ? 1️⃣ one change
  if (isOpened === true) {
    return [{ id, height: 0 }];
  }

  let result = leftSpace;

  // ? 📖 was closed
  const isContentHalfOfLeftSpace = contentHeight <= leftSpace / 2;
  if (isContentHalfOfLeftSpace) {
    result = contentHeight;
  }

  if (!isSpaceLeft) {
    let biggestSectionId = Object.keys(sections)[0];

    Object.keys(sections).forEach((key) => {
      if (
        get(sections[key]!.refContentHeight) >=
        get(sections[biggestSectionId]!.refContentHeight)
      ) {
        biggestSectionId = key;
      }
    });

    const section = sections[biggestSectionId]!;
    result = Math.min(contentHeight, 100);

    return [
      { id, height: result },
      { id: biggestSectionId, height: get(section.height) - result },
    ];
  }

  return [{ id, height: result }];
}
