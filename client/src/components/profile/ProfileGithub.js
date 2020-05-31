import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class ProfileGithub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: "a257ec7da764f82b0387",
      clientSecret: "291568b17fda9026026b05fa9ad45c4d93bd8178",
      count: 5,
      sort: "created:asc",
      repos: [],
    };
  }
  componentDidMount() {
    const { username } = this.props;
    const { count, sort, clientId, clientSecret } = this.state;

    fetch(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (this.refs.myref) {
          this.setState({ repos: data });
        }
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { repos } = this.state;
    const repoItems = repos.map((repo) => (
      <div key={repo._id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <Link
                rel="noopener noreferrer"
                to={repo.html_url}
                className="text-info"
                target="_blank"
              >
                {repo.name}
              </Link>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success  mr-1">
              Forks: {repo.Forks_count}
            </span>
          </div>
        </div>
      </div>
    ));
    return (
      <div ref="myref">
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    );
  }
}
ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired,
};

export default ProfileGithub;
