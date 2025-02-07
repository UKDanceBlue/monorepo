import { createFileRoute, useParams } from "@tanstack/react-router";
import { stringifyDDNBatchType } from "@ukdanceblue/common";
import { Descriptions } from "antd";

import { LoadingRibbon } from "#elements/components/design/RibbonSpinner";
import { graphql, readFragment } from "#gql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";
import { useQuery } from "#hooks/useTypedRefine.ts";

export const Route = createFileRoute("/fundraising/ddn/$ddnId/")({
  component: RouteComponent,
});

const ViewDdnFragment = graphql(/* GraphQL */ `
  fragment ViewDdnFragment on DailyDepartmentNotificationNode {
    accountName
    accountNumber
    advFeeAmtPhil
    advFeeAmtUnit
    advFeeCcPhil
    advFeeCcUnit
    advFeeStatus
    batch {
      id
      batchNumber
      batchType
    }
    behalfHonorMemorial
    combinedAmount
    combinedDonorName
    combinedDonorSalutation
    combinedDonorSort
    comment
    department
    divFirstGift
    division
    donor1Amount
    donor1Constituency
    donor1Deceased
    donor1Degrees
    donor1GiftKey
    donor1Id
    donor1Name
    donor1Pm
    donor1Relation
    donor1TitleBar
    donor2Amount
    donor2Constituency
    donor2Deceased
    donor2Degrees
    donor2GiftKey
    donor2Id
    donor2Name
    donor2Pm
    donor2Relation
    donor2TitleBar
    effectiveDate
    gikDescription
    gikType
    hcUnit
    holdingDestination
    id
    idSorter
    jvDocDate
    jvDocNum
    matchingGift
    onlineGift
    pledgedAmount
    pledgedDate
    processDate
    sapDocDate
    sapDocNum
    secShares
    secType
    solicitation
    solicitationCode {
      id
      prefix
      code
      name
    }
    transactionDate
    transactionType
    transmittalSn
    ukFirstGift
  }
`);

const viewDdnDocument = graphql(
  /* GraphQL */ `
    query viewDdnDocument($id: GlobalId!) {
      dailyDepartmentNotification(id: $id) {
        ...ViewDdnFragment
      }
    }
  `,
  [ViewDdnFragment]
);

