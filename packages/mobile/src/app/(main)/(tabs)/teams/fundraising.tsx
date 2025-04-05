import { DateTime } from "luxon";
import {
  ActivityIndicator,
  SectionList,
  type SectionListData,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { useQuery } from "urql";

import { graphql } from "~/api";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { H2, H3, P } from "~/components/ui/typography";

const FundraisingDocument = graphql(/* GraphQL */ `
  query FundraisingQuery {
    me {
      fundraisingTotalAmount
      fundraisingAssignments {
        id
        amount
        entry {
          donatedOn
          amount
          notes
          donatedByText
          donatedToText
          solicitationCode {
            name
            text
          }
        }
      }
    }
  }
`);

interface AssignmentListItem {
  id: string;
  amount: number;
  donatedOn?: DateTime;
  donatedBy?: string;
}

export default function Fundraising() {
  const [{ data, fetching, error }, refresh] = useQuery({
    query: FundraisingDocument,
  });

  if (error) {
    return <Text className="color-danger">{error.message}</Text>;
  }

  if (fetching) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const sectionData = data?.me?.fundraisingAssignments?.reduce<
    Partial<Record<string, AssignmentListItem[]>>
  >((sections, { amount, entry, id }) => {
    const solicitationCodeName =
      entry.solicitationCode.name ?? entry.solicitationCode.text;

    const assignment: AssignmentListItem = {
      id,
      amount,
      donatedOn: entry.donatedOn
        ? DateTime.fromISO(entry.donatedOn)
        : undefined,
      donatedBy: entry.donatedByText ?? undefined,
    };

    if (sections[solicitationCodeName]) {
      sections[solicitationCodeName].push(assignment);
    } else {
      sections[solicitationCodeName] = [assignment];
    }

    return sections;
  }, {});

  const sections = Object.entries(sectionData ?? {}).map(
    ([solicitationCodeName, data]): SectionListData<
      AssignmentListItem,
      { title: string }
    > => ({
      data: (data ?? []).sort(
        (a, b) =>
          (b.donatedOn?.toMillis() ?? 0) - (a.donatedOn?.toMillis() ?? 0)
      ),
      title: solicitationCodeName,
    })
  );

  return (
    <View className="flex flex-1 px-4">
      <H2 className="text-center">Your Fundraising</H2>
      <SectionList
        className="flex flex-1"
        refreshControl={
          <RefreshControl onRefresh={refresh} refreshing={fetching} />
        }
        onRefresh={refresh}
        refreshing={fetching}
        ListEmptyComponent={
          <P className="text-center mx-4 color-destructive mt-4">
            Your team captain has not assigned any donations to you. This does
            not mean you have not received any donations, just that your team
            has not assigned them to you.
          </P>
        }
        sections={sections}
        keyExtractor={({ id }) => id}
        renderItem={(data) => {
          let str = `$${data.item.amount.toFixed(2)}`;
          if (data.item.donatedBy) {
            str += ` from ${data.item.donatedBy}`;
          }
          return (
            <View>
              <Text>{str}</Text>
              {data.item.donatedOn && (
                <Text className="text-right">
                  {data.item.donatedOn.toLocaleString(DateTime.DATE_SHORT)}
                </Text>
              )}
            </View>
          );
        }}
        renderSectionHeader={(data) => {
          if (sections.length < 2) {
            return null;
          }
          return <H3 className="text-center text-xl">{data.section.title}</H3>;
        }}
        ItemSeparatorComponent={() => <Separator orientation="horizontal" />}
      />
    </View>
  );
}
