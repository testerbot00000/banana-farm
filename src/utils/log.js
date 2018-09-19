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
const {formatNow} = require("./time.js");
module.exports = {
  error(...data) {
    console.error(formatNow(), "\x1b[31m[ERROR]\x1b[0m", ...data);
  },
  info(...data) {
    console.info(formatNow(), "\x1b[32m[INFO]\x1b[0m", ...data);
  },
  warn(...data) {
    console.warn(formatNow(), "\x1b[33m[WARN]\x1b[0m", ...data);
  }
};
