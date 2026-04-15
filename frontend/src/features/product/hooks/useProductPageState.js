import { useMemo, useState } from "react";

export function useProductPageState(productId, emiCardsLength) {
  const normalizedId = useMemo(() => {
    const numericId = Number(productId);
    return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
  }, [productId]);

  const selectedId = normalizedId ?? 1;

  const [isEmiOpen, setIsEmiOpen] = useState(true);
  const [activeEmiIndex, setActiveEmiIndex] = useState(0);
  const [isProtectionOpen, setIsProtectionOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [isQaOpen, setIsQaOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [activeDetailsTab, setActiveDetailsTab] = useState("specifications");

  const goToNextEmiCard = () => {
    setActiveEmiIndex((prev) => (prev + 1) % emiCardsLength);
  };

  const goToPrevEmiCard = () => {
    setActiveEmiIndex((prev) => (prev - 1 + emiCardsLength) % emiCardsLength);
  };

  const showPrevEmiArrow = activeEmiIndex > 0;
  const showNextEmiArrow = activeEmiIndex < emiCardsLength - 1;

  return {
    selectedId,
    isEmiOpen,
    setIsEmiOpen,
    activeEmiIndex,
    goToNextEmiCard,
    goToPrevEmiCard,
    showPrevEmiArrow,
    showNextEmiArrow,
    isProtectionOpen,
    setIsProtectionOpen,
    isDetailsOpen,
    setIsDetailsOpen,
    isDetailsExpanded,
    setIsDetailsExpanded,
    isQaOpen,
    setIsQaOpen,
    isReviewsOpen,
    setIsReviewsOpen,
    activeDetailsTab,
    setActiveDetailsTab,
  };
}
