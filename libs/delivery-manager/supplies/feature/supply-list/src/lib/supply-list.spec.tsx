import { render } from '@testing-library/react';

import SupplyList from './supply-list';

describe('DeliveryManagerSuppliesFeatureSupplyList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SupplyList />);
    expect(baseElement).toBeTruthy();
  });
});
