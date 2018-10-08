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
const {Pool} = require("pg");
const {queries} = require("./data.js");
const str = require("../utils/string.js");
module.exports = {
  async getFirstRow(text, values) {
    const res = await this.pool.query(text, values);
    return res.rows[0];
  },
  async getGuild(id, cols = "*") {
    const result = await this.getFirstRow(
      str.format(queries.selectGuild, cols),
      [id]
    );
    if(result != null)
      return result;
    return this.upsert("guilds", "id", [id], cols);
  },
  async getMember(guildId, userId, cols = "*") {
    const result = await this.getFirstRow(
      str.format(queries.selectMember, cols),
      [guildId, userId]
    );
    if(result != null)
      return result;
    return this.upsert(
      "members",
      "guild_id, user_id",
      [guildId, userId],
      cols
    );
  },
  async getUser(id, cols = "*") {
    const result = await this.getFirstRow(
      str.format(queries.selectUser, cols),
      [id]
    );
    if(result != null)
      return result;
    return this.upsert("users", "id", [id], cols);
  },
  async getXproles(guildId) {
    const {rows} = await this.pool.query(
      queries.selectGuildXproles,
      [guildId]
    );
    return rows;
  },
  pool: new Pool(),
  async removeXprole(id) {
    const {rowCount} = await this.pool.query(
      str.format(queries.deleteXproles, "role_id = $1"),
      [id]
    );
    return rowCount !== 0;
  },
  stringifyQuery(count, offset = 2) {
    const len = count + offset;
    let values = `$${offset - 1}`;
    for(let i = offset; i < len; i++)
      values += `, $${i}`;
    return values;
  },
  async updateMember(guildId, userId, changed) {
    let count = 3;
    let cols = "";
    const vals = [guildId, userId];
    for(const col in changed) {
      if(!changed.hasOwnProperty(col))
        continue;
      if(cols.length !== 0)
        cols += ", ";
      cols += `${col} = $${count}`;
      vals.push(changed[col]);
      count++;
    }
    await this.pool.query(
      str.format(queries.updateMember, cols),
      vals
    );
  },
  async updateXprole(guildId, roleId, xp) {
    const {rows: roles} = await this.pool.query(
      queries.selectXproles,
      [guildId, xp, roleId]
    );
    if(roles.length !== 0) {
      await this.pool.query(str.format(
        queries.deleteXproles,
        roles.map(r => `role_id = '${r.roleId}'`).join(" OR ")
      ));
    }
    await this.pool.query(
      queries.insertXprole,
      [guildId, roleId, xp]
    );
  },
  async upsert(table, cols, vals, returns) {
    const valStr = this.stringifyQuery(vals.length - 1);
    const row = await this.getFirstRow(str.format(
      queries.insertDefault,
      table,
      cols,
      valStr,
      returns
    ), vals);
    if(row != null)
      return row;
    return this.getFirstRow(str.format(
      queries.selectDefault,
      returns,
      table,
      cols,
      valStr
    ), vals);
  }
};
