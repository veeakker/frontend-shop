import { tracked } from '@glimmer/tracking';
import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import { use, Resource } from 'ember-could-get-used-to-this';

class SortOfferings extends Resource {
  @tracked value

  async setup() {
    let offerings = this.args.positional[0];
    await offerings?.map(async (offering) =>
      await offering.get('typeAndQuantity.value')
    );

    this.value =
      offerings?.toArray()
        .sort((a, b) => a.get('typeAndQuantity.value') - b.get('typeAndQuantity.value'));
  }
}

export default class ProductModel extends Model {
  @attr() label;
  @attr() altLabel;
  @attr() description;
  @attr() ingredientsText;
  @attr() nutricionDataText;
  @attr() allergensText;
  @attr('boolean') isEnabled;
  @attr('number') plu;
  @attr('number') sortIndex;
  @attr('uri-set') productLabels;
  @hasMany('product-group') productGroups;
  @hasMany('offering') offerings;
  @belongsTo('unit-price-specification') unitPrice;
  @belongsTo('quantitative-value') targetUnit;
  @belongsTo('file') thumbnail;

  @use sortedOfferings = new SortOfferings(() => [this.offerings]);

  get labelArray() {
    const enabled = (this.productLabels || []);
    return [{
      uri: "http://veeakker.be/product-labels/d9fa5ad6-0d0e-4990-b8a7-ca3a60eb3a85",
      label: "Frozen",
      image: "/images/product-labels/diepvries.png",
      selected: enabled.includes("http://veeakker.be/product-labels/d9fa5ad6-0d0e-4990-b8a7-ca3a60eb3a85")
    },
    {
      uri: "http://veeakker.be/product-labels/fa0d5d40-762e-4f89-ac82-46c1a4ee00bf",
      label: "Natuurpunt",
      image: "/images/product-labels/natuurpunt.png",
      selected: enabled.includes("http://veeakker.be/product-labels/fa0d5d40-762e-4f89-ac82-46c1a4ee00bf")
    },
    {
      uri: "http://veeakker.be/product-labels/c9e43e38-3f7f-4116-9817-80bdede3f123",
      label: "PintaFish",
      image: "/images/product-labels/pintafish.png",
      selected: enabled.includes("http://veeakker.be/product-labels/c9e43e38-3f7f-4116-9817-80bdede3f123")
    }];
  }

  get enabledLabelArray() {
    return this.labelArray.filter(({ selected }) => selected);
  }
}
