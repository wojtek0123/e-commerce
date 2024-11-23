import { mount } from '@vue/test-utils';
import BookList from './book-list.vue';

describe('BookList', () => {
  it('renders properly', () => {
    const wrapper = mount(BookList, {});
    expect(wrapper.text()).toContain('Welcome to BookList');
  });
});
