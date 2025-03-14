import Heading from "@theme/Heading";
import clsx from "clsx";
import type { ReactNode } from "react";

import styles from "./styles.module.css";

interface FeatureItem {
  title: string;
  description: ReactNode;
}

const FeatureList: FeatureItem[] = [
  {
    title: "Server",
    description: (
      <>
        DanceBlue's server is a Node.js application that serves a GraphQL API to
        the client. The server is responsible for handling all of the business
        logic and data storage for the application.
      </>
    ),
  },
  {
    title: "Mobile",
    description: (
      <>
        DanceBlue's mobile application is built using React Native. The mobile
        application is responsible for providing a native experience to users
        and is designed to be used by team members throughout the year, and by
        participants during the marathon.
      </>
    ),
  },
  {
    title: "Portal",
    description: (
      <>
        The DanceBlue portal is a web application built using React. The portal
        is designed to be used by committee members and team captains.
      </>
    ),
  },
];

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center"></div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
