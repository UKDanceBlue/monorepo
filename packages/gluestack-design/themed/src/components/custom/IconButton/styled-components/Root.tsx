import { styled } from '@gluestack-ui/themed';
import { Pressable } from 'react-native';

export default styled(Pressable, {}, {
  componentName: 'IconButton',
  descendantStyle: ['_text', '_spinner', '_icon'],
  ancestorStyle: ['_button'],
} as const);
