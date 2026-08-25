// Virtuoso can't apply all constraints at once so we use the search index to check if there are products in the group.
export default async function productGroupHasProducts(groupId, businessEntity, shopParams) {
  const searchQueryParams = {
    "filter[:term:product-group-ids]": groupId,
    "page[number]": 0,
    "page[size]": 1,
    "filter[is-enabled]": true,
    "filter[offerings.is-enabled]": true,
    ...businessEntity?.id ? { "filter[:term:available-at-or-from-ids]": businessEntity.id } : {},
    ...shopParams || {}
  };

  const url = "/search/products?" + new URLSearchParams(searchQueryParams).toString();
  const response = await fetch(url, {
    headers: { accept: "application/vnd.api+json" }
  });
  const payload = await response.json();
  return payload.data?.length > 0;
}
