// @ts-check

/** @type {import('@yarnpkg/types')} */
// @ts-expect-error - Weird issue with cjs
const { defineConfig, Yarn } = require(`@yarnpkg/types`);

/**
 * This rule will enforce that a workspace MUST depend on the same version of
 * a dependency as the one used by the other workspaces.
 *
 * @param {import('@yarnpkg/types').Yarn.Constraints.Context} context
 */
const enforceConsistentDependenciesAcrossTheProject = ({ Yarn }) => {
  for (const dependency of Yarn.dependencies()) {
    if (dependency.type === `peerDependencies`) continue;

    for (const otherDependency of Yarn.dependencies({
      ident: dependency.ident,
    })) {
      if (otherDependency.type === `peerDependencies`) continue;

      dependency.update(otherDependency.range);
    }
  }
};

const packageInfo = {
  private: true,
  repository: {
    type: "git",
    url: "https://github.com/UKDanceBlue/monorepo.git",
  },
  license: "MPL-2.0",
  author: {
    name: "University of Kentucky DanceBlue Tech Committee",
    email: "app@danceblue.org",
    url: "https://danceblue.org",
  },
};

/**
 * @param {import('@yarnpkg/types').Yarn.Constraints.Context} context
 */
const enforcePackageInfo = ({ Yarn }) => {
  for (const w of Yarn.workspaces()) {
    w.set(`license`, packageInfo.license);
    w.set("private", packageInfo.private);
    w.set(["repository", "type"], packageInfo.repository.type);
    w.set(["repository", "url"], packageInfo.repository.url);
    w.set(["author", "name"], packageInfo.author.name);
    w.set(["author", "email"], packageInfo.author.email);
    w.set(["author", "url"], packageInfo.author.url);
  }
};

module.exports = defineConfig({
  constraints: (ctx) => {
    enforceConsistentDependenciesAcrossTheProject(ctx);
    enforcePackageInfo(ctx);
    return Promise.resolve();
  },
});
