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
const client = require("../../services/client.js");
const {Command, Context} = require("patron.js");
const message = require("../../services/message.js");
const {options, responses} = require("../../services/data.js");
const str = require("../../utils/string.js");
const time = require("../../utils/time.js");
module.exports = new class Ping extends Command {
  constructor() {
    super({
      ...options.command,
      description: "Provides the current delay between me and discord.",
      groupName: "info",
      names: ["ping", "pg"],
      usableContexts: [Context.DM, Context.Guild]
    });
  }
  async run(msg) {
    const now = Date.now();
    const reply = await message.create(
      msg.channel,
      time.format(now - msg.timestamp, 1),
      "neutral"
    );
    if(reply == null)
      return;
    let {latency} = client.shards.get(0);
    if(msg.channel.type === 0)
      ({latency} = msg.channel.guild.shard);
    await message.edit(reply, str.format(
      responses.ping,
      time.format(latency, 1),
      reply.embeds[0].description,
      time.format(reply.timestamp - msg.timestamp, 1)
    ));
  }
}();
