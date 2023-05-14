import { Conversation } from '@prisma/client';
import React from 'react'

interface ProfileDrawerProps {
  data: Conversation;
  isOpen: boolean;
  onClose: () => void;

}

const ProfileDrawer: React.FC<ProfileDrawerProps> = () => {
  return (
    <div>
      
    </div>
  )
}

export default ProfileDrawer
