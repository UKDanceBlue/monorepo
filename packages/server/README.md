# DanceBlue Server

# API

## Simple API

### Auth Endpoints

#### `GET /api/auth/logout`

Simple route that clears the login cookie.

#### `POST /api/auth/oidc-callback`

Handles the OIDC callback from the OIDC provider. This route will set the login
cookie and redirect the user to whatever url was included in the login flow
session.

#### `GET /api/auth/login`

Starts the OIDC login flow. This route will redirect the user to the LinkBlue
login page and create a login flow session in the database.

#### `GET /api/auth/anonymous`

Mints a JWT for an anonymous user and redirects.

#### `GET /api/auth/demo`

Mints a JWT for a demo user and redirects (used by demo login).

### Event Endpoints

#### `GET /api/events/upcoming`

Returns a simple JSON list of upcoming events for use on the DanceBlue website.
The format is documented in the `upcomingEvents.ts` file.

### File Endpoints

#### `GET /api/file/download/:uuid`

Downloads a file stored on disk by its database UUID.

#### `POST /api/upload/image/:uuid`

Uploads an image file to the server, creating a new file record in the database
and storing the file on disk. That file is then linked to the image specified by
the UUID in the URL.

### Health check

#### `GET /api/healthcheck`

Returns a 200 status code and the message 'OK' if the server is healthy.
Otherwise, 500 status code and a plain text error message.

## GraphQL API

Much of the GraphQL API is documented in the schema itself. The schema is
located at the root of the repo in a file called `schema.graphql`. This file is
automatically generated when starting the server by `type-graphql` and is based
on the resolvers in `src/resolvers`.

This folder contains a number of classes corresponding to the object types
defined `@ukdanceblue/common` package. These classes are used to define the
resolvers for the GraphQL API. Each method is decorated with `@Query`,
`@Mutation`, or `@FieldResolver` to define the type of operation it performs. An
`@Query` method is a top-level query that can be executed by the client. And
should return a value of the type defined in the method signature. An
`@Mutation` method is a top-level mutation that should have some effect.
Finally, an `@FieldResolver` method is a method that is called when a field is
requested on an object. It is used when just including the data in the base
object would be wasteful or complicated.

# Authorization

The GraphQL API is protected by an authorization middleware that checks for a
JWT in either a header or as a cookie. This JWT includes two things, the source
of the authentication (anonymous, demo, linkblue) and (if one exists) the user's
ID. This ID is used to lookup the user in the database and attach it to the
context object for the resolvers to use.

```ts
export interface AuthorizationContext {
  authenticatedUser: PersonNode | null;
  teamMemberships: SimpleTeamMembership[];
  userData: UserData;
  authorization: Authorization;
}
```

When accessing the GraphQL API, a middleware defined in
`src/resolvers/context.ts` will check for the JWT and attach the user to the
context object. This object contains four main fields: `authenticatedUser`,
`teamMemberships`, `userData`, and `authorization`. The `authenticatedUser`
field is the user object from the database, if one exists. The `teamMemberships`
field is a list of team memberships for the user, including the team type and
ID, as well as the user's position on the team. The `userData` field is the raw
data from the JWT. Finally, the `authorization` field is a derived object that
contains the user's permissions based on their role and team memberships. The
two fields in the `authorization` object that are commonly used are `committees`
and `accessLevel`. The `committees` field is a list of committee
identifier/committee role pairs, which represent the committees the user is a
member of and their role on that committee. The `accessLevel` field is a numeric
enum that represents the user's access level.

```ts
export const AccessLevel = {
  None: -1,
  Public: 0,
  UKY: 1,
  Committee: 3,
  CommitteeChairOrCoordinator: 3.5,
  Admin: 4,
  SuperAdmin: 5,
} as const;
```

The `AccessLevel` enum is used as a simple way to represent the user's
authorization on the server. The `None` level is used for unauthenticated users,
or when authorization fails. The `Public` level is used for users who are logged
in anonymously or not with a LinkBlue account. The `UKY` level is used for users
who are logged in with their University account. The `Committee` level is used
for users who are members of a committee, but not a chair or coord. The
`CommitteeChairOrCoordinator` level is used for users who are chairs or
coordinators of a committee. The `Admin` level is used for users who are on the
tech committee, and the `SuperAdmin` level is used for the tech chair.

