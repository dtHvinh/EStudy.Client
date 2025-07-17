export default function getCheckoutPageUrl(
  itemType: string,
  id: string | number,
) {
  return `/checkout/${itemType}/${id}`;
}
