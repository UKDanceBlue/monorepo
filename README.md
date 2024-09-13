<div id="top"></div>
<!--
<a href="https://expo.dev/%40university-of-kentucky-danceblue/danceblue-mobile?serviceType=classic&distribution=expo-dev-client&releaseChannel=preview&scheme=exp%2Bdanceblue-mobile">
<img src="https://qr.expo.dev/development-client?appScheme=exp%2Bdanceblue-mobile&url=https%3A%2F%2Fexp.host%2F%40university-of-kentucky-danceblue%2Fdanceblue-mobile%3Frelease-channel%3Dpreview" alt="Expo Preview QR Code" width="300" height="300">Expo Preview</a>
--!>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/UKDanceBlue/danceblue-react-app">
    <img src="https://danceblue.org/wp-content/uploads/2023/08/DB_Horizontal_Logo.png" alt="Logo">
  </a>

<h3 align="center">DanceBlue App Monorepo</h3>

Release:
[![Docker release build](https://github.com/UKDanceBlue/monorepo/actions/workflows/docker-build.yml/badge.svg?branch=release&event=push)](https://github.com/UKDanceBlue/monorepo/actions/workflows/docker-build.yml)
Main:
[![Docker main build](https://github.com/UKDanceBlue/monorepo/actions/workflows/docker-build.yml/badge.svg?branch=main&event=push)](https://github.com/UKDanceBlue/monorepo/actions/workflows/docker-build.yml)
[![Lint](https://github.com/UKDanceBlue/monorepo/actions/workflows/eslint.yml/badge.svg?branch=main&event=push)](https://github.com/UKDanceBlue/monorepo/actions/workflows/eslint.yml)

  <p align="center">
    DanceBlue's mobile app is a great way to interact with DanceBlue year round from the comfort of your phone
    <br />
    <a href="https://danceblue.org">Explore DanceBlue</a>
    <br />
    <br />
    <a href="https://donate.danceblue.org/">Donate</a>
    ·
    <a href="https://github.com/UKDanceBlue/app/issues">Report Bug</a>
    ·
    <a href="https://github.com/UKDanceBlue/app/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

DanceBlue is a University of Kentucky student-run organization that fundraises
year-round and culminates in a 24-hour no sitting, no sleeping dance marathon.
The money raised through DanceBlue is donated to the Golden Matrix Fund,
established to support the kids of the DanceBlue Kentucky Children’s Hospital
Hematology/Oncology Clinic both today and well into the future through an
endowment. DanceBlue funds also support the year-long fundraising engine and
operations that underpin the mission, as well as providing funds to support
research at the UK Markey Cancer Center. The Golden Matrix Fund was created to
benefit the DanceBlue KCH Hematology/Oncology Clinic patients and families.
Childhood cancer not only affects the child physically, but it also creates many
emotional and financial difficulties for the entire family. The goal of the
Golden Matrix Fund is to provide care and support for the kids through giving
them and their parent’s comfort.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Prisma](https://www.prisma.io/)
- [TypeGraphQL](https://typegraphql.com/)
- [Urql](https://commerce.nearform.com/open-source/urql/docs/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [TanStack](https://tanstack.com/)
- [yarn](https://yarnpkg.com/)
- [VS Code](https://code.visualstudio.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Getting up and running

1. Install either VSCode or a JetBrains IDE
2. Set up your IDE's dev container support, for VSCode this consists of
   [an extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Set up docker according to VSCode's
   [guide](https://code.visualstudio.com/docs/devcontainers/containers#_installation)
4. Reopen this repository in the dev container (note: on windows you should try
   and clone the repository into a folder in WSL or a docker volume for
   performance reasons)
5. Copy all `.env.example` files and remove the `.example` extension, then fill
   in the values

Alternatively you can set up your own Postgres database and then install the
repository like a normal Typescript monorepo, but I personally recommend using a
dev container

### Building

There are four packages in this repository: `mobile`, `portal`, `server`, and
`common`. There are a number of npm scripts configured for each, some of which
are available in the top level package.json as well, prefixed by the package
name. Broadly the build commands are `package:build` and `package:watch` for a
single build or automatic builds respectively. There are also a few repository
level scripts, for example testing and linting.

### Linting and Formatting

There are also a number of linting and type-checking scripts, the package
specific ones are `package:check`, however you will generally want to just run
the global command `repo:check`. This will check that the entire repository
passes ESLint, Prettier, and Typescript checks. To format the repository run
`repo:format:fix` and to fix linter issues run `repo:lint:fix`.

### Running the Applications

All scripts relevant to running the project have a corresponding entry in the
VSCode launch.json file. This means that in VSCode you can use the 'Run and
Debug' panel to start any target. Generally you can use on the 'Dev Environment:
...' run configurations, these configs will activate any watchers needed to
build the codebase and then start each relevant project. Alternatively you can
run each component individually from the cli (`package:dev` or `package:start`
depending on the tooling) or from the same 'Run and Debug' menu.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to
learn, inspire, and create. Any contributions you make are **greatly
appreciated**.

If you have a suggestion that would make this better, please fork the repo and
create a pull request. You can also simply open an issue with the tag
"enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

If you are interested in joining DanceBlue, send me a message (see my contact
info)!

### Some notes for contributors

- Naming convention for files is roughly:
  - PascalCase for files that represent a single entity (i.e. a type or
    component) unless it is a plain function
  - camelCase for files that represent a collection of entities (i.e. an index
    file, a collection of values, multiple unrelated exports) or a plain
    function
  - Folders that are intended to be imported directly should match the case of
    their subject (i.e. PascalCase for a folder with a component)
  - kebab-case for other folders
- ESlint has rules for most other cases, it is _highly_ recommended to install
  the eslint plugin for your editor or keep `eslint --watch` running in the
  background

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

App & Web Development Coordinator -
[app@danceblue.com](mailto:app@danceblue.com)

App & Web Design Coordinator -
[design@danceblue.com](mailto:design@danceblue.com)

Project Link:
[https://github.com/UKDanceBlue/monorepo](https://github.com/UKDanceBlue/monorepo)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Tag Howard](https://github.com/jthoward64) - App & Web Development
  Coordinator - DB22, DB23, DB24
- [Jackson Huse](https://github.com/jphuse) - App Design Coordinator - DB23,
  DB24
- [Skyler Trowel](https://github.com/smtrowel) - App Development Coordinator -
  DB25
- [Camille Dyer](https://github.com/cdyer8) - App Design Coordinator - DB25
- [Everyone on the DanceBlue committee](https://danceblue.org/about/our-committee/)

<p align="right">(<a href="#top">back to top</a>)</p>