The super admin level is special because it will short-circuit the authorization
middleware and allow the user to access any part of the API. This has the
drawback of meaning that the super admin cannot properly test the authorization
logic. To combat this, the super admin can masquerade as any other user by
setting the proper header in their request. This will allow them to test the
authorization logic as if they were another user.

# Database

The database is a PostgreSQL database that is accessed using Prisma. Prisma is
an ORM that generates types and queries based on the schema defined in the
`prisma/schema.prisma` file. This file is used to define the tables and
relationships in the database. Some SQL is needed to define migration files, but
when using the database at runtime in TypeScript, the Prisma client is used to
abstract away the SQL. All database queries are generally managed by the table's
respective repository class. These classes mostly follow a similar structure
with methods for creating, updating, deleting, and querying the table, as well
as some use-case specific methods.

# Coding Conventions

## Error Handling

The codebase is split between three types of error handling. The oldest parts of
the server use basic JavaScript error handling with try/catch blocks which can
cause some issues with good error messages. Some of the newer parts use the
DetailedError class which is a custom error class that includes some extra
information about the error. Unfortunately, this turned out not to work as well
as expected, so the newest parts of the codebase switched away from try/catch
entirely and use the `Result` type instead. The `Result` type comes from the
`ts-results-es` package and is a union that can be either `Ok` or `Err`. This
means that code using Result never throws, and instead returns a Result object
that can be checked for success or failure. This is a much more explicit way of
handling errors and allows for better error messages and handling. There is also
a `ResultAsync` type that can be used with async functions and promises to
handle errors in the same way.

In addition to the Result type, the codebase also uses the `Option` type from
the same package. This type is a union that can be either `Some` or `None` and
is used to represent nullable values. This is used in places where a value might
not always be present, but it is not an error if it is not.

The resolvers in the codebase have a middleware that allows returning a Result
or Option object from a resolver. Specifically, the resolver can return any of
the following (assuming the return type is `T`):

- `Result<T, unknown>`
- `Result<Option<T>, unknown>`
- `Option<T>`
- `T`

To help with error handling, the `@ukdanceblue/common` package includes the
`ConcreteError` class. This class is NOT a subclass of Error, but instead is an
abstract class that is subclasses by a number of concrete error classes. These
classes are used to represent specific errors should be returned as part of a
`Result` type. The `ConcreteError` class includes facilities for formatting as
an Apollo-friendly error object, meaning they will give a good error message to
the client.

## Dependency Injection

The server uses a simple dependency injection library called `typedi`
(specifically a fork of `typedi` called `@freshgum/typedi`). This library allows
for the easy injection of services into classes and functions. The concept is
somewhat complicated at first glance, but helps simplify some of the cognitive
load of managing the relationships between all the files in the server. The
basic idea of dependency injection is that instead of just importing a function
or class into every file that needs it, you instead define a service that
provides that function or class and then inject that service into other services
that need it. This allows for better separation of concerns and makes it easier
to test services in isolation. For examples, see the resolvers and repositories
in the server.

# Environment Variables

The server uses a number of environment variables to configure its behavior. All
of these are read and managed by the `environment.ts` file in the root of the
server. This file reads the environment variables from the `.env` file and the
OS environment and provides them to the rest of the server. There is an example
`.env` file in the root of the server that can be used as a template for your
configuration. Many of the required environment variables are automatically set
when working in a dev container, but some may need to be set manually (namely
secrets). When running the server in production, the `.env` file should not be
used, instead, the environment variables should be set either through docker
secrets or the docker-compose file.

# Logging

The server uses the `winston` logging library to log messages to the console and
to a file. There are three loggers defined in the `lib/logging` folder. The
`logger.ts` file defines the main logger that is used throughout the server. The
`sqlLogging.ts` file defines a logger that is used to log SQL queries from the
Prisma client. The `auditLogger.ts` file defines a logger that is used to log
sensitive actions in the server.

Generally the main logger is the only one that is used, but the audit logger
should be used when a potentially dangerous action is taken (such as deleting a
user). The SQL logger is used to log SQL queries from the Prisma client and is
not used directly in the codebase, nor is it enabled in production.
