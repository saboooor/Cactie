// import modules.
const url = require('url');
const ejs = require('ejs');
const path = require('path');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const Djs = require('discord.js');
const Strategy = require('passport-discord').Strategy;
const checkPerms = require('../../functions/checkPerms');

// Load the config
const { readFileSync } = require('fs');
const YAML = require('yaml');
const { dashboard } = YAML.parse(readFileSync('./config.yml', 'utf8'));

// instantiate express app and the session store.
const app = express();
const MemoryStore = require('memorystore')(session);

// export the dashboard as a function which we call in ready event.
module.exports = async client => {
	// declare absolute paths.
	const dataDir = path.join(process.cwd(), 'dashboard');
	const templateDir = path.join(dataDir, 'templates');

	// Deserializing and serializing users without any additional logic.
	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((obj, done) => done(null, obj));

	// Validating the url by creating a new instance of an Url then assign an object with the host and protocol properties.
	// If a custom domain is used, we take the protocol, then the hostname and then we add the callback route.
	// Ex: Config key: https://localhost/ will have - hostname: localhost, protocol: http

	let domain;

	try {
		const domainUrl = new URL(dashboard.domain);
		domain = {
			host: domainUrl.hostname,
			protocol: domainUrl.protocol,
		};
	}
	catch (e) {
		logger.error(e);
		throw new TypeError('Invalid domain specified in config.yml');
	}

	if (dashboard.usingCustomDomain) client.dashboardDomain = `${domain.protocol}//${domain.host}`;
	else client.dashboardDomain = `${domain.protocol}//${domain.host}${dashboard.port == 80 ? '' : `:${dashboard.port}`}`;

	// set the passport to use a new discord strategy, we pass in client id, secret, callback url and the scopes.
	/** Scopes:
	 *  - Identify: Avatar's url, username and discriminator.
	 *  - Guilds: A list of partial guilds.
	 */
	passport.use(
		new Strategy(
			{
				clientID: client.user.id,
				clientSecret: dashboard.clientSecret,
				callbackURL: `${client.dashboardDomain}/callback`,
				scope: ['identify', 'guilds'],
			},
			(accessToken, refreshToken, profile, done) => {
				// On login we pass in profile with no logic.
				process.nextTick(() => done(null, profile));
			},
		),
	);

	// initialize the memorystore middleware with the express app.
	app.use(session({
		store: new MemoryStore({ checkPeriod: 86400000 }),
		secret: dashboard.secret,
		resave: false,
		saveUninitialized: false,
	}));

	// initialize passport middleware.
	app.use(passport.initialize());
	app.use(passport.session());

	// bind the domain.
	app.locals.domain = dashboard.domain.split('//')[1];

	// set out templating engine.
	app.engine('ejs', ejs.renderFile);
	app.set('view engine', 'ejs');

	// initialize body-parser middleware to be able to read forms.
	app.use(bodyParser.json());
	app.use(
		bodyParser.urlencoded({
			extended: true,
		}),
	);

	// host all of the files in the assets using their name in the root address.
	app.use('/', express.static(path.join(dataDir, 'static'), {
		extensions: ['html'],
	}));

	// declare a renderTemplate function to make rendering of a template in a route as easy as possible.
	const renderTemplate = (res, req, template, data = {}) => {
		// Default base data which passed to the ejs template by default.
		const baseData = {
			colors: dashboard.colors,
			bot: client,
			path: req.path,
			user: req.isAuthenticated() ? req.user : null,
			Djs,
		};
		// render template using the absolute path of the template and the merged default data with the additional data provided.
		res.render(
			path.join(templateDir, template),
			Object.assign(baseData, data),
		);
	};

	// declare a checkAuth function middleware to check if an user is logged in or not, and if not redirect them.
	const checkAuth = (req, res, next) => {
		// If authenticated we forward the request further in the route.
		if (req.isAuthenticated()) return next();
		// If not authenticated, we set the url the user is redirected to into the memory.
		req.session.backURL = req.url;
		// redirect user to login endpoint/route.
		res.redirect('/login');
	};

	// Login endpoint.
	app.get('/login', (req, res, next) => {
		// determine the returning url.
		if (req.headers.referer) {
			const parsed = url.parse(req.headers.referer);
			if (parsed.hostname === app.locals.domain) {
				req.session.backURL = parsed.path;
			}
		}
		else {
			req.session.backURL = '/';
		}
		// Forward the request to the passport middleware.
		next();
	}, passport.authenticate('discord'));

	// Callback endpoint.
	app.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => {
		// log when a user logs in
		logger.info(`User logged in: ${req.user.username}#${req.user.discriminator}`);
		// If user had set a returning url, we redirect them there, otherwise we redirect them to index.
		res.redirect(req.session.backURL ?? '/');
	});

	// Logout endpoint.
	app.get('/logout', function(req, res) {
		// destroy the session.
		req.session.destroy(() => {
			// logout the user.
			req.logout(() => {
				// redirect user to index.
				res.redirect('/');
			});
		});
	});

	// Index endpoint.
	app.get('/', (req, res) => renderTemplate(res, req, 'index.ejs'));

	app.get('/tos', (req, res) => renderTemplate(res, req, 'terms.ejs'));

	// Invite
	app.get('/invite', (req, res) => renderTemplate(res, req, 'invite.ejs'));
	app.get('/invite/:type', (req, res) => renderTemplate(res, req, `invite/${req.params.type}.ejs`));

	// Dashboard endpoint.
	app.get('/dashboard', checkAuth, (req, res) => renderTemplate(res, req, 'dashboard.ejs'));

	app.get('/music', checkAuth, (req, res) => renderTemplate(res, req, 'music.ejs', { wsurl: dashboard.wsurl }));

	// Get emojis
	app.get('/emojis/:guildId', async (req, res) => {
		const guild = client.guilds.cache.get(req.params.guildId);
		if (!guild) return res.json([]);
		const emojis = await guild.emojis.fetch();
		const customEmoji = emojis.map(e => { return { name: e.id, shortcodes: [e.name], url: `https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? 'gif' : 'png'}` }; });
		res.json([ ...customEmoji ]);
	});

	// General endpoint.
	app.get('/dashboard/:guildId', checkAuth, async (req, res) => {
		// validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
		const guild = client.guilds.cache.get(req.params.guildId);
		if (!guild) return res.redirect('/dashboard?alert=This server couldn\'t be found!');
		const member = await guild.members.fetch(req.user.id).catch(() => { return null; });
		if (!member || !member.permissions.has(Djs.PermissionsBitField.Flags.ManageGuild)) return res.redirect('/dashboard?alert=You don\'t have the permission to change this server\'s settings!');

		// retrive the settings stored for this guild and load the page
		const settings = await client.getData('settings', { guildId: guild.id });
		const memberdata = await client.query(`SELECT * FROM memberdata WHERE guildId = '${guild.id}'`);
		const reactionroles = {
			raw: await client.query(`SELECT * FROM reactionroles WHERE guildId = '${guild.id}'`),
			channels: [],
		};
		for (const i in reactionroles.raw) {
			if (reactionroles.channels.find(c => c.id == reactionroles.raw[i].channelId)) continue;
			const channelInfo = {
				id: reactionroles.raw[i].channelId,
				messages: [],
			};
			const channelreactionroles = reactionroles.raw.filter(r => r.channelId == reactionroles.raw[i].channelId);
			for (const i2 in channelreactionroles) {
				if (channelInfo.messages.includes(channelreactionroles[i2].messageId)) continue;
				channelInfo.messages.push(channelreactionroles[i2].messageId);
			}
			reactionroles.channels.push(channelInfo);
		}
		renderTemplate(res, req, 'settings.ejs', { guild, settings, reactionroles, memberdata });
	});

	// General endpoint.
	app.post('/dashboard/:guildId', checkAuth, async (req, res) => {
		// Get the guild from the guildId in the URL and check if it exists
		const guild = client.guilds.cache.get(req.params.guildId);
		if (!guild) return res.redirect('/dashboard?alert=This server couldn\'t be found!');

		// Get the member by the userId and check if permission is set
		const member = guild.members.cache.get(req.user.id);
		if (!member || !member.permissions.has(Djs.PermissionsBitField.Flags.ManageGuild)) return res.redirect('/dashboard?alert=You don\'t have the permission to change this server\'s settings!');

		// Get the current settings
		const settings = await client.getData('settings', { guildId: guild.id });
		const reactionroles = await client.query(`SELECT * FROM reactionroles WHERE guildId = '${guild.id}'`);

		if (req.body.reactionroles) {
			const query = req.body.reactionroles.split('_');
			if (query[0] == 'delete') {
				const id = query[1];
				const rr = reactionroles[id];
				if (!rr || !rr.messageId || !rr.emojiId) return res.redirect(`/dashboard/${guild.id}?alert=That's not a valid reaction role!#reactionroles`);
				await client.delData('reactionroles', { messageId: rr.messageId, emojiId: rr.emojiId, roleId: rr.roleId });
				logger.info(`Deleted Reaction role: #${id} ${rr.messageId} / ${rr.emojiId}`);
				res.redirect(`/dashboard/${guild.id}?alert=Reaction role deleted successfully!#reactionroles`);
			}
			else if (query[0] == 'create') {
				// Get the channel from the channel id in the url and check if it exists
				const channel = await guild.channels.fetch(req.body.channel);
				if (!channel) return res.redirect(`/dashboard/${guild.id}?alert=That channel doesn't exist!#reactionroles`);

				// Check if the bot has sufficient permissions in the channel
				const permCheck = checkPerms(['ViewChannel', 'SendMessages', 'AddReactions', 'ReadMessageHistory'], guild.members.me, channel);
				if (permCheck) return res.redirect(`/dashboard/${guild.id}?alert=${permCheck}#reactionroles`);

				// Check if the message exist
				const fetchedMsg = await channel.messages.fetch(req.body.message).catch(() => { return null; });
				if (!fetchedMsg) return res.redirect(`/dashboard/${guild.id}?alert=The Message Id is invalid!#reactionroles`);

				// Attempt to add the reaction to the message
				const reaction = await fetchedMsg.react(req.body.emoji).catch((err) => {
					res.redirect(`/dashboard/${guild.id}?alert=Unable to react to the message! Does ${client.user.username} have access to the message? / ${err}#reactionroles`);
					return null;
				});
				if (!reaction) return;

				logger.info(`Created Reaction role: ${JSON.stringify(req.body)}`);
				await client.createData('reactionroles', { guildId: guild.id, channelId: req.body.channel, messageId: req.body.message, emojiId: req.body.emoji, roleId: req.body.role, type: req.body.type, silent: req.body.silent == 'on' });
				res.redirect(`/dashboard/${guild.id}?alert=Reaction role added successfully!#${req.body.channel}`);
			}
			else if (query[0] == 'edit') {
				// Get the channel from the channel id in the url and check if it exists
				const channel = await guild.channels.fetch(req.body.channel);
				if (!channel) return res.redirect(`/dashboard/${guild.id}?alert=That channel doesn't exist!#reactionroles`);

				// Check if the bot has sufficient permissions in the channel
				const permCheck = checkPerms(['ViewChannel', 'SendMessages', 'AddReactions', 'ReadMessageHistory'], guild.members.me, channel);
				if (permCheck) return res.redirect(`/dashboard/${guild.id}?alert=${permCheck}#reactionroles`);

				// Check if the message exist
				const fetchedMsg = await channel.messages.fetch(req.body.message).catch(() => { return null; });
				if (!fetchedMsg) return res.redirect(`/dashboard/${guild.id}?alert=The Message Id is invalid!#reactionroles`);

				logger.info(`Edited Reaction role: ${JSON.stringify(req.body)}`);
				await client.setData('reactionroles', { guildId: guild.id, channelId: req.body.channel, messageId: req.body.message, emojiId: req.body.emoji }, { roleId: req.body.role, type: req.body.type, silent: req.body.silent == 'on' });
				res.redirect(`/dashboard/${guild.id}?alert=Reaction role edited successfully!#${req.body.channel}`);
			}
		}
		else {
			// Set false for checkboxes
			const checkboxes = ['reactions', 'suggestthreads'];
			checkboxes.forEach(checkbox => { if (!req.body[checkbox]) req.body[checkbox] = 'false'; });

			// Iterate through the form body's keys
			for (const key in req.body) {
				// Get the value of the key and convert arrays into strings with commas
				let value = req.body[key] == '' ? 'false' : req.body[key];
				if (value == 'on') value = 'true';
				if (Array.isArray(value)) value = value.join(',');

				// Check if the value is unchanged
				if (settings[key] == value) continue;

				// Log and set the data
				logger.info(`${key}: ${value}`);
				await client.setData('settings', { guildId: guild.id }, { [key]: value });
			}
			res.redirect(`/dashboard/${guild.id}?alert=Settings have been saved successfully!`);
		}
	});

	app.listen(dashboard.port, null, null, () => {
		const timer = (Date.now() - client.startTimestamp) / 1000;
		logger.info(`Dashboard running on port ${dashboard.port}. (${client.dashboardDomain}) (${timer}s)`);
	});
};