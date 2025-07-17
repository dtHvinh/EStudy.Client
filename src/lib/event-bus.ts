type EventHandler = (...args: any[]) => void;
const listeners = new Map<string, Set<EventHandler>>();

export const EventBus = {
  on(event: string, handler: EventHandler) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(handler);
  },
  off(event: string, handler: EventHandler) {
    listeners.get(event)?.delete(handler);
  },
  emit(event: string, ...args: any[]) {
    listeners.get(event)?.forEach((fn) => fn(...args));
  },
};

export const Events = {
  COURSE_LESSON_COMPLETED: "course-lesson-completed",
};
