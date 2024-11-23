import { mount } from '@vue/test-utils';
import Domain from './domain.vue';

describe('Domain', () => {
  it('renders properly', () => {
    const wrapper = mount(Domain, {});
    expect(wrapper.text()).toContain('Welcome to Domain');
  });
});
