# Remaining Work

## Switch from decorator models to init models

## Redesign update routes

Having a single update route for each resource is rather complex typing-wise and
also not really a sustainable solution. It would be better to further split the
update routes into separate routes for each action we might want to take. This
also makes the API client make a bit more sense. Plus if we ever switch to
RPC-style communication, this design be more natural.

## Implement remaining routes

## Rethink the relationship between resources and models

Currently the resources and the relevant models are very close when it comes to
their structure. This is not necessarily a bad thing, but there are probably
more optimal ways to handle this and we currently have some code duplication
that could grow. Instead I want to move more model code into abstracted away
systems, additionally I don't want to work with resource classes on the server
except when we are actually dealing with complete resources. Right now we are
limiting our flexibility with sequelize by having resource instances be the
lingua franca on the server.

We'll need to figure out a good intermediate representation for models while
they are being worked on in the server. This intermediate representation should
be low-overhead when being converted between itself and a model instance, all
the validation should be done in the model or the resource. We will only use
resources on the server as a means for serializing for the client, and maybe for
create requests.

## Build a mini-framework for seeding/migrating the database

I don't really like how sequlize-cli handles seeding the database, especially
due to it's lack of typescript support. I think we can build a mini-framework
for seeding and migrating that will make it easier to write seed files and also
make it easier to maintain them in the long run.

https://github.com/sequelize/umzug

OR, if sequelize-cli updates to v7 in time, maybe we can use that.
