import { render } from '@testing-library/react';

import DeliveryManagerCoreFeatureNav from './delivery-manager-core-feature-nav';

describe('DeliveryManagerCoreFeatureNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeliveryManagerCoreFeatureNav />);
    expect(baseElement).toBeTruthy();
  });
});
