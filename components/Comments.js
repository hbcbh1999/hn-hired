import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import Scroll from 'react-infinite-scroll-component';
import Done from '@material-ui/icons/Done';

import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  withStyles
} from '@material-ui/core';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    paddingLeft: 140,
    flexGrow: 1
  }
});

const scrollChunk = 10;

class Comments extends Component {
  state = {
    results: [],
    hasMore: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { comments } = nextProps;

    // Return null with default state for same results.
    if (comments === prevState.results) {
      return null;
    }

    // New results for combined search tokens. Resets scroll pagination
    return {
      results: comments.slice(0, scrollChunk),
      hasMore: comments.length !== 0
    };
  }

  /*
    Infinite scrolling throttles a large list render
  */
  next = () => {
    const { comments } = this.props;
    const start = this.state.results.length;
    const end = start + scrollChunk;
    const hasMore = comments.length >= end;
    const nextComments = comments.slice(start, end);

    this.setState({
      results: this.state.results.concat(nextComments),
      hasMore: hasMore
    });
  };

  render() {
    const { hasMore, results } = this.state;
    const { classes } = this.props;
    const resultsList = results.map(comment => (
      <Fragment key={uuidv4()}>
        <ListItem>
          <ListItemText>
            <Typography variant="body1">
              <span dangerouslySetInnerHTML={{ __html: comment.text }} />
            </Typography>
          </ListItemText>
        </ListItem>
        <Divider />
      </Fragment>
    ));

    return (
      <List classes={classes}>
        <Scroll
          dataLength={results.length}
          next={this.next}
          hasMore={hasMore}
          loader={<h4>Loading....</h4>}
          height={1280}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <Done />
            </p>
          }
        >
          {resultsList}
        </Scroll>
      </List>
    );
  }
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Comments);
