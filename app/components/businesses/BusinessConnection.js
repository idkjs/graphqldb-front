import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import BusinessConnectionItem from './BusinessConnectionItem';

class BusinessConnection extends React.Component {
  static propTypes = {
    onItemClick: PropTypes.func,
    businessConnection: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(i) {
    if (this.props.onItemClick) {
      this.props.onItemClick(i);
    }
  }

  render() {
    return (
      <div>
        <h3>Total {this.props.businessConnection.count} records</h3>

        {this.props.businessConnection.edges.map(({ node }) => {
          return (
            <div key={node._id}>
              <BusinessConnectionItem
                business={node}
                onItemClick={this.handleItemClick}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default Relay.createContainer(BusinessConnection, {
  fragments: {
    businessConnection: () => Relay.QL`
      fragment on BusinessConnection {
        count
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            _id
            ${BusinessConnectionItem.getFragment('business')}
          }
        }
      }
    `,
  },
});
