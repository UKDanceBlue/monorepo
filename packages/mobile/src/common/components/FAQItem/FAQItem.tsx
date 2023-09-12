import { Text, VStack, View } from "native-base";

const FAQItem = ({
  question, answer
}: { question:string; answer:string }) => {
  return (
    <VStack variant="card">
      <View variant="card-title-box">
        <Text
          variant="card-title">
          {question}
        </Text>
      </View>
      <Text variant="card-text">
        {answer}
      </Text>
    </VStack>
  );
};

export default FAQItem;
