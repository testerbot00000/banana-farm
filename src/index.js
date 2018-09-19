/**
 * Banana Farm - A Discord bot made for SJBC.
 * Copyright (c) 2018 ElJay#7711
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";
process.env.TZ = "America/Phoenix";
const data = require("./services/data.js");
const path = require("path");
const {RequireAll} = require("patron.js");
let log;
process.on("uncaughtException", e => {
  log.error(e);
  process.exit(1);
});
process.on("unhandledRejection", reason => {
  log.warn(reason);
  process.exit(1);
});
function requireAll(dir) {
  return RequireAll(path.join(__dirname, dir));
}
(async function() {
  await data.load();
  log = require("./utils/log.js");
  const client = require("./services/client.js");
  const registry = require("./services/registry.js");
  registry
    .registerArgumentPreconditions(await requireAll("./preconditions/arg"))
    .registerPreconditions(await requireAll("./preconditions/cmd"))
    .registerTypeReaders(await requireAll("./readers"))
    .registerGroups(await requireAll("./groups"))
    .registerCommands(await requireAll("./cmds"));
  await requireAll("./events");
  await client.connect();
})().catch(e => {
  if(log == null)
    console.error(e);
  else
    log.error(e);
});
