import { CodegenConfig } from '@graphql-codegen/cli';

import { dirname, join, normalize } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: CodegenConfig = {
  schema: normalize(join(__dirname, '../server/schema.graphql')),
  documents: normalize(join(__dirname, '../client/src/**/*.graphql')),
  hooks: {
    onError: (e) => {
      console.error('Error generating GraphQL client: ', e);
    }
  },
  emitLegacyCommonJSImports: false,
  config: {
    useTypeImports: true,
    enumsAsConst: true,
    immutableTypes: true,
    useIndexSignature: true,
    enumValues: {
      // Comparator: './api/request/ListQueryTypes.js#Comparator',
      StringComparator: './api/request/ListQueryTypes.js#StringComparator',
      NumericComparator: './api/request/ListQueryTypes.js#NumericComparator',
      // IsComparator: './api/request/ListQueryTypes.js#IsComparator',
      SortDirection: './api/request/ListQueryTypes.js#SortDirection',
      TeamType: './api/graphql/object-types/Team.js#TeamType',
      AuthSource: './auth/index.js#AuthSource',
      // AccessLevel: './auth/index.js#AccessLevel',
      DbRole: './auth/index.js#DbRole',
      CommitteeRole: './auth/index.js#CommitteeRole',
    },
    mappers: {
      ConfigurationResource: './api/graphql/object-types/Configuration.js#ConfigurationResource',
      DeviceResource: './api/graphql/object-types/Device.js#DeviceResource',
      EventResource: './api/graphql/object-types/Event.js#EventResource',
      ImageResource: './api/graphql/object-types/Image.js#ImageResource',
      LoginFlowSessionResource: './api/graphql/object-types/LoginFlowSession.js#LoginFlowSessionResource',
      NotificationResource: './api/graphql/object-types/Notification.js#NotificationResource',
      PersonResource: './api/graphql/object-types/Person.js#PersonResource',
      PointEntryResource: './api/graphql/object-types/PointEntry.js#PointEntryResource',
      PointOpportunityResource: './api/graphql/object-types/PointOpportunity.js#PointOpportunityResource',
      Resource: './api/graphql/object-types/Resource.js#Resource',
      TeamResource: './api/graphql/object-types/Team.js#TeamResource',
      RoleResource: './api/graphql/object-types/Role.js#RoleResource',
    },
    showUnusedMappers: true,
    scalars: {
      DateTime: 'string',
      DateTimeISO: 'string',
      Duration: 'string',
      Interval: 'string',
      URL: 'string',
      Void: 'undefined',
    },
    strictScalars: true,
  },
  generates: {
    './lib/graphql-client/': {
      preset: 'client',
      // plugins: ['typescript','typescript-operations','typescript-resolvers'],
    }
  },
  ignoreNoDocuments: true,
};

export default config;
