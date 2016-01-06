
 /**
  * SecurityAuthorizationCommon is a 'service container'.
  * It performs some "global" tasks for the authorization layer.
  * It centralizes the way objects are constructed.
  *
  * @summary Super-constructor for SecurityAuthorizationClient/Server.
  * @class SecurityAuthorizationCommon
  */
SecurityAuthorizationCommon = class SecurityAuthorizationCommon {
  constructor() {

    this._strategy = null;
    this._voters = [];
    this._authenticatedUser = null;

    // By default, a RoleVoter is added.
    this.addRoleVoter();
  }

  // Set the strategy used by the access decision manager
  setStrategy(strategy) {
    this._strategy = strategy;
  }

  // Add a voter used by the access decision manager
  addVoter(voter) {
    this._voters.push(voter);
  }

  // Remove voter used by the access decision manager
  removeVoter(voter) {
    this._voters = this._voters.filter(function (obj) {
      return obj !== voter;
    });
  }

  addRoleVoter() {
    this._voters.push(new RoleVoter());
  }

  // Remove all voters used by the access decision manager
  removeAllVoters() {
    this._voters = [];
  }


  /**
  * Checks if the attributes are granted against the current authenticated user
  * and optionally supplied object. It delegates the request to the
  * authorizationChecker.
  *
  * @param {mixed}    attributes
  * @param {mixed}    object
  *
  * @throws no-user-found-exception
  *
  * @return {Boolean}
  */
  isGranted(attributes, object = null) {
    
    var accessDecisionManager = null;
    if (this._strategy !== null) {
      accessDecisionManager = new AccessDecisionManager(this._voters,
                                                        this._strategy);
    } else {
      accessDecisionManager = new AccessDecisionManager(this._voters);
    }

    var authorizationChecker =
      new AuthorizationChecker(accessDecisionManager, this._authenticatedUser);

    return authorizationChecker.isGranted(attributes, object);
  }

  /**
  * Set the authenticated user.
  *
  * @param {Object}  user
  *
  * @throws invalid-argument-exception
  */
  setAuthenticatedUser(user) {
    if (typeof user === 'undefined') {
      throw new Meteor.Error(
        'invalid-argument-exception',
        'The user cannot be undefined.');
    }

    this._authenticatedUser = user;
  }

};
