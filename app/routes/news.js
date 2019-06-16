import Route from '@ember/routing/route';
import { A }  from '@ember/array';

export default class NewsRoute extends Route {
  model() {
    let items = [];
    for (let i = 0; i < 15; ++i) {
      items.push({
        address: "newsitem.aspx",
        featuredImage: {
          src:"/images/ons3.jpg",
          alt:"Image of meat with spices"
        },
        title: 'NIEUWS item 1',
        content: 'loren ipsum',
        date: '25/12/2018',
      });
    }
    return A(items);
  }
}
