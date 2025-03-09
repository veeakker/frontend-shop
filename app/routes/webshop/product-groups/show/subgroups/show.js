import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

function arr(thing) {
  if( thing instanceof Array )
    return thing;
  else if (thing != null && thing != undefined)
    return [thing];
  else
    return [];
}

export default class WebshopProductGroupsShowSubgroupsShowRoute extends Route {
  @service store

  async model({ subgroup_id }) {
    const productGroup = await this.store.find('product-group', subgroup_id);
    const productsURL = "/search/products?" + (new URLSearchParams({
      "filter[:term:product-group-ids]": subgroup_id,
      "page[number]": 0,
      "page[size]": 250,
      "filter[is-enabled]": true
    })).toString();
    const productsPayload = await (await fetch(productsURL, {
      headers: { accept: "application/vnd.api+json" }
    })).json();

    // ingest all products into the store
    let allIncluded = [];
    let includedToTransform = [];

    // helper for transforming nested object
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

      // set the product.offering.typeAndQuantity.product backlinked relationship
      for (const offering of arr(product.attributes.offerings)) {
        for (const typeAndQuantity of arr(offering["type-and-quantity"])) {
          typeAndQuantity["relationships"] ||= {};
          typeAndQuantity["relationships"]["product"] = {
            data: { type: "products", id: product.id }
          };
        }
      }

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
        key: "unit-price",
        targetObject: product,
        multi: false,
        transformer({ uuid }) { return { id: uuid, type: "unit-price-specification" }; }
      });

      transformAttribute({
        key: "target-unit",
        targetObject: product,
        multi: false,
        transformer({ uuid }) { return { id: uuid, type: "quantitative-value" }; }
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
          item.relationships = item.attributes.relationships;
          delete item.attributes.relationships;
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
  }
}
