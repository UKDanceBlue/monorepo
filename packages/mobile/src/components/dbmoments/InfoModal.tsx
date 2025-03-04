import { Button, Center, Modal, Text } from "native-base";

export const InfoModal = ({
  setShowModal,
  showModal,
}: {
  setShowModal: (val: boolean) => void;
  showModal: boolean;
}) => {
  return (
    <Center>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>#DBMoments Information</Modal.Header>
          <Modal.Body>
            <Text>Hey cool peoples!{"\n"}</Text>
            <Text style={{ fontFamily: "opensans-condensed-light" }}>
              DBMoments is a way for you to show your pre-marathon, during
              marathon, and post-marathon selves! Save these moments and share
              them on your social media and tag us!
            </Text>
            <Text>{"\n"}-DB Tech &lt;3</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Fo sho
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};
