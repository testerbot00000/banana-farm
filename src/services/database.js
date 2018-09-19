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
  async getGuild(id, columns = "*") {
    const result = await this.getFirstRow(
      `SELECT ${columns} FROM guilds WHERE id = $1`,
      [id]
    );
    if(result != null)
      return result;
    return this.upsert("guilds", "id", [id], columns);
  },
  pool: new Pool(),
  stringifyQuery(count) {
    const len = count + 2;
    let values = "$1";
    for(let i = 2; i < len; i++)
      values += `, $${i}`;
    return values;
  },
  async upsert(table, columns, values, returns) {
    const valStr = this.stringifyQuery(values.length - 1);
    const selectStr = str.format(
      queries.selectDefault,
      returns,
      table,
      columns,
      valStr
    );
    let row = await this.getFirstRow(selectStr, values);
    if(row == null) {
      row = await this.getFirstRow(str.format(
        queries.insertDefault,
        table,
        columns,
        valStr,
        returns
      ), values);
    }
    if(row == null)
      row = await this.getFirstRow(selectStr, values);
    return row;
  }
};
