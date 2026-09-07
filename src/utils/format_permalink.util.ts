/**
 * Format a string by converting it to a URL-friendly format.
 * @param value - The name to format
 * @example ```ts
 * // Removes spaces and replaces with dashes
 * formatPermalinkOrSlug("how to use the best image ever.png");
 * // Returns "how-to-use-the-best-image-ever"
 * 
 * // Removes emojis
 * formatPermalinkOrSlug("Title of resource ⚡️");
 * // Returns "title-of-resource"
 * 
 * // Removes spanish accents and non alpha numerical characters
 * formatPermalinkOrSlug("¿ Cuantos años tiene de existencia este recurso ?");
 * // Returns "cuantos-anos-de-existencia-tiene-este-recurso"
 * 
 * // Deletes trailing spaces
 * formatPermalinkOrSlug(" lorem ipsum ");
 * // Returns "lorem-ipsum"
 * ```
 * @returns The formatted value
 */
export const formatPermalinkOrSlug = (value: string): string => {
  return value
    .toLowerCase()
    .normalize('NFD')
    // remove accents
    .replace(/[\u0300-\u036f]/g, '')
    // removes extension
    .replace(/\.[^/.]+$/, '')
    // removes trailing spaces
    .trim()
    // replace non-alphanumeric characters with dashes
    .replace(/[^a-z0-9]+/g, '-')
    // remove leading and trailing dashes
    .replace(/^-+|-+$/g, '');
};