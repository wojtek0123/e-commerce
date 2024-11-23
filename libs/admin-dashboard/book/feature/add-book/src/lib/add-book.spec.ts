import { mount } from '@vue/test-utils';
import AddBook from './add-book.vue';

describe('AddBook', () => {
  it('renders properly', () => {
    const wrapper = mount(AddBook, {});
    expect(wrapper.text()).toContain('Welcome to AddBook');
  });
});