function RouteComponent() {
  const { ddnId } = useParams({
    from: "/fundraising/ddn/$ddnId/",
  });

  const [{ error, fetching, data }] = useQuery({
    query: viewDdnDocument,
    variables: {
      id: ddnId,
    },
  });

  useQueryStatusWatcher({ error, fetching });

  const fragmentData = readFragment(
    ViewDdnFragment,
    data?.dailyDepartmentNotification
  );

  return (
    <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
      <style>
        {`#ddnTable tbody:nth-child(odd) {
          margin-top: 1rem
        }`}
      </style>
      {fragmentData ? (
        <Descriptions
          title="DDN Details"
          bordered
          column={{
            xxl: 8,
            xl: 6,
            lg: 5,
            md: 5,
            sm: 2,
            xs: 1,
          }}
          layout="vertical"
          size="middle"
          id="ddnTable"
        >
          <Descriptions.Item label="Batch ID">
            {fragmentData.batch.batchNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Batch Type">
            {stringifyDDNBatchType(fragmentData.batch.batchType)}
          </Descriptions.Item>
          <Descriptions.Item label="Combined Amount">
            {fragmentData.combinedAmount}
          </Descriptions.Item>
          <Descriptions.Item label="Combined Donor Name">
            {fragmentData.combinedDonorName}
          </Descriptions.Item>
          <Descriptions.Item label="Combined Donor Salutation">
            {fragmentData.combinedDonorSalutation}
          </Descriptions.Item>
          <Descriptions.Item label="Combined Donor Sort">
            {fragmentData.combinedDonorSort}
          </Descriptions.Item>
          <Descriptions.Item label="Comment">
            {fragmentData.comment}
          </Descriptions.Item>
          <Descriptions.Item label="Solicitation">
            {fragmentData.solicitation}
          </Descriptions.Item>
          <Descriptions.Item label="Solicitation Code">
            {fragmentData.solicitationCode.prefix}
            {fragmentData.solicitationCode.code
              .toString()
              .padStart(4, "0")}: {fragmentData.solicitationCode.name}
          </Descriptions.Item>
          <Descriptions.Item label="Effective Date">
            {fragmentData.effectiveDate}
          </Descriptions.Item>
          <Descriptions.Item label="Pledged Date">
            {fragmentData.pledgedDate}
          </Descriptions.Item>
          <Descriptions.Item label="Process Date">
            {fragmentData.processDate}
          </Descriptions.Item>
          <Descriptions.Item label="Transaction Date">
            {fragmentData.transactionDate}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 1 Amount">
            {fragmentData.donor1Amount}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 1 Constituency">
            {fragmentData.donor1Constituency}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 1 Deceased">
            {fragmentData.donor1Deceased}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 1 Degrees">
            {fragmentData.donor1Degrees}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 1 Gift Key">
            {fragmentData.donor1GiftKey}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 1 ID">
            {fragmentData.donor1Id}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 1 Name">
            {fragmentData.donor1Name}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 1 PM">
            {fragmentData.donor1Pm}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 1 Relation">
            {fragmentData.donor1Relation}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 1 Title Bar">
            {fragmentData.donor1TitleBar}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 2 Amount">
            {fragmentData.donor2Amount}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 2 Constituency">
            {fragmentData.donor2Constituency}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 2 Deceased">
            {fragmentData.donor2Deceased}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 2 Degrees">
            {fragmentData.donor2Degrees}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 2 Gift Key">
            {fragmentData.donor2GiftKey}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 2 ID">
            {fragmentData.donor2Id}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 2 Name">
            {fragmentData.donor2Name}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 2 PM">
            {fragmentData.donor2Pm}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 2 Relation">
            {fragmentData.donor2Relation}
          </Descriptions.Item>
          <Descriptions.Item label="Donor 2 Title Bar">
            {fragmentData.donor2TitleBar}
          </Descriptions.Item>
          <Descriptions.Item label="Account Name">
            {fragmentData.accountName}
          </Descriptions.Item>
          <Descriptions.Item label="Account Number">
            {fragmentData.accountNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Adv Fee Amt Phil">
            {fragmentData.advFeeAmtPhil}
          </Descriptions.Item>
          <Descriptions.Item label="Adv Fee Amt Unit">
            {fragmentData.advFeeAmtUnit}
          </Descriptions.Item>
          <Descriptions.Item label="Adv Fee Cc Phil">
            {fragmentData.advFeeCcPhil}
          </Descriptions.Item>
          <Descriptions.Item label="Adv Fee Cc Unit">
            {fragmentData.advFeeCcUnit}
          </Descriptions.Item>
          <Descriptions.Item label="Adv Fee Status">
            {fragmentData.advFeeStatus}
          </Descriptions.Item>
          <Descriptions.Item label="Behalf Honor Memorial">
            {fragmentData.behalfHonorMemorial}
          </Descriptions.Item>
          <Descriptions.Item label="Department">
            {fragmentData.department}
          </Descriptions.Item>
          <Descriptions.Item label="Div First Gift">
            {fragmentData.divFirstGift}
          </Descriptions.Item>
          <Descriptions.Item label="Division">
            {fragmentData.division}
          </Descriptions.Item>
          <Descriptions.Item label="GIK Description">
            {fragmentData.gikDescription}
          </Descriptions.Item>
          <Descriptions.Item label="GIK Type">
            {fragmentData.gikType}
          </Descriptions.Item>
          <Descriptions.Item label="HC Unit">
            {fragmentData.hcUnit}
          </Descriptions.Item>
          <Descriptions.Item label="Holding Destination">
            {fragmentData.holdingDestination}
          </Descriptions.Item>
          <Descriptions.Item label="ID Sorter">
            {fragmentData.idSorter}
          </Descriptions.Item>
          <Descriptions.Item label="JV Doc Date">
            {fragmentData.jvDocDate}
          </Descriptions.Item>
          <Descriptions.Item label="JV Doc Num">
            {fragmentData.jvDocNum}
          </Descriptions.Item>
          <Descriptions.Item label="Matching Gift">
            {fragmentData.matchingGift}
          </Descriptions.Item>
          <Descriptions.Item label="Online Gift">
            {fragmentData.onlineGift}
          </Descriptions.Item>
          <Descriptions.Item label="Pledged Amount">
            {fragmentData.pledgedAmount}
          </Descriptions.Item>
          <Descriptions.Item label="SAP Doc Date">
            {fragmentData.sapDocDate}
          </Descriptions.Item>
          <Descriptions.Item label="SAP Doc Num">
            {fragmentData.sapDocNum}
          </Descriptions.Item>
          <Descriptions.Item label="Sec Shares">
            {fragmentData.secShares}
          </Descriptions.Item>
          <Descriptions.Item label="Sec Type">
            {fragmentData.secType}
          </Descriptions.Item>
          <Descriptions.Item label="Transaction Type">
            {fragmentData.transactionType}
          </Descriptions.Item>
          <Descriptions.Item label="Transmittal SN">
            {fragmentData.transmittalSn}
          </Descriptions.Item>
          <Descriptions.Item label="UK First Gift">
            {fragmentData.ukFirstGift}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <LoadingRibbon size={96} />
      )}
    </div>
  );
}
