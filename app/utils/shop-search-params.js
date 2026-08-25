import { get } from '@ember/object';

// The search index has two independent shop-related keyword fields:
//   shop-ids     = Product → offerings → offeredByShop → uuid
//   supplier-ids = Product → offerings → supplier      → uuid
//
// Shop model's `offerings` relationship (veeakker:offerings, Shop→Offering)
// is unreliable: the backend sets veeakker:offeredByShop (Offering→Shop) but
// does not consistently set the inverse veeakker:offerings from Shop→Offering.
// So shop.offerings is empty even for shops that have offerings, and we can't
// use it to decide which filter to apply.  We ask the search index instead —
// it traverses the correct Product→offering→offeredByShop→Shop path.

const shopParamsCache = new Map();

export default async function shopSearchParams(shop) {
  if (!shop) {
    return {};
  } else {
    const shopId = get(shop, 'id');
    if (shopParamsCache.has(shopId)) {
      return shopParamsCache.get(shopId);
    } else {
      const params = await computeShopSearchParams(shop, shopId);
      shopParamsCache.set(shopId, params);
      return params;
    }
  }
}

async function computeShopSearchParams(shop, shopId) {
  if (await shopHasOwnOfferings(shopId)) {
    return { "filter[:term:shop-ids]": shopId };
  } else {
    const suppliers = await get(shop, 'suppliers');
    if (suppliers.length > 0) {
      return { "filter[:term:supplier-ids]": suppliers.map(s => get(s, 'id')).join(",") };
    } else {
      return {};
    }
  }
}

// Probes the search index for any enabled product with an enabled offering
// offered by this shop.  Mirrors the visibility filters used by
// product-group-has-products so the decision matches what the menus will
// actually show.
async function shopHasOwnOfferings(shopId) {
  const params = new URLSearchParams({
    "filter[:term:shop-ids]": shopId,
    "filter[is-enabled]": true,
    "filter[offerings.is-enabled]": true,
    "page[number]": 0,
    "page[size]": 1
  });
  const response = await fetch(`/search/products?${params}`, {
    headers: { accept: "application/vnd.api+json" }
  });
  const payload = await response.json();
  return payload.data?.length > 0;
}
