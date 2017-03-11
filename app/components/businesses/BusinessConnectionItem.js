import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Button } from 'react-bootstrap';
import Loading from 'react-loading';
import Business from './Business';
import { relayStore } from '../../clientStores';

class BusinessConnectionItem extends React.Component {
  static propTypes = {
    business: PropTypes.object,
    relay: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      additionalData: null,
    };

    this.openClose = this.openClose.bind(this);
  }

  openClose() {
    this.setState({
      isOpen: !this.state.isOpen,
    });

    if (!this.state.additionalData) {
      const query = Relay.createQuery(
        Relay.QL`query {
          node(id:$id) {
            ${Business.getFragment('business')}
          }
        }`,
        { id: this.props.business.business_id },
      );
      relayStore.primeCache({ query }, readyState => {
        if (readyState.done) {
          const data = relayStore.readQuery(query)[0];
          this.setState({ additionalData: data });
        }
      });
    }
  }

  render() {
    const { business = {} } = this.props;
    const { isOpen } = this.state;

    return (
      <div>
        <div
          onClick={this.openClose}
          style={{ cursor: 'pointer' }}
          className={['row', 'bgOnHover', isOpen ? 'bg-primary' : ''].join(' ')}
        >
          
        <div className="col-sm-3"><b>{business.name}</b></div>
          <div className="col-sm-2">{business.contactName}</div>
          <div className="col-sm-2">{business.contactTitle}</div>
          <div className="col-sm-1">
            <Button bsSize="xsmall" bsStyle="info">
              { isOpen ? 'Close' : 'Open' }
            </Button>
          </div>
        </div>
        { isOpen && (
          this.state.additionalData
          ? <div className="lrspace bspace">
            <Business business={this.state.additionalData} />
          </div>
          : <Loading type="bubbles" color="#3385b5" />
        )}
      </div>
    );
  }
}

export default Relay.createContainer(BusinessConnectionItem, {
  fragments: {
    business: () => Relay.QL`
      fragment on Business {
        _id
        business_id
        name
        full_address
      }
    `,
  },
});
