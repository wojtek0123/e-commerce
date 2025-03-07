import { render } from '@testing-library/react';

import DeliverManagerAuthFeatureShell from './deliver-manager-auth-feature-shell';

describe('DeliverManagerAuthFeatureShell', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeliverManagerAuthFeatureShell />);
    expect(baseElement).toBeTruthy();
  });
});
