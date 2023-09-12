import { Center, Column, Modal, Text } from "native-base";

import { NotificationInfoPopup } from "../../../types/NotificationPayload";
import { FirestoreImageView } from "../FirestoreImageView/FirestoreImageView";

export default function NotificationInfoModal(props: { isNotificationInfoOpen: boolean; onNotificationInfoClose: () => void; notificationInfoPopupContent: NotificationInfoPopup | null }) {
  return (<Modal
    isOpen={props.isNotificationInfoOpen}
    onClose={props.onNotificationInfoClose}
    avoidKeyboard
    justifyContent="center"
    size="xl">
    {props.notificationInfoPopupContent != null && (<Modal.Content>
      <Modal.CloseButton />
      <Modal.Header>
        <Text>{props.notificationInfoPopupContent.title}
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Column>
          {props.notificationInfoPopupContent.image != null && (
            <Center>
              <FirestoreImageView source={props.notificationInfoPopupContent.image} />
            </Center>)}
          <Text>
            {props.notificationInfoPopupContent.message}
          </Text>
        </Column>
      </Modal.Body>
    </Modal.Content>)}
  </Modal>);
}
