import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Address from '../Address';
import ToggleProductCollection from '../products/ToggleProductConnection';

class Business extends React.Component {
  static propTypes = {
    business: PropTypes.object,
  };

  render() {
    const { business = {} } = this.props;

    return (
      <div className="bordered">
        <dl className="dl-horizontal">

          <dt>CompanyName</dt>
          <dd>{business.name}</dd>

          <dt>Contact</dt>
          <dd>{business.full_address}</dd>
          <dd>{business.city}</dd>
          <dd>{business.phone}</dd>


        </dl>
      </div>
    );
  }
}

export default Relay.createContainer(Business, {
  fragments: {
    business: () => Relay.QL`
      fragment on Business {
        business_id
        name
        full_address
        city
        phone
        reviewConnection {
          count
        }
      }
    `,
  },
});
