import { Text, View } from "native-base";

const Breadcrumbs = ({
  pageName, includeBreadcrumbs, previousPage
}: { pageName:string; includeBreadcrumbs:boolean; previousPage:string }) => {
  function ReturnElement() {
    if (includeBreadcrumbs) {
      return <View><Text fontSize="lg" fontFamily="mono" marginLeft={"3"}>{`< ${previousPage}`}</Text></View>;
    }
  }

  return (
    <View>
      <Text
        bg={"primary.700"}
        color={"secondary.400"}
        textAlign="center"
        fontSize="lg"
        fontFamily="body"
        bold>{pageName}</Text>

      {ReturnElement()}
    </View>
  );
};
export default Breadcrumbs;
