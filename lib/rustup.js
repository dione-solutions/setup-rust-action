"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const toolCache = __importStar(require("@actions/tool-cache"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const fs_1 = require("fs");
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
function install(version) {
    return __awaiter(this, void 0, void 0, function* () {
        if (os.platform() == 'darwin') {
            let toolPath = yield acquireRust(version);
            core.debug('Rust toolchain is cached under ' + toolPath);
            core.addPath(path.join(toolPath, 'bin'));
        }
    });
}
exports.install = install;
function acquireRust(version) {
    return __awaiter(this, void 0, void 0, function* () {
        let script;
        try {
            script = yield toolCache.downloadTool("https://sh.rustup.rs");
        }
        catch (error) {
            core.debug(error);
            throw `Failed to download rustup: ${error}`;
        }
        fs_1.chmodSync(script, '777');
        yield exec.exec(`"${script}"`, ['-y', '--default-toolchain', 'none']);
        let cargo = path.join(process.env['HOME'] || '', '.cargo');
        return yield toolCache.cacheDir(cargo, 'rust', version);
    });
}