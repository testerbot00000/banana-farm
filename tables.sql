CREATE TABLE guilds (
  id VARCHAR(20) PRIMARY KEY,
  delete_cmds BOOL NOT NULL DEFAULT false,
  disabled_cmds VARCHAR(16)[] NOT NULL DEFAULT '{}',
  prefix VARCHAR(5) NOT NULL DEFAULT '.',
  reset_every INT2 NOT NULL DEFAULT 0,
  reset_last TIMESTAMP
);
CREATE TABLE xp_roles (
  guild_id VARCHAR(20) REFERENCES guilds(id),
  role_id VARCHAR(20) NOT NULL UNIQUE,
  unlocked_at INT2 NOT NULL,
  UNIQUE(guild_id, unlocked_at)
);
CREATE TABLE xp (
  guild_id VARCHAR(20) REFERENCES guilds(id),
  user_id VARCHAR(20) NOT NULL,
  cooldown TIMESTAMP NOT NULL DEFAULT now(),
  amount INT NOT NULL DEFAULT 0,
  total INT NOT NULL DEFAULT 0,
  mult REAL NOT NULL DEFAULT 1.0
);
