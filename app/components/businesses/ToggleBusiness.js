import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Button } from 'react-bootstrap';
import Loading from '../Loading';
import { relayStore } from '../../clientStores';
import Business from './Business';

export default class ToggleBusiness extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      data: null,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });

    if (!this.state.data) {
      const query = Relay.createQuery(
        Relay.QL`query {
          viewer {
            business(filter: $filter) {
              ${Business.getFragment('business')}
            }
          }
        }`,
        { filter: { business_id: this.props.id } }
      );
      relayStore.primeCache({ query }, readyState => {
        if (readyState.done) {
          const data = relayStore.readQuery(query)[0];
          this.setState({ data: data.business });
        }
      });
    }
  }

  render() {
    return (
      <span>
        {' '}
        <Button
          bsSize="xsmall"
          bsStyle="info"
          onClick={this.toggle}
          data-id={this.props.id}
          children={this.state.isOpen ? 'close' : 'open'}
        />
        { this.state.isOpen && (
          this.state.data
          ? <div className="lrspace bspace">
            <Business business={this.state.data} />
          </div>
          : <Loading />
        )}
      </span>
    );
  }
}
