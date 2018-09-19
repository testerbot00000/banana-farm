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
const fs = require("fs");
const path = require("path");
const util = require("util");
const yml = require("js-yaml");
const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
module.exports = {
  async load() {
    const dir = path.join(__dirname, "../data");
    const files = await readDir(dir);
    for(let i = 0; i < files.length; i++) {
      const file = await readFile(path.join(dir, files[i]), "utf8");
      this[files[i].slice(0, -4)] = yml.load(file);
    }
    delete this.load;
  }
};
