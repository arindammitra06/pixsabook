import { Alert, Title,Text } from "@mantine/core"
import { IconAlertCircle, IconExclamationCircle, IconFlag, IconPlayerStop } from "@tabler/icons-react"
import { ReactElement } from "react"

export enum AlertType {
  SUCCESS,
  ERROR,
  WARN,
  MESSAGE,
  OTHERS
}


export const buildAnAlert = (title: string, message: string, type: AlertType): ReactElement => {
  return (
    <Alert icon={type === AlertType.SUCCESS ? <IconFlag size="1.2rem" /> : type === AlertType.ERROR ? <IconExclamationCircle size="1.2rem" /> : <IconAlertCircle size="1.2rem" />}
      color={type === AlertType.SUCCESS ? 'green' : type === AlertType.ERROR ? 'red' : type === AlertType.WARN ? 'orange' : type === AlertType.MESSAGE ? 'blue' : 'gray'}
      mb={10}
      radius="md"
      title={<Title order={4} fw={600}  c={type === AlertType.SUCCESS ? 'green.7' : type === AlertType.ERROR ? 'red.7' : type === AlertType.WARN ? 'orange.7' : type === AlertType.MESSAGE ? 'blue.7' : 'gray.7'}>
        {title}
      </Title>}
      style={{ border: `0.5px solid ${type === AlertType.SUCCESS ? 'green' : type === AlertType.ERROR ? 'red' : type === AlertType.WARN ? 'orange' : type === AlertType.MESSAGE ? 'blue.1' : 'gray'}` }}
      p={6}>

      <Text fw={400} fz="sm"  c={'gray.7'}>
        {message}
      </Text>
    </Alert>)
}