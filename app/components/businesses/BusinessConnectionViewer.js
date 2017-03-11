import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import Loading from '../Loading';
import BusinessConnection from './BusinessConnection';

const PER_PAGE = 10;

class BusinessConnectionViewer extends React.Component {
  static propTypes = {
    viewer: PropTypes.object,
    relay: PropTypes.object.isRequired,
    onItemClick: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    setTimeout(
      () => this.loadNextItemsIfNeeded(this.scrollContainer),
      500);

    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll() {
    if (!this.state.loading) {
      this.loadNextItemsIfNeeded();
    }
  }

  loadNextItemsIfNeeded() {
    const elem = this.scrollContainer;
    const contentHeight = elem.offsetHeight;
    const y = window.pageYOffset + window.innerHeight;
    if (y >= contentHeight) {
      this.loadNextItems();
    }
  }

  loadNextItems() {
    this.setState({ loading: true }, () => {
      if (this.props.viewer.businessConnection.pageInfo.hasNextPage) {
        this.props.relay.setVariables({
          count: this.props.relay.variables.count + PER_PAGE,
        }, (readyState) => { // this gets called twice https://goo.gl/ZsQ3Dy
          if (readyState.done) {
            this.setState({ loading: false }, () => { this.loadNextItemsIfNeeded(); });
          }
        });
      } else {
        window.removeEventListener('scroll', this.onScroll);
      }
    });
  }

  handleItemClick(i) {
    if (this.props.onItemClick) {
      this.props.onItemClick(i);
    }
  }

  render() {
    return (
      <div
        onScroll={this.onScroll}
        ref={c => { this.scrollContainer = c; }}
        style={{ marginBottom: '200px' }}
      >
        <BusinessConnection businessConnection={this.props.viewer.businessConnection} />

        { this.props.viewer.businessConnection.pageInfo.hasNextPage &&
          <Loading />
        }
      </div>
    );
  }
}

export default Relay.createContainer(BusinessConnectionViewer, {
  initialVariables: {
    count: PER_PAGE,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        businessConnection(first: $count) {
          pageInfo {
            hasNextPage
          }
          ${BusinessConnection.getFragment('businessConnection')}
        }
      }
    `,
  },
});
