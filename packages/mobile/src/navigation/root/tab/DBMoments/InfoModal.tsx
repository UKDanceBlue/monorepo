import { Button, Center, Modal } from "native-base";

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
          <Modal.Header>DBMoments Information</Modal.Header>
          <Modal.Body></Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Close
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};
