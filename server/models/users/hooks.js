Accounts.onCreateUser(function (options, user) {
	// Assign the proposed name
	if (options.profile) {
		user.profile = {
			name: options.profile.name,
		};
	}
	// If the user logged in with twitter, assign this optional properties
	if (user.services.twitter) {
		user.profile.screenName = user.services.twitter.screenName;
		user.profile.pictureUrl = user.services.twitter.profile_image_url_https;
	}
	// If the user logged in with google, assign this optional properties
	if (user.services.google) {
		user.profile.screenName = user.services.google.given_name;
		user.profile.pictureUrl = user.services.google.picture;
		user.emails = user.emails || [{
			address: user.services.google.email,
			verified: user.services.google.verified_email
		}];
	}
	// Insert a notification channel for the user
	NotificationChannels.insert({
		name: "user:" + user._id,
		permissions: {
			members: [user._id]
		}
	});
	// Register the user to that notification channel
	user.notificationChannelSubscriptions = [
		"user:" + user._id,
		"post:newPublic"
	];
	return user;
});
