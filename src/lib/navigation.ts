export default function getCheckoutPageUrl(
  itemType: string,
  id: string | number,
) {
  return `/checkout/${itemType}/${id}`;
}

export function getCourseLearnPageUrl(courseId: string) {
  return `courses/${courseId}/learn`;
}
