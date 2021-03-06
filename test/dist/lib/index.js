"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var git_1 = require("./git");
var fs_extra_1 = require("fs-extra");
var writer_1 = require("./writer");
var path_1 = require("path");
var interface_1 = require("./interface");
var package_1 = require("./package");
var chalkDep = __importStar(require("chalk"));
var chalk = chalkDep.default.constructor({ enabled: true, level: 1 });
var defaultOptions = {
    repoUrl: '',
    repoType: interface_1.RepoType.git,
    file: 'CHANGELOG.md',
    projectName: 'No Project Name Found',
    version: '0.0.0',
};
var log = function (message) { return console.info("[changelog-generator] => " + message); };
function ensureDefaultOptions(options) {
    if (!options.file)
        options.file = defaultOptions.file;
    if (!options.repoUrl)
        options.repoUrl = defaultOptions.repoUrl;
    if (!options.repoType)
        options.repoType = defaultOptions.repoType;
    if (!options.version)
        options.version = defaultOptions.version;
    if (!options.projectName)
        options.projectName = defaultOptions.projectName;
}
function generate(options, commitsList) {
    if (options === void 0) { options = defaultOptions; }
    if (commitsList === void 0) { commitsList = null; }
    package_1.getOptionsFromPackage(options);
    ensureDefaultOptions(options);
    var commits = commitsList || git_1.gitAllCommits(options);
    if (commits && commits.length < 1) {
        log('found no commits to generate from');
        return;
    }
    var changelogPath = path_1.join(process.cwd(), options.file);
    var changelogDirectoryPath = path_1.dirname(changelogPath);
    if (!fs_extra_1.existsSync(changelogDirectoryPath)) {
        log("creating changelog directory at: '" + chalk.gray(changelogDirectoryPath) + "'");
        try {
            fs_extra_1.ensureDirSync(changelogDirectoryPath);
        }
        catch (error) {
            log(error);
        }
    }
    var md = writer_1.getMarkdown(options, commits);
    try {
        fs_extra_1.writeFileSync(changelogPath, md.trim());
    }
    catch (error) {
        log(error);
    }
    return Promise.resolve(changelogPath);
}
exports.default = generate;
//generate();
