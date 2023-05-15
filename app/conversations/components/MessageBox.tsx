import { FullMessageType } from '@/app/types'
import React from 'react'

interface MessageBoxProps {
  data: FullMessageType,
  isLatest: boolean
}

const MessageBox: React.FC<MessageBoxProps> = ({
  data, 
  isLatest
}) => {
  return (
    <div>
      
    </div>
  )
}

export default MessageBox
