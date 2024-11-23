import { mount } from '@vue/test-utils';
import Shell from './shell.vue';

describe('Shell', () => {
  it('renders properly', () => {
    const wrapper = mount(Shell, {});
    expect(wrapper.text()).toContain('Welcome to Shell');
  });
});
