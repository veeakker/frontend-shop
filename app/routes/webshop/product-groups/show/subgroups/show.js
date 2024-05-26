import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WebshopProductGroupsShowSubgroupsShowRoute extends Route {
  @service store

  async model({ subgroup_id }) {
    const productGroup = await this.store.find('product-group', subgroup_id);
    const productsURL = "/search/products?" + (new URLSearchParams({
      "filter[product-group-ids]": subgroup_id, // TODO: is this correct without :term: ? can probably be enabled again after re-index
      "page[number]": 0,
      "page[size]": 250,
      "filter[is-enabled]": true
    })).toString();
    const productsPayload = await (await fetch(productsURL)).json();

    // ingest all products into the store
    let allIncluded = [];
    let includedToTransform = [];

    function transformAttribute({ key, sourceKey = key, targetKey = key, targetType = key, targetObject, transformer, multi = true, transformIncluded = true }) {
      // transforms a supplied attribute for key through lambda for each
      // of the solutions.  ensures related objects will be transformed later.
      targetObject["relationships"] ||= {};

      const startValue = targetObject["attributes"][sourceKey];

      if (transformIncluded) {
        if (startValue instanceof Array)
          startValue.forEach((s) => includedToTransform.push(Object.assign({ type: targetType }, s)));
        else if (startValue)
          includedToTransform.push(Object.assign({ type: targetType }, startValue));
      }

      let newValues;
      if (startValue instanceof Array)
        newValues = startValue.map(transformer);
      else if (startValue)
        newValues = [transformer(startValue)];
      else
        newValues = [];

      if (multi)
        targetObject["relationships"][targetKey] = { data: newValues };
      else
        targetObject["relationships"][targetKey] = { data: newValues.length ? newValues[0] : null };

      delete targetObject["attributes"][sourceKey];
    }

    const transformedProductPayloads = productsPayload.data.map((productSource) => {
      const product = Object.assign({}, productSource);
      product["relationships"] ||= {};

      delete product["attributes"]["uri"];
      delete product["attributes"]["uuid"];
      delete product["highlight"];

      transformAttribute({
        key: "product-groups",
        sourceKey: "product-group-ids",
        targetObject: product,
        transformIncluded: false,
        transformer(id) {
          return { id, type: "product-groups" };
        }
      });

      transformAttribute({
        key: "offerings",
        targetObject: product,
        transformer({ uuid }) { return { id: uuid, type: "offerings" }; }
      });

      transformAttribute({
        key: "thumbnail",
        targetObject: product,
        multi: false,
        transformer({ uuid }) { return { id: uuid, type: "files" }; }
      });
      return product;
    });

    while (includedToTransform.length) {
      const ourIncluded = includedToTransform;
      includedToTransform = [];

      for (const rawItem of ourIncluded) {
        const item = { attributes: rawItem };
        const type = item.attributes.type;
        item["id"] = item["attributes"]["uuid"];
        delete item["attributes"]["uri"];
        delete item["attributes"]["uuid"];
        delete item["attributes"]["type"];

        if (type == "offerings") {
          transformAttribute({
            key: "type-and-quantity",
            targetObject: item,
            multi: false,
            transformer({ uuid }) { return { type: "type-and-quantities", id: uuid }; }
          });
          transformAttribute({
            key: "unit-price",
            targetObject: item,
            multi: false,
            transformer({ uuid }) { return { type: "unit-price-specifications", id: uuid }; }
          });
          item["type"] = "offerings";
          allIncluded.push( item );
        } else if( type == "thumbnail" ) {
          item["type"] = "files";
          allIncluded.push(item);
        } else if( type == "type-and-quantity" ) {
          item["type"] = "type-and-quantities";
          allIncluded.push(item);
        } else if( type == "unit-price" ) {
          item["type"] = "unit-price-specifications",
          allIncluded.push(item);
        }
      }
    }

    await this.store.pushPayload({ data: transformedProductPayloads, included: allIncluded });

    const products = productsPayload.data.map(({ id }) => this.store.peekRecord('product', id));

    return { productGroup, products: products };

    // return this.store.loadRecord('product-group', subgroup_id, {
    //   include: "products.offerings.unit-price,products.offerings.type-and-quantity.product"
    // });
  }
}
