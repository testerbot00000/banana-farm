CREATE TABLE guilds (
  id VARCHAR(20) PRIMARY KEY,
  delete_cmds BOOL NOT NULL DEFAULT false,
  disabled_cmds VARCHAR(16)[] NOT NULL DEFAULT '{}',
  prefix VARCHAR(5) NOT NULL DEFAULT '.',
  reset_every INT2 NOT NULL DEFAULT 0,
  reset_last TIMESTAMPTZ
);
CREATE TABLE members (
  guild_id VARCHAR(20) REFERENCES guilds(id),
  user_id VARCHAR(20) NOT NULL,
  xp_cd TIMESTAMPTZ NOT NULL DEFAULT now() - '45 seconds'::interval,
  xp_amount INT NOT NULL DEFAULT 0,
  xp_total INT NOT NULL DEFAULT 0,
  xp_mult REAL NOT NULL DEFAULT 1.0,
  PRIMARY KEY(guild_id, user_id)
);
CREATE TABLE xp_roles (
  guild_id VARCHAR(20) REFERENCES guilds(id),
  role_id VARCHAR(20) NOT NULL UNIQUE,
  unlocked_at INT NOT NULL,
  UNIQUE(guild_id, unlocked_at)
);
