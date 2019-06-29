import Component from '@ember/component';
import { A }  from '@ember/array';

export default Component.extend({
  data: A([
    { src: "/images/ons1.jpg", alt:"Image of meat being cut"},
    { src: "/images/ons2.jpg", alt:"Image of meat"},
    { src: "/images/ons3.jpg", alt:"Image of meat with spices"},
  ])
});
