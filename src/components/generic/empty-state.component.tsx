
import { FC } from "react";
import Lottie from 'lottie-react';
import { Center, SimpleGrid, Text } from "@mantine/core";
import { useLottieJson } from "@/utils/useLottieJson";

export type EmptyStateProps = {
  title: string,
  message: string,
};

const EmptyState: FC<EmptyStateProps> = ({ title, message }) => {
  const animData = useLottieJson("../assets/lottie/empty_state.json");
  
  return (
    <Center>
      <SimpleGrid cols={1} spacing="0" verticalSpacing="0">
        <Center>
          <Lottie animationData={animData}
            loop={true}
            autoplay={true}
            style={{ height: 'auto', width: '350px', textAlign: 'center' }} />
        </Center>

        <Text ta={'center'} m={0} p={0} size={'sm'} fw={700}>{title}</Text>
        <div style={{ width: '300px' }}><Text ta={'center'} m={0} p={0} c="dimmed" size={'xs'} fw={500} 
        lineClamp={4}>{message}</Text> </div>

      </SimpleGrid>
    </Center>
  )
};

export default EmptyState;