import DS from 'ember-data';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';

const { JSONAPIAdapter } = DS;

export default class ApplicationAdapter extends JSONAPIAdapter.extend( AdapterFetch ) {
}
