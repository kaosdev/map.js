import { Observable } from "./observable";

export const ANIMATION_FRAME$ = new Observable<void>(({ next }) => {
  const handleId = requestAnimationFrame(() => {
    next();
  });

  return () => {
    cancelAnimationFrame(handleId);
  };
});
